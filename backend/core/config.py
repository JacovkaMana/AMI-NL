from pydantic import BaseSettings
from datetime import timedelta
import os
from contextlib import asynccontextmanager
from neomodel import config, db
from dotenv import load_dotenv
from fastapi import HTTPException, status

load_dotenv()


class Settings(BaseSettings):
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


settings = Settings()


def init_neo4j():
    try:
        neo4j_url = os.environ.get("NEO4J_URL")
        neo4j_user = os.environ.get("NEO4J_USER")
        neo4j_password = os.environ.get("NEO4J_PASSWORD")

        if not all([neo4j_url, neo4j_user, neo4j_password]):
            raise ValueError("Missing required Neo4j environment variables")

        config.DATABASE_URL = f"bolt://{neo4j_user}:{neo4j_password}@{neo4j_url}"

        # Test the connection
        db.cypher_query("MATCH (n) RETURN n LIMIT 1")

        print("Successfully connected to Neo4j database")
    except Exception as e:
        print(f"Failed to initialize Neo4j: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection failed",
        )


@asynccontextmanager
async def get_neo4j_session():
    try:
        yield db
    except Exception as e:
        print(f"Database session error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database session error",
        )
