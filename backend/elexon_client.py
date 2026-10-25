import requests
from datetime import date, timedelta
from typing import List, Dict, Any

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"

def fetch_actuals(start_date: date, end_date: date) -> List[Dict[str, Any]]:
    """
    Fetches actual wind generation (FUELHH) for a given date range.
    """
    url = f"{BASE_URL}/FUELHH/stream"
    params = {
        "settlementDateFrom": start_date.isoformat(),
        "settlementDateTo": end_date.isoformat(),
        "fuelType": "WIND"
    }
    
    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    data = response.json()
    
    if isinstance(data, list):
        return data
    return data.get("data", [])

def fetch_forecasts(start_date: date, end_date: date) -> List[Dict[str, Any]]:
    """
    Fetches wind generation forecasts (WINDFOR) for a given date range.
    Using the exact 'publishDateTimeFrom' query parameters required by Elexon.
    """
    url = f"{BASE_URL}/WINDFOR/stream"
    lookback_date = start_date - timedelta(days=2)
    
    params = {
        "publishDateTimeFrom": f"{lookback_date.isoformat()}T00:00:00Z",
        "publishDateTimeTo": f"{end_date.isoformat()}T23:59:59Z"
    }
    
    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    data = response.json()
    
    if isinstance(data, list):
        return data
    return data.get("data", [])

if __name__ == "__main__":
    test_start = date(2026, 1, 1)
    test_end = date(2026, 1, 2)
    
    print("Testing fetch_actuals...")
    actuals = fetch_actuals(test_start, test_end)
    print(f"Retrieved {len(actuals)} actual generation records.")
    
    print("Testing fetch_forecasts...")
    forecasts = fetch_forecasts(test_start, test_end)
    print(f"Retrieved {len(forecasts)} forecast records.")
    
    if forecasts:
        print(f"Sample Forecast startTime: {forecasts[0].get('startTime')}")