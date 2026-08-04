from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.db.session import Base

class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # Relationships
    ocean_observations = relationship("OceanObservation", back_populates="region", cascade="all, delete-orphan")
    fisheries_records = relationship("FisheriesRecord", back_populates="region", cascade="all, delete-orphan")
    biodiversity_records = relationship("BiodiversityRecord", back_populates="region", cascade="all, delete-orphan")
    insights = relationship("AIInsight", back_populates="region", cascade="all, delete-orphan")
