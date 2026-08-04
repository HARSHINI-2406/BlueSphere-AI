import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.region import Region
from app.models.ocean import OceanObservation
from app.models.fisheries import FisheriesRecord
from app.models.biodiversity import BiodiversityRecord
from app.models.insights import AIInsight
from app.ai.predictor import predictor

def seed_db(db: Session):
    # Check if we already have data
    if db.query(Region).first() is not None:
        return

    # 1. Define Coastal Regions
    regions_data = [
        {"name": "Chennai", "latitude": 13.0827, "longitude": 80.2707},
        {"name": "Kochi", "latitude": 9.9312, "longitude": 76.2673},
        {"name": "Mumbai", "latitude": 19.0760, "longitude": 72.8777},
        {"name": "Visakhapatnam", "latitude": 17.6868, "longitude": 83.2185},
        {"name": "Port Blair", "latitude": 11.6234, "longitude": 92.7265},
        {"name": "Goa", "latitude": 15.2993, "longitude": 74.1240}
    ]

    regions = []
    for r_data in regions_data:
        region = Region(**r_data)
        db.add(region)
        regions.append(region)
    
    db.commit()
    for r in regions:
        db.refresh(r)

    # 2. Seed Historical Data (30 Days)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    species_pool = [
        {"name": "Indian Oil Sardine", "category": "Pelagic", "status": "Least Concern"},
        {"name": "Indian Mackerel", "category": "Pelagic", "status": "Least Concern"},
        {"name": "Yellowfin Tuna", "category": "Pelagic", "status": "Vulnerable"},
        {"name": "Tiger Prawn", "category": "Demersal", "status": "Least Concern"},
        {"name": "Indian Halibut", "category": "Demersal", "status": "Least Concern"},
        {"name": "Staghorn Coral", "category": "Coral", "status": "Critically Endangered"},
        {"name": "Brain Coral", "category": "Coral", "status": "Endangered"},
        {"name": "Synechococcus Microbe", "category": "Microbial", "status": "Least Concern"},
        {"name": "Prochlorococcus Microbe", "category": "Microbial", "status": "Least Concern"}
    ]

    for region in regions:
        # Base ocean variables to vary slightly over time per region
        base_sst = random.uniform(26.5, 29.5)
        base_chlorophyll = random.uniform(0.5, 2.5)
        base_salinity = random.uniform(32.5, 34.5)

        for d in range(31):
            timestamp = start_date + timedelta(days=d)
            
            # Add day-to-day noise
            sst = base_sst + random.uniform(-0.8, 0.8)
            chlorophyll = max(0.1, base_chlorophyll + random.uniform(-0.4, 0.4))
            salinity = base_salinity + random.uniform(-0.5, 0.5)
            
            # Introduce anomaly events (e.g. Marine Heatwave in Mumbai / Kochi on day 20-25)
            is_anomaly_event = False
            if region.name in ["Kochi", "Mumbai"] and 18 <= d <= 23:
                sst += 3.5  # Heatwave
                chlorophyll -= 0.6
                is_anomaly_event = True
            
            # Predict and evaluate metrics via AI
            pred_score, abundance_level, rec = predictor.predict_abundance(sst, chlorophyll, salinity)
            anomaly_score, is_anomaly = predictor.detect_anomaly(sst, chlorophyll, salinity)
            
            # If we injected heatwave, enforce anomaly flag
            if is_anomaly_event:
                is_anomaly = True
                anomaly_score = max(0.85, anomaly_score)

            # Ocean current speeds
            current_u = random.uniform(-0.4, 0.4)
            current_v = random.uniform(-0.4, 0.4)

            # a) Create Ocean Observation
            observation = OceanObservation(
                region_id=region.id,
                timestamp=timestamp,
                sst=round(sst, 2),
                chlorophyll=round(chlorophyll, 2),
                salinity=round(salinity, 2),
                current_u=round(current_u, 3),
                current_v=round(current_v, 3),
                anomaly_score=round(anomaly_score, 4),
                is_anomaly=is_anomaly
            )
            db.add(observation)

            # b) Create Fisheries Record (Catch tonnes has some historical correlation to predicted score)
            catch_tonnes = max(0.5, (pred_score * random.uniform(0.2, 0.4)) + random.uniform(-2, 2))
            fisheries_rec = FisheriesRecord(
                region_id=region.id,
                timestamp=timestamp,
                catch_tonnes=round(catch_tonnes, 2),
                predicted_abundance=round(pred_score, 2),
                abundance_level=abundance_level,
                recommendation=rec,
                sst=round(sst, 2),
                chlorophyll=round(chlorophyll, 2),
                salinity=round(salinity, 2)
            )
            db.add(fisheries_rec)

            # c) Create Biodiversity Records for the region (sample subset)
            for spec in species_pool:
                # Calculate indicators
                risk_score = 15.0  # default
                coral_index = 0.0
                microbe_index = 0.0

                if spec["category"] == "Coral":
                    # Corals bleached by hot water
                    stress_factor = max(0.0, sst - 29.0)
                    coral_index = min(100.0, stress_factor * 25.0 + random.uniform(0, 10))
                    risk_score = min(100.0, coral_index * 1.1 + 10.0)
                elif spec["category"] == "Microbial":
                    # Microbes thrive in warm, chlorophyll rich water
                    microbe_index = min(100.0, (chlorophyll * 25.0) + (sst * 0.8) + random.uniform(-5, 5))
                    risk_score = min(100.0, max(0.0, 100 - microbe_index))
                else:
                    # Pelagic / Demersal risk relates to temperature anomaly
                    risk_score = min(100.0, (anomaly_score * 80.0) + random.uniform(0, 15))

                count = random.randint(10, 500) if spec["category"] != "Coral" else random.randint(2, 50)
                
                bio_rec = BiodiversityRecord(
                    region_id=region.id,
                    timestamp=timestamp,
                    species_name=spec["name"],
                    category=spec["category"],
                    count=count,
                    conservation_status=spec["status"],
                    risk_score=round(risk_score, 2),
                    coral_bleaching_index=round(coral_index, 2),
                    microbial_health_index=round(microbe_index, 2)
                )
                db.add(bio_rec)

        # 3. Create Region-Specific Natural Language Insights (AI Recommendations)
        insights_data = [
            {
                "category": "Fisheries",
                "content": f"Chlorophyll concentration in {region.name} has increased by 18%, indicating a potential rise in sardine and mackerel abundance over the next 5 days.",
                "confidence": 94.2,
                "suggested_action": "Issue high-yield Potential Fishing Zone (PFZ) advisory to local fishing co-operatives.",
                "risk_level": "Low",
                "time_horizon": "5 Days"
            },
            {
                "category": "Oceanography",
                "content": f"Multi-sensor satellite data reveals localized Sea Surface Temperature anomalies (+2.1°C) forming in {region.name} shelf waters.",
                "confidence": 88.5,
                "suggested_action": "Alert regional marine monitoring stations. Verify data with sub-surface gliders.",
                "risk_level": "Medium",
                "time_horizon": "Next 48 Hours"
            },
            {
                "category": "Biodiversity",
                "content": f"Elevated temperature readings and reduced salinity are increasing thermal stress on sensitive coral species (Staghorn Coral) in {region.name}.",
                "confidence": 91.0,
                "suggested_action": "Deploy sea shading prototypes and initiate reef health survey with remote cameras.",
                "risk_level": "High",
                "time_horizon": "14 Days"
            }
        ]

        for ins in insights_data:
            insight_obj = AIInsight(
                region_id=region.id,
                timestamp=end_date,
                **ins
            )
            db.add(insight_obj)

    db.commit()

