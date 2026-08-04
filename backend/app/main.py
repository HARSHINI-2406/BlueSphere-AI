from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.services.data_service import seed_db

# Endpoint router imports
from app.api.v1.endpoints import auth, health, ocean, fisheries, biodiversity, insights, predict

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Create database tables if they do not exist
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed database with synthetic regional data
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()
        
    yield
    # Cleanup operations (if any) go here

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    lifespan=lifespan
)

# Set up CORS middleware to allow connections from Vite/React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local testing and client connections, allow wide origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 endpoints
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(health.router, prefix=f"{settings.API_V1_STR}/health", tags=["Health"])
app.include_router(ocean.router, prefix=f"{settings.API_V1_STR}/ocean", tags=["Oceanography"])
app.include_router(fisheries.router, prefix=f"{settings.API_V1_STR}/fisheries", tags=["Fisheries"])
app.include_router(biodiversity.router, prefix=f"{settings.API_V1_STR}/biodiversity", tags=["Biodiversity"])
app.include_router(insights.router, prefix=f"{settings.API_V1_STR}/ai-insights", tags=["AI Insights"])
app.include_router(predict.router, prefix=f"{settings.API_V1_STR}/predict", tags=["AI Abundance Forecaster"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to BlueSphere AI - Unified Oceanographic and Fisheries Data API Portal",
        "documentation": "/docs"
    }
