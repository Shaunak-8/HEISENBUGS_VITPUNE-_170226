from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import joblib
import pandas as pd
from decision_engine import score_customer
from database import (
    init_db, is_seeded, seed_database, seed_rules,
    save_scoring_result, get_dashboard_stats, get_risk_overview,
    get_monitoring_data, get_scoring_history, get_rules, update_rule
)

# ----------------------------
# Load Model Once (at startup)
# ----------------------------
model = joblib.load("pre_delinquency_model.pkl")

app = FastAPI(title="Pre-Delinquency Risk API")

# ----------------------------
# CORS Configuration
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Database Initialization
# ----------------------------
@app.on_event("startup")
def startup():
    init_db()
    seed_rules()
    if not is_seeded():
        seed_database()


# ----------------------------
# Input Schema
# ----------------------------
class CustomerInput(BaseModel):
    week: int
    avg_salary_delay: float
    avg_liquidity_ratio: float
    liquidity_trend: float
    total_failed_autodebits: int
    avg_utility_delay: float
    avg_atm_withdrawals: float
    total_lending_app_txns: int
    stress_type: Optional[str] = None  # Optional - auto-detected by backend


class RuleUpdate(BaseModel):
    is_active: Optional[bool] = None
    threshold: Optional[float] = None
    secondary_threshold: Optional[float] = None
    operator: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None


# ----------------------------
# Health Check
# ----------------------------
@app.get("/")
def root():
    return {"message": "Pre-Delinquency Model API is running"}


# ----------------------------
# Scoring Endpoint (saves to DB)
# ----------------------------
@app.post("/score")
def score(input_data: CustomerInput):
    customer_dict = input_data.dict()

    # Load active rules from database
    rules = get_rules()
    active_rules = [r for r in rules if r["is_active"]]

    # Score with configurable rules
    result = score_customer(customer_dict, rules=active_rules)

    # Generate customer ID and save to database
    import random
    customer_id = f"C-{random.randint(1, 9999):04d}"
    save_scoring_result(customer_id, customer_dict, result)

    return {**result, "customer_id": customer_id}


# ----------------------------
# Simulate Endpoint (NO DB save)
# ----------------------------
@app.post("/simulate")
def simulate(input_data: CustomerInput):
    """Score a customer without saving to DB. For What-If simulator."""
    customer_dict = input_data.dict()

    # Load active rules
    rules = get_rules()
    active_rules = [r for r in rules if r["is_active"]]

    result = score_customer(customer_dict, rules=active_rules)
    return result


# ----------------------------
# Dashboard Endpoint
# ----------------------------
@app.get("/dashboard")
def dashboard():
    return get_dashboard_stats()


# ----------------------------
# Risk Overview Endpoint
# ----------------------------
@app.get("/risk-overview")
def risk_overview():
    return get_risk_overview()


# ----------------------------
# Monitoring Endpoint
# ----------------------------
@app.get("/monitoring")
def monitoring():
    return get_monitoring_data()


# ----------------------------
# Scoring History Endpoint
# ----------------------------
@app.get("/scoring-history")
def scoring_history():
    return get_scoring_history()


# ----------------------------
# Rules Engine Endpoints
# ----------------------------
@app.get("/rules")
def list_rules():
    return get_rules()


@app.patch("/rules/{rule_id}")
def patch_rule(rule_id: int, updates: RuleUpdate):
    update_dict = {k: v for k, v in updates.dict().items() if v is not None}
    if "is_active" in update_dict:
        update_dict["is_active"] = 1 if update_dict["is_active"] else 0
    update_rule(rule_id, update_dict)
    return {"status": "updated", "rule_id": rule_id}
