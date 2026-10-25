import pandas as pd
import numpy as np
from typing import List, Dict, Any

def process_data(actuals_data: List[Dict[str, Any]], forecasts_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not actuals_data or not forecasts_data:
        return {"intervals": [], "metrics": {}}

    df_act = pd.DataFrame(actuals_data)
    df_fcst = pd.DataFrame(forecasts_data)

    df_act['startTime'] = pd.to_datetime(df_act['startTime'], utc=True)
    df_fcst['startTime'] = pd.to_datetime(df_fcst['startTime'], utc=True)
    df_fcst['publishTime'] = pd.to_datetime(df_fcst['publishTime'], utc=True)

    df_act = df_act.rename(columns={'generation': 'actual_generation'})
    df_fcst = df_fcst.rename(columns={'generation': 'forecast_generation'})

    delivery_day = df_fcst['startTime'].dt.floor('D')
    df_fcst['cutoffTime'] = delivery_day - pd.Timedelta(days=1) + pd.Timedelta(hours=12)

    eligible_fcst = df_fcst[df_fcst['publishTime'] <= df_fcst['cutoffTime']].copy()

    latest_fcst = eligible_fcst.sort_values('publishTime').groupby('startTime', as_index=False).last()

    df_merged = pd.merge(
        df_act[['startTime', 'actual_generation']],
        latest_fcst[['startTime', 'forecast_generation', 'publishTime', 'cutoffTime']],
        on='startTime',
        how='outer'
    )
    df_merged = df_merged.sort_values('startTime').reset_index(drop=True)

    df_merged['error'] = df_merged['forecast_generation'] - df_merged['actual_generation']
    df_merged['abs_error'] = df_merged['error'].abs()

    valid_pairs = df_merged.dropna(subset=['actual_generation', 'forecast_generation']).copy()

    metrics = {
        "MAE": None,
        "Bias": None,
        "RMSE": None,
        "MAPE": None,
        "valid_pairs_count": len(valid_pairs)
    }

    if not valid_pairs.empty:
        metrics["MAE"] = float(valid_pairs['abs_error'].mean())
        metrics["Bias"] = float(valid_pairs['error'].mean())
        metrics["RMSE"] = float(np.sqrt((valid_pairs['error'] ** 2).mean()))

        non_zero_actuals = valid_pairs[valid_pairs['actual_generation'] != 0]
        if not non_zero_actuals.empty:
            mape_val = (non_zero_actuals['abs_error'] / non_zero_actuals['actual_generation']).mean() * 100
            metrics["MAPE"] = float(mape_val)

    df_merged = df_merged.replace({np.nan: None})

    for col in ['startTime', 'publishTime', 'cutoffTime']:
        df_merged[col] = pd.to_datetime(df_merged[col]).dt.strftime('%Y-%m-%dT%H:%M:%SZ')

    return {
        "intervals": df_merged.to_dict(orient='records'),
        "metrics": metrics
    }

if __name__ == "__main__":
    from elexon_client import fetch_actuals, fetch_forecasts
    from datetime import date

    test_start = date(2026, 1, 1)
    test_end = date(2026, 1, 2)

    print("Fetching raw data...")
    raw_act = fetch_actuals(test_start, test_end)
    raw_fcst = fetch_forecasts(test_start, test_end)

    print("Processing analysis...")
    result = process_data(raw_act, raw_fcst)

    print("\nMetrics Calculated:")
    for key, value in result['metrics'].items():
        if isinstance(value, float):
            print(f"  {key}: {value:.2f}")
        else:
            print(f"  {key}: {value}")

    if result['intervals']:
        print("\nSample Interval (First Record):")
        print(result['intervals'][0])