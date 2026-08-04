from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from app.db.session import Base

class BiodiversityRecord(Base):
    __tablename__ = "biodiversity_records"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    species_name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # "Microbial" | "Coral" | "Pelagic" | "Demersal"
    count = Column(Integer, nullable=False)  # Sample population count
    conservation_status = Column(String, nullable=False)  # "Least Concern" | "Vulnerable" | "Endangered"
    risk_score = Column(Float, default=0.0)  # General ecosystem risk indicator (0 - 100)
    coral_bleaching_index = Column(Float, default=0.0)  # Specific to corals (0 - 100)
    microbial_health_index = Column(Float, default=0.0)  # Specific to microbial density (0 - 100)

    # Relationships
    region = relationship("Region", back_populates="biodiversity_records")
