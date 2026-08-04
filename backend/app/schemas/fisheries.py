from pydantic import BaseModel
from datetime import datetime

class FisheriesRecordBase(BaseModel):
    region_id: int
    timestamp: datetime
    catch_tonnes: float
    predicted_abundance: float
    abundance_level: str
    recommendation: str
    sst: float
    chlorophyll: float
    salinity: float

class FisheriesRecordCreate(FisheriesRecordBase):
    pass

class FisheriesRecord(FisheriesRecordBase):
    id: int

    class Config:
        from_attributes = True

class AbundancePredictRequest(BaseModel):
    sst: float
    chlorophyll: float
    salinity: float

class AbundancePredictResponse(BaseModel):
    predicted_abundance: float
    abundance_level: str
    recommendation: str
