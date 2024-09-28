# Dockerfile for Backend (FastAPI)
FROM python:latest

# Set working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . /app

# Expose port for FastAPI
EXPOSE 8000

# Command to run FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
