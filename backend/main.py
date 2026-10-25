from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date
from typing import Dict, Any

from elexon_client import fetch_actuals, fetch_forecasts
from analysis import process_data

app = FastAPI(
    title="Gridbricks Energy Analytics API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://frontend-two-mocha-44.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str
    message: str

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ok", 
        message="Gridbricks backend is running."
    )

@app.get("/api/analysis", response_model=Dict[str, Any])
def get_analysis(
    start_date: date = Query(default=date(2026, 1, 1)),
    end_date: date = Query(default=date(2026, 1, 31))
):
    try:
        actuals = fetch_actuals(start_date, end_date)
        forecasts = fetch_forecasts(start_date, end_date)
        result = process_data(actuals, forecasts)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))