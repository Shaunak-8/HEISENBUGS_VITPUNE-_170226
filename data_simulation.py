import pandas as pd
import numpy as np

np.random.seed(42)

NUM_CUSTOMERS = 1000
NUM_WEEKS = 12


# ----------------------------
# Generate Static Customer Data
# ----------------------------
def generate_customers(num_customers):
    customer_ids = np.arange(1, num_customers + 1)

    monthly_income = np.random.randint(30000, 150000, num_customers)
    emi_amount = monthly_income * np.random.uniform(0.1, 0.4, num_customers)
    tenure_remaining = np.random.randint(6, 48, num_customers)
    credit_limit = monthly_income * np.random.uniform(1.0, 3.0, num_customers)

    loan_types = np.random.choice(
        ["Personal Loan", "Auto Loan", "Credit Card"],
        size=num_customers
    )

    stress_types = np.random.choice(
        ["Stable", "Moderate", "Severe"],
        size=num_customers,
        p=[0.6, 0.25, 0.15]
    )

    customers = pd.DataFrame({
        "customer_id": customer_ids,
        "monthly_income": monthly_income,
        "emi_amount": emi_amount,
        "tenure_remaining": tenure_remaining,
        "credit_limit": credit_limit,
        "loan_type": loan_types,
        "stress_type": stress_types
    })

    return customers


# ----------------------------
# Simulate Weekly Behavior
# ----------------------------
def simulate_behavior(customers, num_weeks):
    data = []

    for _, row in customers.iterrows():
        savings_balance = np.random.uniform(0.5, 2.0) * row["monthly_income"]

        for week in range(1, num_weeks + 1):

            if row["stress_type"] == "Stable":
                salary_delay = np.random.randint(0, 2)
                savings_balance *= np.random.uniform(0.99, 1.02)
                failed_autodebits = 0

            elif row["stress_type"] == "Moderate":
                salary_delay = np.random.randint(1, 4)
                savings_balance *= np.random.uniform(0.93, 0.99)
                failed_autodebits = np.random.choice([0, 1], p=[0.8, 0.2])

            else:  # Severe
                salary_delay = np.random.randint(3, 8)
                savings_balance *= np.random.uniform(0.75, 0.90)
                failed_autodebits = np.random.choice([0, 1, 2], p=[0.3, 0.4, 0.3])

            discretionary_spend = np.random.uniform(0.1, 0.3) * row["monthly_income"]
            utility_delay = np.random.randint(0, 10)
            atm_withdrawals = np.random.randint(0, 6)
            lending_app_txns = np.random.randint(0, 5) if row["stress_type"] == "Severe" else np.random.randint(0, 2)

            liquidity_ratio = savings_balance / row["emi_amount"]

            data.append([
                row["customer_id"],
                week,
                salary_delay,
                savings_balance,
                discretionary_spend,
                utility_delay,
                atm_withdrawals,
                failed_autodebits,
                lending_app_txns,
                liquidity_ratio,
                row["stress_type"]
            ])

    columns = [
        "customer_id",
        "week",
        "salary_delay_days",
        "savings_balance",
        "discretionary_spend",
        "utility_payment_delay_days",
        "atm_withdrawals",
        "failed_autodebits",
        "lending_app_txns",
        "liquidity_ratio",
        "stress_type"
    ]

    return pd.DataFrame(data, columns=columns)


# ----------------------------
# Assign Default Label
# ----------------------------
def assign_default(df):

    # Base risk by stress type
    base_risk = df["stress_type"].map({
    "Stable": -4.2,
    "Moderate": -3.6,
    "Severe": -2.8
})

    liquidity_risk = 1 / (df["liquidity_ratio"] + 1e-5)
    failed_risk = df["failed_autodebits"]
    delay_risk = df["salary_delay_days"]
    lending_risk = df["lending_app_txns"]

    # Controlled stress score
    stress_score = (
        base_risk +
        1.2 * liquidity_risk +
        0.6 * failed_risk +
        0.15 * delay_risk +
        0.1 * lending_risk
    )

    # Sigmoid
    probability = 1 / (1 + np.exp(-stress_score))

    # Random sampling
    random_values = np.random.rand(len(df))
    df["default_next_30_days"] = (random_values < probability).astype(int)

    return df

# ----------------------------
# Create Rolling 3-Week Features
# ----------------------------
def create_rolling_features(df):

    df = df.sort_values(["customer_id", "week"])
    feature_rows = []

    for customer_id, group in df.groupby("customer_id"):
        group = group.reset_index(drop=True)

        for i in range(2, len(group)):
            window = group.iloc[i-2:i+1]

            features = {
                "customer_id": customer_id,
                "week": group.iloc[i]["week"],

                "avg_salary_delay": window["salary_delay_days"].mean(),
                "avg_liquidity_ratio": window["liquidity_ratio"].mean(),
                "liquidity_trend": window["liquidity_ratio"].iloc[-1] - window["liquidity_ratio"].iloc[0],
                "total_failed_autodebits": window["failed_autodebits"].sum(),
                "avg_utility_delay": window["utility_payment_delay_days"].mean(),
                "avg_atm_withdrawals": window["atm_withdrawals"].mean(),
                "total_lending_app_txns": window["lending_app_txns"].sum(),

                "default_next_30_days": group.iloc[i]["default_next_30_days"]
            }

            feature_rows.append(features)

    return pd.DataFrame(feature_rows)


# ----------------------------
# Run Entire Pipeline
# ----------------------------
if __name__ == "__main__":

    customers = generate_customers(NUM_CUSTOMERS)
    weekly_data = simulate_behavior(customers, NUM_WEEKS)
    labeled_data = assign_default(weekly_data)

    labeled_data.to_csv("synthetic_weekly_data.csv", index=False)

    feature_data = create_rolling_features(labeled_data)
    feature_data.to_csv("model_ready_data.csv", index=False)

    print("Weekly dataset created!")
    print("Model-ready dataset created!")

    print("\nModel-ready Default Rate:",
          feature_data["default_next_30_days"].mean())

    print("\nDefault Rate by Stress Type (weekly data):")
    print(labeled_data.groupby("stress_type")["default_next_30_days"].mean())
