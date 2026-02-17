import pandas as pd
import numpy as np

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
