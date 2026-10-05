from pydantic import BaseModel


class SoilAnalysisRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    pH: float
    moisture: float
    organicMatter: float
    soil_type: str = "Unknown"