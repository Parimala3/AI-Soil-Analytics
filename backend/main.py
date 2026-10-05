from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image
from io import BytesIO

from schemas import SoilAnalysisRequest
from services.soil_analysis import analyze_soil
from services.image_model_service import predict_soil_image


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title="AI Soil Analytics API",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000"
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "AI Soil Analytics API is running"
    }


# =========================================================
# IMAGE SOIL ANALYSIS
# =========================================================

@app.post("/api/analyze-image")
async def analyze_image(
    file: UploadFile = File(...)
):

    # -----------------------------------------------------
    # Validate file type
    # -----------------------------------------------------

    allowed_types = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ]

    if file.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, PNG or WEBP image."
        )


    # -----------------------------------------------------
    # Read image
    # -----------------------------------------------------

    try:

        contents = await file.read()

        image = Image.open(
            BytesIO(contents)
        )


    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Unable to read the uploaded image."
        )


    # -----------------------------------------------------
    # Predict soil type
    # -----------------------------------------------------

    try:

        prediction = predict_soil_image(
            image
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Image analysis failed: {str(e)}"
        )


    # -----------------------------------------------------
    # Return result
    # -----------------------------------------------------

    return {
        "success": True,
        "soil_type": prediction["soil_type"],
        "confidence": prediction["confidence"],
        "class_index": prediction["class_index"]
    }


# =========================================================
# NUMERIC SOIL ANALYSIS
# =========================================================

@app.post("/api/analyze")
def soil_analysis(
    request: SoilAnalysisRequest
):

    result = analyze_soil(

        nitrogen=request.nitrogen,

        phosphorus=request.phosphorus,

        potassium=request.potassium,

        pH=request.pH,

        moisture=request.moisture,

        organicMatter=request.organicMatter,

        soil_type=request.soil_type
    )

    return result