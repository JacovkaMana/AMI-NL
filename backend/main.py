from fastapi import FastAPI
from api.main import router as api_router
from core.config import init_neo4j

app = FastAPI()


# Initialize Neo4j on startup
@app.on_event("startup")
async def startup_event():
    init_neo4j()


# Include the API routes
app.include_router(api_router, prefix="/api", tags=["API"])

# You can add additional middleware, event handlers, etc. here

# Run the application
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
