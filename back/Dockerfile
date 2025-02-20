# Use a specific Python version instead of "latest" (more stable)
FROM python:3.10

# Set working directory
WORKDIR /app

# Install Rust and Cargo (needed for watchfiles)
RUN apt-get update && apt-get install -y curl && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    export PATH="$HOME/.cargo/bin:$PATH"

# Copy the requirements file and install dependencies
COPY requirements.txt /app

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . /app

# Expose port for FastAPI
EXPOSE 8000

# Command to run FastAPI with uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
