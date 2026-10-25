# Use Python 3.11 which has stable pre-compiled wheels for all dependencies
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Upgrade pip and install dependencies with an extended network timeout
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --default-timeout=200 --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]