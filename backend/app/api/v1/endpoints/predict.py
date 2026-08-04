from fastapi import APIRouter
from app.schemas.fisheries import AbundancePredictRequest, AbundancePredictResponse
from app.ai.predictor import predictor

router = APIRouter()

@router.post("/", response_model=AbundancePredictResponse)
def predict_abundance(payload: AbundancePredictRequest):
    score, level, rec = predictor.predict_abundance(
        sst=payload.sst,
        chlorophyll=payload.chlorophyll,
        salinity=payload.salinity
    )
    return {
        "predicted_abundance": round(score, 2),
        "abundance_level": level,
        "recommendation": rec
    }
