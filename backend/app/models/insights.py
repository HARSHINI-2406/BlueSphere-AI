from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    category = Column(String, nullable=False)  # "Oceanography" | "Fisheries" | "Biodiversity"
    content = Column(Text, nullable=False)  # The AI-generated insight text
    confidence = Column(Float, nullable=False)  # Percentage score (e.g. 95.0)
    suggested_action = Column(Text, nullable=False)  # Actionable guidelines
    risk_level = Column(String, nullable=False)  # "High" | "Medium" | "Low"
    time_horizon = Column(String, nullable=False)  # "Next 48 Hours" | "5 Days" | "Seasonal"

    # Relationships
    region = relationship("Region", back_populates="insights")
