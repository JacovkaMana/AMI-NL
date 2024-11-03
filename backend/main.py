from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.main import router as api_router
from core.config import init_neo4j

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Initialize Neo4j on startup
@app.on_event("startup")
async def startup_event():
    init_neo4j()


# Include the API routes
app.include_router(api_router, prefix="/api", tags=["API"])


# Handle OPTIONS requests
@app.options("/{full_path:path}")
async def options_handler():
    return {}  # Return empty response for OPTIONS requests


# Run the application
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
