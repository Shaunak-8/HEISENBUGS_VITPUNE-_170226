import joblib
import pandas as pd
import shap
import numpy as np

# Load trained model
model = joblib.load("pre_delinquency_model.pkl")

# Initialize SHAP TreeExplainer once at module load
explainer = shap.TreeExplainer(model)

FEATURE_NAMES = [
    "week", "avg_salary_delay", "avg_liquidity_ratio", "liquidity_trend",
    "total_failed_autodebits", "avg_utility_delay", "avg_atm_withdrawals",
    "total_lending_app_txns"
]

FEATURE_LABELS = {
    "week": "Week",
    "avg_salary_delay": "Salary Delay",
    "avg_liquidity_ratio": "Liquidity Ratio",
    "liquidity_trend": "Liquidity Trend",
    "total_failed_autodebits": "Failed Autodebits",
    "avg_utility_delay": "Utility Delay",
    "avg_atm_withdrawals": "ATM Withdrawals",
    "total_lending_app_txns": "Lending App Txns",
}


def get_shap_explanation(customer_data):
    """
    Compute SHAP values for a single customer prediction.
    Returns per-feature contributions to the risk score.
    """
    model_features = {k: v for k, v in customer_data.items() if k in FEATURE_NAMES}
    df = pd.DataFrame([model_features])

    shap_values = explainer.shap_values(df)

    # For binary classification, shap_values is [class_0, class_1]
    # We want class_1 (default probability) contributions
    if isinstance(shap_values, list):
        sv = shap_values[1][0]  # class 1, first (only) sample
        base_value = explainer.expected_value[1]
    else:
        sv = shap_values[0]
        base_value = explainer.expected_value

    contributions = []
    for i, feature in enumerate(FEATURE_NAMES):
        if feature in model_features:
            contributions.append({
                "feature": FEATURE_LABELS.get(feature, feature),
                "feature_key": feature,
                "value": float(model_features[feature]),
                "contribution": round(float(sv[i]), 4),
            })

    # Sort by absolute contribution (most impactful first)
    contributions.sort(key=lambda x: abs(x["contribution"]), reverse=True)

    return {
        "base_value": round(float(base_value), 4),
        "contributions": contributions,
    }


def detect_stress_type(features):
    """
    Auto-detect financial stress level based on customer behavior.
    
    Returns: "Severe", "Moderate", or "Stable"
    """
    # Extract key stress indicators
    salary_delay = features.get("avg_salary_delay", 0)
    failed_autodebits = features.get("total_failed_autodebits", 0)
    liquidity_ratio = features.get("avg_liquidity_ratio", 1.0)
    utility_delay = features.get("avg_utility_delay", 0)
    lending_app_txns = features.get("total_lending_app_txns", 0)
    
    # Severe stress indicators
    severe_conditions = [
        salary_delay >= 5,              # Salary 5+ days late
        failed_autodebits >= 3,         # 3+ failed payments
        liquidity_ratio < 0.8,          # Less than 80% liquidity
        lending_app_txns >= 5,          # Heavy payday loan usage
        utility_delay >= 7              # Utilities 7+ days late
    ]
    
    # Moderate stress indicators
    moderate_conditions = [
        salary_delay >= 2,              # Salary 2+ days late
        failed_autodebits >= 1,         # Any failed payments
        liquidity_ratio < 1.2,          # Tight liquidity
        lending_app_txns >= 2,          # Some payday loan usage
        utility_delay >= 3              # Utilities 3+ days late
    ]
    
    # Count how many severe/moderate flags are triggered
    severe_count = sum(severe_conditions)
    moderate_count = sum(moderate_conditions)
    
    # Classification logic
    if severe_count >= 2:
        return "Severe"
    elif moderate_count >= 3:
        return "Moderate"
    else:
        return "Stable"

def assign_risk_band(prob):
    """
    Assign risk band based on delinquency probability.
    
    Thresholds:
    - High: >= 50% (1 in 2 chance of default - immediate action needed)
    - Medium: 30-50% (concerning trend - proactive monitoring)
    - Low: < 30% (acceptable risk - routine monitoring)
    """
    if prob >= 0.50:
        return "High"
    elif prob >= 0.30:
        return "Medium"
    else:
        return "Low"

