from decision_engine import score_customer

sample = {
    "week": 10,
    "avg_salary_delay": 3,
    "avg_liquidity_ratio": 1.2,
    "liquidity_trend": -3,
    "total_failed_autodebits": 2,
    "avg_utility_delay": 4,
    "avg_atm_withdrawals": 8,
    "total_lending_app_txns": 5
}

result = score_customer(sample)

print("\nDecision Output:")
print(result)
