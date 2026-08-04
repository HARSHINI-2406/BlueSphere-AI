from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base

class OceanObservation(Base):
    __tablename__ = "ocean_observations"

    id = Column(Integer, primary_key=True, index=True)
    region_id = Column(Integer, ForeignKey("regions.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, index=True, nullable=False)
    sst = Column(Float, nullable=False)  # Sea Surface Temperature in °C
    chlorophyll = Column(Float, nullable=False)  # Chlorophyll in mg/m³
    salinity = Column(Float, nullable=False)  # Salinity in PSU
    current_u = Column(Float, nullable=False)  # Current velocity (Zonal) in m/s
    current_v = Column(Float, nullable=False)  # Current velocity (Meridional) in m/s
    anomaly_score = Column(Float, default=0.0)  # IsolationForest output
    is_anomaly = Column(Boolean, default=False)  # Outlier flag

    # Relationships
    region = relationship("Region", back_populates="ocean_observations")
