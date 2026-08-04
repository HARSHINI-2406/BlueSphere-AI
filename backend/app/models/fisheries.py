from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from app.db.session import Base

class FisheriesRecord(Base):
    __tablename__ = "fisheries_records"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    catch_tonnes = Column(Float, nullable=False)  # Historical actual fish catch
    predicted_abundance = Column(Float, nullable=False)  # ML abundance score (0 - 100)
    abundance_level = Column(String, nullable=False)  # "High" | "Medium" | "Low"
    recommendation = Column(String, nullable=False)  # Potential Fishing Zone instruction
    sst = Column(Float, nullable=False)  # Captured feature for correlation
    chlorophyll = Column(Float, nullable=False)  # Captured feature for correlation
    salinity = Column(Float, nullable=False)  # Captured feature for correlation

    # Relationships
    region = relationship("Region", back_populates="fisheries_records")
