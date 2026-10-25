import pytest
from datetime import date
from analysis import process_data

mock_actuals = [
    {
        "dataset": "FUELHH",
        "startTime": "2026-01-02T14:00:00Z",
        "generation": 100.0
    }
]

mock_forecasts = [
    {
        "dataset": "WINDFOR",
        "startTime": "2026-01-02T14:00:00Z",
        "publishTime": "2026-01-01T10:00:00Z",
        "generation": 110.0
    },
    {
        "dataset": "WINDFOR",
        "startTime": "2026-01-02T14:00:00Z",
        "publishTime": "2026-01-01T14:00:00Z",
        "generation": 95.0
    }
]

def test_day_ahead_cutoff_selection():
    result = process_data(mock_actuals, mock_forecasts)

    intervals = result["intervals"]
    assert len(intervals) == 1

    selected_interval = intervals[0]

    assert selected_interval["forecast_generation"] == 110.0

    assert selected_interval["error"] == 10.0
    assert selected_interval["abs_error"] == 10.0

def test_accuracy_metrics_calculation():
    result = process_data(mock_actuals, mock_forecasts)
    metrics = result["metrics"]

    assert metrics["valid_pairs_count"] == 1
    assert metrics["MAE"] == 10.0
    assert metrics["Bias"] == 10.0

    assert metrics["MAPE"] == 10.0

def test_empty_data_handling():
    result = process_data([], [])
    assert len(result["intervals"]) == 0
    assert result["metrics"] == {}