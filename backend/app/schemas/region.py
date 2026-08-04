from pydantic import BaseModel

class RegionBase(BaseModel):
    name: str
    latitude: float
    longitude: float

class RegionCreate(RegionBase):
    pass

class Region(RegionBase):
    id: int

    class Config:
        from_attributes = True
