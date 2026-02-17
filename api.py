from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib
import pandas as pd
from decision_engine import score_customer

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



# ----------------------------
# Health Check
# ----------------------------
@app.get("/")
def root():
    return {"message": "Pre-Delinquency Model API is running"}


# ----------------------------
# Scoring Endpoint
# ----------------------------
@app.post("/score")
def score(input_data: CustomerInput):

    # Convert to dictionary
    customer_dict = input_data.dict()

    # Call your decision engine
    result = score_customer(customer_dict)

    return result
