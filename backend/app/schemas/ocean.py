from pydantic import BaseModel
from datetime import datetime

class OceanObservationBase(BaseModel):
    region_id: int
    timestamp: datetime
    sst: float
    chlorophyll: float
    salinity: float
    current_u: float
    current_v: float

class OceanObservationCreate(OceanObservationBase):
    pass

class OceanObservation(OceanObservationBase):
    id: int
    anomaly_score: float
    is_anomaly: bool

    class Config:
        from_attributes = True