# Core Data Retrieval functions
def get_regions(db: Session):
    return db.query(Region).all()

def get_ocean_data(db: Session, region_id: int = None, days: int = 30):
    query = db.query(OceanObservation)
    if region_id:
        query = query.filter(OceanObservation.region_id == region_id)
    cutoff = datetime.now() - timedelta(days=days)
    return query.filter(OceanObservation.timestamp >= cutoff).order_by(OceanObservation.timestamp.asc()).all()

def get_fisheries_data(db: Session, region_id: int = None, days: int = 30):
    query = db.query(FisheriesRecord)
    if region_id:
        query = query.filter(FisheriesRecord.region_id == region_id)
    cutoff = datetime.now() - timedelta(days=days)
    return query.filter(FisheriesRecord.timestamp >= cutoff).order_by(FisheriesRecord.timestamp.asc()).all()

def get_biodiversity_data(db: Session, region_id: int = None, days: int = 30):
    query = db.query(BiodiversityRecord)
    if region_id:
        query = query.filter(BiodiversityRecord.region_id == region_id)
    cutoff = datetime.now() - timedelta(days=days)
    # Order by timestamp and limit or structure appropriately
    return query.filter(BiodiversityRecord.timestamp >= cutoff).order_by(BiodiversityRecord.timestamp.desc()).all()

def get_ai_insights(db: Session, region_id: int = None):
    query = db.query(AIInsight)
    if region_id:
        query = query.filter(AIInsight.region_id == region_id)
    return query.order_by(AIInsight.timestamp.desc()).all()
