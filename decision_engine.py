import joblib
import pandas as pd

# Load trained model
model = joblib.load("pre_delinquency_model.pkl")

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

def apply_business_rules(features, probability, base_risk):

    liquidity_trend = features.get("liquidity_trend", 0)
    failed_autodebits = features.get("total_failed_autodebits", 0)
    stress_type = features.get("stress_type", "Stable")

    risk = base_risk
    monitoring_flag = False

    # Rule 1: Severe stress escalation
    if stress_type == "Severe" and probability > 0.20:
        risk = "High"

    # Rule 2: Liquidity crashing
    if liquidity_trend < -2:
        risk = "High"

    # Rule 3: Multiple failed autodebits
    if failed_autodebits >= 3:
        if risk == "Low":
            risk = "Medium"

    # Rule 4: ATM spike monitoring
    if features.get("avg_atm_withdrawals", 0) > 10:
        monitoring_flag = True

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
        "monitoring_flag": monitoring_flag
    }

def score_customer(customer_data):
    
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
        customer_data_with_stress,  # Pass data with auto-detected stress_type
        probability,
        base_risk
    )

    return {
        "probability": round(float(probability), 4),
        "base_risk": base_risk,
        "detected_stress_type": auto_stress_type,  # Include in response
        **policy_output
    }


