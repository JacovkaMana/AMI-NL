# Use the official Python image from the Docker Hub
FROM python:3.8

# Set the working directory
WORKDIR /app/backend

# Copy the pyproject.toml and poetry.lock files
COPY pyproject.toml poetry.lock* ./

# Install Poetry
RUN pip install poetry

# Install dependencies
RUN poetry install --no-root

# Copy the backend code
COPY . .

# Command to run the application
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
