from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.region import Region as RegionSchema
from app.schemas.ocean import OceanObservation as OceanSchema
from app.services import data_service

router = APIRouter()

@router.get("/regions", response_model=List[RegionSchema])
def get_regions(db: Session = Depends(get_db)):
    return data_service.get_regions(db)

@router.get("/observations", response_model=List[OceanSchema])
def get_observations(
    region_id: int = Query(None, description="Filter by region ID"),
    days: int = Query(30, description="Retrieve history in days"),
    db: Session = Depends(get_db)
):
    return data_service.get_ocean_data(db, region_id=region_id, days=days)
