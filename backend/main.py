from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.main import router as api_router
from core.config import init_neo4j
from api.routes import chat_rooms

app = FastAPI(
    title="D&D Character Manager API",
    description="""
    The D&D Character Manager API provides endpoints for managing user accounts and D&D characters.
    
    ## Features
    
    * **Users** - Create and manage user accounts
    * **Characters** - Create and manage D&D characters
    * **Authentication** - Secure endpoint access with JWT tokens
    * **Images** - Handle character and user profile images
    
    ## Authentication
    
    All protected endpoints require a valid JWT token in the Authorization header:
    `Authorization: Bearer <token>`
    """,
    version="1.0.0",
    contact={
        "name": "Your Name",
        "email": "your.email@example.com",
    },
)

# Mount static files directory
app.mount("/media", StaticFiles(directory="media"), name="media")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize Neo4j on startup
@app.on_event("startup")
async def startup_event():
    init_neo4j()


# Include the API routes
app.include_router(api_router, prefix="/api")
app.include_router(chat_rooms.router, prefix="/api", tags=["chat"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
