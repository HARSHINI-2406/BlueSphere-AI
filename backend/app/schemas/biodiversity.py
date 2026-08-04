from pydantic import BaseModel
from datetime import datetime

class BiodiversityRecordBase(BaseModel):
    region_id: int
    timestamp: datetime
    species_name: str
    category: str
    count: int
    conservation_status: str

class BiodiversityRecordCreate(BiodiversityRecordBase):
    pass

class BiodiversityRecord(BiodiversityRecordBase):
    id: int
    risk_score: float
    coral_bleaching_index: float
    microbial_health_index: float

    class Config:
        from_attributes = True
