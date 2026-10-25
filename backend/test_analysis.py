import pytest
from datetime import date
from analysis import process_data

# --- Mock Data Fixtures ---
# Delivery interval: Jan 2, 2026 at 14:00 UTC
# Therefore, the Day-Ahead Cutoff is Jan 1, 2026 at 12:00 UTC.

mock_actuals = [
    {
        "dataset": "FUELHH",
        "startTime": "2026-01-02T14:00:00Z",
        "generation": 100.0
    }
]

mock_forecasts = [
    {
        # Forecast 1: Published Jan 1 at 10:00 UTC (ELIGIBLE - Before 12:00 cutoff)
        "dataset": "WINDFOR",
        "startTime": "2026-01-02T14:00:00Z",
        "publishTime": "2026-01-01T10:00:00Z",
        "generation": 110.0
    },
    {
        # Forecast 2: Published Jan 1 at 14:00 UTC (NOT ELIGIBLE - After 12:00 cutoff)
        "dataset": "WINDFOR",
        "startTime": "2026-01-02T14:00:00Z",
        "publishTime": "2026-01-01T14:00:00Z",
        "generation": 95.0
    }
]

def test_day_ahead_cutoff_selection():
    """
    Tests that the system selects Forecast 1 (110.0) and strictly ignores 
    Forecast 2 (95.0) because Forecast 2 was published after the 12:00 PM cutoff.
    """
    result = process_data(mock_actuals, mock_forecasts)
    
    intervals = result["intervals"]
    assert len(intervals) == 1
    
    selected_interval = intervals[0]
    
    # It should have selected the 110.0 forecast, not the 95.0 one.
    assert selected_interval["forecast_generation"] == 110.0
    
    # Error should be Forecast (110) - Actual (100) = 10
    assert selected_interval["error"] == 10.0
    assert selected_interval["abs_error"] == 10.0

def test_accuracy_metrics_calculation():
    """
    Tests that MAE, Bias, and MAPE are calculated perfectly based on the selected eligible forecast.
    """
    result = process_data(mock_actuals, mock_forecasts)
    metrics = result["metrics"]
    
    assert metrics["valid_pairs_count"] == 1
    assert metrics["MAE"] == 10.0
    assert metrics["Bias"] == 10.0  # Overforecasted by 10
    
    # MAPE = (|110 - 100| / 100) * 100 = 10.0%
    assert metrics["MAPE"] == 10.0

def test_empty_data_handling():
    """
    Tests that the system safely handles empty upstream data without crashing.
    """
    result = process_data([], [])
    assert len(result["intervals"]) == 0
    assert result["metrics"] == {}