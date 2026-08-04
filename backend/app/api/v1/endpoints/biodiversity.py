from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.biodiversity import BiodiversityRecord as BiodiversitySchema
from app.services import data_service

router = APIRouter()

@router.get("/records", response_model=List[BiodiversitySchema])
def get_records(
    region_id: int = Query(None, description="Filter by region ID"),
    days: int = Query(30, description="Retrieve history in days"),
    db: Session = Depends(get_db)
):
    return data_service.get_biodiversity_data(db, region_id=region_id, days=days)
