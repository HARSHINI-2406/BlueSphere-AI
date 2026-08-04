from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.insight import AIInsight as InsightSchema
from app.services import data_service

router = APIRouter()

@router.get("/", response_model=List[InsightSchema])
def get_insights(
    region_id: int = Query(None, description="Filter by region ID"),
    db: Session = Depends(get_db)
):
    return data_service.get_ai_insights(db, region_id=region_id)
