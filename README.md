# Gridbricks Wind Forecast Analytics

A full-stack energy analytics dashboard developed for the Gridbricks Full Stack Software Engineer hiring challenge. The application compares UK wind generation forecasts with actual generation using data from the Elexon BMRS API.

## Live Application

- **Frontend Dashboard:** https://frontend-two-mocha-44.vercel.app/
- **Backend API:** https://gridbricks-challenge-one.vercel.app
- **GitHub Repository:** https://github.com/TEJASWADPILLEWAR7/gridbricks-challenge

## Overview

Electricity procurement teams rely on renewable generation forecasts when making day-ahead electricity purchasing decisions. Since wind generation depends on weather conditions, forecast errors affect the understanding of how much additional electricity may be needed.

This application helps users explore forecasts, compare them with actual generation, and evaluate forecast accuracy quantitatively.

The analysis focuses on January 2026 purchasing decisions and national-level wind generation data from Elexon.

## Features

- Forecast versus actual generation charts.
- Forecast publication timestamps and delivery intervals.
- Forecast error visualization.
- Accuracy metrics: MAE, Mean Error (Bias), RMSE, and MAPE.
- Delivery-interval data inspection.
- Responsive dashboard interface.
- Python backend for data processing and API endpoints.
- Docker-based local development configuration.

## Technology Stack

**Frontend**

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Recharts
- Lucide React

**Backend**

- Python 3.11
- FastAPI
- Pandas
- HTTPX
- Pytest

**Infrastructure**

- Docker
- Docker Compose
- Vercel

## Data Sources

- [Elexon FUELHH — Actual Generation](https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/FUELHH/stream)
- [Elexon WINDFOR — Wind Generation Forecasts](https://bmrs.elexon.co.uk/api-documentation/endpoint/datasets/WINDFOR/stream)

## Forecast Selection Methodology

The analysis is designed to select the latest eligible forecast for each delivery interval using its publication timestamp.

The process is:

1. Retrieve wind generation forecast records.
2. Apply the configured day-ahead decision cutoff.
3. Select the latest eligible forecast for each delivery interval.
4. Match forecasts with actual generation for the same delivery interval.
5. Calculate accuracy metrics using valid matched observations.

The current implementation uses a **12:00 UTC day-ahead cutoff**. This is an analytical assumption and should be verified against the purchasing rules relevant to the intended decision.

### Forecast Error Convention

`Forecast Error = Forecast Generation - Actual Generation`

- Positive error indicates overforecasting.
- Negative error indicates underforecasting.
- Zero error indicates an exact forecast.

### Accuracy Metrics

| Metric            | Meaning                          |
| ----------------- | -------------------------------- |
| MAE               | Mean absolute forecast error     |
| Mean Error (Bias) | Average signed forecast error    |
| RMSE              | Root mean squared forecast error |
| MAPE              | Mean absolute percentage error   |

MAPE requires special handling when actual generation is zero or close to zero. Metric values should be interpreted alongside their valid observation counts.

## Project Structure

The project contains a React frontend, Python backend, and Docker configuration.

```text
gridbricks-challenge/
├── frontend/
├── backend/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

See the repository for the actual source files and directory structure.

## Running Locally with Docker

### Prerequisites

- Git
- Docker Desktop
- Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/TEJASWADPILLEWAR7/gridbricks-challenge.git
cd gridbricks-challenge
```

### 2. Start Docker Desktop

Ensure Docker Desktop is running.

### 3. Build and start the application

```bash
docker compose up --build
```

Open the local frontend and backend using the ports configured in the Docker Compose file.

### 4. Stop the application

Press `Ctrl + C`, then run:

```bash
docker compose down
```

## Backend API

The backend is deployed at:

https://gridbricks-challenge-one.vercel.app

If interactive API documentation is enabled, it may be available at:

https://gridbricks-challenge-one.vercel.app/docs

## Testing

The backend uses Pytest for automated testing.

Run tests from the backend directory using the project's configured Python environment:

```bash
python -m pytest
```

Important test areas include forecast cutoff eligibility, latest eligible forecast selection, interval alignment, missing and duplicate records, accuracy metric calculations, and API error handling.

## Limitations

- The analysis uses Elexon wind forecast and actual generation data only.
- Forecast accuracy alone does not establish financial savings or an optimal procurement strategy.
- Results depend on the configured decision cutoff and the historical records available.
- Missing or unmatched records may reduce the number of observations used in the metrics.
- MAPE can be misleading or undefined when actual generation is zero or very small.

## Development Disclosure

AI tools were used for development assistance. The project should be reviewed and tested to ensure that its implementation and analytical results are understood and verified.

## Hiring Challenge

Developed for the Gridbricks Full Stack Software Engineer hiring challenge.