def apply_business_rules(features, probability, base_risk, rules=None):
    """
    Apply business rules to adjust risk level.
    If rules is provided (from DB), use those. Otherwise use hardcoded defaults.
    """
    risk = base_risk
    monitoring_flag = False
    triggered_rules = []

    if rules is not None:
        # Use configurable rules from database
        for rule in rules:
            if not rule.get("is_active", True):
                continue

            field_val = features.get(rule["condition_field"], 0)
            op = rule["operator"]
            threshold = rule["threshold"]

            triggered = False
            if op == ">=" and field_val >= threshold:
                triggered = True
            elif op == "<=" and field_val <= threshold:
                triggered = True
            elif op == ">" and field_val > threshold:
                triggered = True
            elif op == "<" and field_val < threshold:
                triggered = True
            elif op == "==" and field_val == threshold:
                triggered = True

            # For compound rules (e.g., severe + probability > 0.2)
            if rule.get("secondary_field"):
                sec_val = features.get(rule["secondary_field"], 0)
                if rule["secondary_field"] == "probability":
                    sec_val = probability
                sec_op = rule.get("secondary_operator", ">=")
                sec_thresh = rule.get("secondary_threshold", 0)
                if sec_op == ">=" and sec_val < sec_thresh:
                    triggered = False
                elif sec_op == ">" and sec_val <= sec_thresh:
                    triggered = False

            if triggered:
                action = rule["action_type"]
                if action == "escalate_high":
                    risk = "High"
                elif action == "escalate_medium" and risk == "Low":
                    risk = "Medium"
                elif action == "set_monitoring":
                    monitoring_flag = True
                triggered_rules.append(rule["name"])
    else:
        # Fallback: hardcoded rules
        stress_type = features.get("stress_type", "Stable")

        # Rule 1: Severe stress escalation
        if stress_type == "Severe" and probability > 0.20:
            risk = "High"
            triggered_rules.append("Severe Stress Escalation")

        # Rule 2: Liquidity crashing
        if features.get("liquidity_trend", 0) < -2:
            risk = "High"
            triggered_rules.append("Liquidity Crash Override")

        # Rule 3: Multiple failed autodebits
        if features.get("total_failed_autodebits", 0) >= 3:
            if risk == "Low":
                risk = "Medium"
            triggered_rules.append("Failed Autodebit Escalation")

        # Rule 4: ATM spike monitoring
        if features.get("avg_atm_withdrawals", 0) > 10:
            monitoring_flag = True
            triggered_rules.append("ATM Spike Monitoring")

    # Priority Mapping
    if risk == "High":
        priority = "P1"
        decision = "Immediate Intervention"
        action = "Call within 24 hours"
    elif risk == "Medium":
        priority = "P2"
        decision = "Proactive Monitoring"
        action = "Call within 72 hours"
    else:
        priority = "P3"
        decision = "Passive Monitoring"
        action = "Monitor weekly"

    return {
        "final_risk": risk,
        "priority": priority,
        "decision": decision,
        "action": action,
        "monitoring_flag": monitoring_flag,
        "triggered_rules": triggered_rules,
    }

def score_customer(customer_data, rules=None):
    
    # Auto-detect stress type based on financial indicators
    # This overrides any manual input from the frontend
    auto_stress_type = detect_stress_type(customer_data)
    
    # Create features dict without stress_type for model prediction
    model_features = {k: v for k, v in customer_data.items() if k != "stress_type"}
    
    df = pd.DataFrame([model_features])

    probability = model.predict_proba(df)[0][1]

    base_risk = assign_risk_band(probability)

    # Add auto-detected stress_type to customer_data for business rules
    customer_data_with_stress = {**customer_data, "stress_type": auto_stress_type}
    
    policy_output = apply_business_rules(
        customer_data_with_stress,
        probability,
        base_risk,
        rules=rules
    )

    # Get SHAP explanation
    shap_explanation = get_shap_explanation(customer_data)

    return {
        "probability": round(float(probability), 4),
        "base_risk": base_risk,
        "detected_stress_type": auto_stress_type,
        "shap_explanation": shap_explanation,
        **policy_output
    }
