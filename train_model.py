import pandas as pd
import lightgbm as lgb
import shap
import matplotlib.pyplot as plt
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, precision_score, recall_score, f1_score

df = pd.read_csv("model_ready_data.csv")

X = df.drop(columns=["default_next_30_days", "customer_id"])
y = df["default_next_30_days"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.4, random_state=42, stratify=y
)

model = lgb.LGBMClassifier(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=6,
    random_state=42
)

model.fit(X_train, y_train)

y_proba = model.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, y_proba)

print("\n================ MODEL PERFORMANCE ================")
print("AUC Score:", round(auc, 4))

importance_df = pd.DataFrame({
    "feature": X.columns,
    "importance": model.feature_importances_
}).sort_values(by="importance", ascending=False)

print("\nFeature Importance:")
print(importance_df)

def assign_risk_band(prob):
    if prob >= 0.25:
        return "High"
    elif prob >= 0.10:
        return "Medium"
    else:
        return "Low"

risk_bands = pd.Series(y_proba).apply(assign_risk_band)

risk_df = pd.DataFrame({
    "risk_band": risk_bands,
    "default_next_30_days": y_test.reset_index(drop=True)
})

print("\n================ RISK SEGMENTATION ================")
print("\nRisk Band Distribution:")
print(risk_df["risk_band"].value_counts())

print("\nDefault Rate by Risk Band:")
print(risk_df.groupby("risk_band")["default_next_30_days"].mean())

thresholds = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35]

print("\n================ THRESHOLD TUNING ================")
print("Thresh | Precision | Recall | F1 | Customers Flagged")

for t in thresholds:
    preds = (y_proba >= t).astype(int)

    precision = precision_score(y_test, preds)
    recall = recall_score(y_test, preds)
    f1 = f1_score(y_test, preds)
    flagged = preds.sum()

    print(f"{t:6} | {precision:.3f}     | {recall:.3f} | {f1:.3f} | {flagged}")

print("\n================ BUSINESS IMPACT SIMULATION ================")

# Use 0.25 as chosen high-risk threshold
high_risk_preds = (y_proba >= 0.25).astype(int)

high_risk_customers = high_risk_preds.sum()
actual_defaults = ((high_risk_preds == 1) & (y_test == 1)).sum()

avg_loss_per_default = 50000      # ₹50,000 assumed
intervention_cost = 500           # ₹500 per flagged customer
intervention_success_rate = 0.4   # 40% defaults prevented

loss_without_intervention = actual_defaults * avg_loss_per_default
loss_prevented = actual_defaults * intervention_success_rate * avg_loss_per_default
cost_of_intervention = high_risk_customers * intervention_cost

net_savings = loss_prevented - cost_of_intervention

print(f"\nHigh Risk Customers Flagged: {high_risk_customers}")
print(f"Actual Defaults in High Risk: {actual_defaults}")

print(f"\nExpected Loss WITHOUT Intervention: ₹{loss_without_intervention:,}")
print(f"Expected Loss Prevented (40% success): ₹{loss_prevented:,}")
print(f"Total Intervention Cost: ₹{cost_of_intervention:,}")

print(f"\nNet Savings from Early Intervention: ₹{net_savings:,}")

joblib.dump(model, "pre_delinquency_model.pkl")
print("\nModel saved successfully as pre_delinquency_model.pkl")

print("\nGenerating SHAP summary plot...")

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

if isinstance(shap_values, list):
    shap_values = shap_values[1]

shap.summary_plot(shap_values, X_test)
plt.show()
