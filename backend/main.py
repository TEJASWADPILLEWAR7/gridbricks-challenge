from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date
from typing import Dict, Any

# Import our custom modules
from elexon_client import fetch_actuals, fetch_forecasts
from analysis import process_data

# Initialize the FastAPI application
app = FastAPI(
    title="Gridbricks Energy Analytics API",
    description="API for comparing day-ahead wind generation forecasts with actuals.",
    version="1.0.0"
)

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://frontend-two-mocha-44.vercel.app/"]
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
    start_date: date = Query(default=date(2026, 1, 1), description="Start date of the analysis period"),
    end_date: date = Query(default=date(2026, 1, 7), description="End date of the analysis period")
):
    """
    Fetches actuals and forecasts for the specified date range, 
    applies the day-ahead cutoff, and calculates accuracy metrics.
    Defaults to the first week of January 2026 to ensure fast response times during development.
    """
    try:
        # Fetch raw data from Elexon
        actuals = fetch_actuals(start_date, end_date)
        forecasts = fetch_forecasts(start_date, end_date)
        
        # Process and align data, calculate metrics
        result = process_data(actuals, forecasts)
        
        return result
        
    except Exception as e:
        # Prevent internal stack traces from leaking, but provide a useful error message
        raise HTTPException(status_code=500, detail=f"Failed to process analysis: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)