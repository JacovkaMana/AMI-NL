from fastapi import FastAPI
from backend.app.api.main import app as api_app

app = FastAPI()

# Include the API routessd
app.include_router(api_app, prefix="/api", tags=["API"])

# You can add additional middleware, event handlers, etc. here

# Run the application
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
