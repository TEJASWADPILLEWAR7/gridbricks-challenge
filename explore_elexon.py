import requests
import json

def fetch_and_save(url: str, params: dict, filename: str):
    print(f"Fetching {filename}...")
    try:
        # Increased timeout to 30 seconds for Elexon API
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        
        # Print a quick summary of the first record
        if isinstance(data, list) and len(data) > 0:
            print(f"\nSuccess! {len(data)} records found for {filename}. First record:")
            print(json.dumps(data[0], indent=2))
        elif 'data' in data and isinstance(data['data'], list) and len(data['data']) > 0:
             print(f"\nSuccess! {len(data['data'])} records found for {filename}. First record:")
             print(json.dumps(data['data'][0], indent=2))
        else:
            print(f"\nAPI returned empty data for {filename}. Response: {data}")
            
    except requests.exceptions.Timeout:
        print(f"\nTimeout error while fetching {filename}. The Elexon API is taking too long.")
    except Exception as e:
        print(f"\nFailed to fetch {filename}: {e}")

if __name__ == "__main__":
    # Elexon Insights Solution Base URL
    BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1/datasets"
    
    # We will test a single day in January 2026 to ensure the query is fast.
    target_date = "2026-01-01"
    
    # 1. Fetch Actual Generation (FUELHH)
    # Querying by settlementDate is the primary index and much faster.
    fuelhh_params = {
        "settlementDateFrom": target_date,
        "settlementDateTo": target_date,
        "fuelType": "WIND" 
    }
    fetch_and_save(f"{BASE_URL}/FUELHH/stream", fuelhh_params, "sample_actuals.json")
    
    # 2. Fetch Forecast Generation (WINDFOR)
    # Using settlementDate ensures we get forecasts targeting this specific delivery day.
    windfor_params = {
        "settlementDateFrom": target_date,
        "settlementDateTo": target_date
    }
    fetch_and_save(f"{BASE_URL}/WINDFOR/stream", windfor_params, "sample_forecasts.json")