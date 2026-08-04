from pydantic import BaseModel
from datetime import datetime

class AIInsightBase(BaseModel):
    region_id: int
    timestamp: datetime
    category: str
    content: str
    confidence: float
    suggested_action: str
    risk_level: str
    time_horizon: str

class AIInsightCreate(AIInsightBase):
    pass

class AIInsight(AIInsightBase):
    id: int

    class Config:
        from_attributes = True
