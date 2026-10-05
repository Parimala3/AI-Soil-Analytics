# =========================================================
# AI SOIL ANALYTICS
# Week 5 Recommendation Engine + Crop Suitability
# =========================================================

# =========================================================
# WEEK 5 CROP KNOWLEDGE BASE
# =========================================================

crop_knowledge_base = {

    "Rice": {
        "soil_types": ["Alluvial soil", "Clay soil"],
        "pH_min": 5.5,
        "pH_max": 7.5
    },

    "Maize": {
        "soil_types": ["Alluvial soil", "Black soil", "Red soil"],
        "pH_min": 5.8,
        "pH_max": 7.5
    },

    "Wheat": {
        "soil_types": ["Alluvial soil", "Black soil"],
        "pH_min": 6.0,
        "pH_max": 7.5
    },

    "Groundnut": {
        "soil_types": ["Red soil", "Alluvial soil"],
        "pH_min": 5.5,
        "pH_max": 7.0
    },

    "Cotton": {
        "soil_types": ["Black soil", "Alluvial soil"],
        "pH_min": 5.5,
        "pH_max": 8.0
    },

    "Chickpea": {
        "soil_types": ["Black soil", "Alluvial soil"],
        "pH_min": 6.0,
        "pH_max": 8.0
    },

    "Sugarcane": {
        "soil_types": ["Alluvial soil", "Black soil"],
        "pH_min": 6.0,
        "pH_max": 8.0
    }
}


# =========================================================
# NUTRIENT SUITABILITY SCORING
# =========================================================

def calculate_nutrient_suitability(
    nitrogen_gap,
    phosphorus_gap,
    potassium_gap,
    crop
):
    """
    Maximum nutrient suitability score = 30.

    A nutrient deficiency reduces the score by 10 points.
    """

    gaps = {
        "Nitrogen": nitrogen_gap,
        "Phosphorus": phosphorus_gap,
        "Potassium": potassium_gap
    }

    score = 30

    for nutrient, gap in gaps.items():

        if gap is None:
            continue

        if gap > 0:
            score -= 10

    return max(0, score)


# =========================================================
# FINAL CROP SUITABILITY SCORING
# =========================================================

def calculate_final_crop_suitability(
    soil_type,
    pH,
    nitrogen_gap,
    phosphorus_gap,
    potassium_gap
):

    crop_results = []

    for crop, requirements in crop_knowledge_base.items():

        # -------------------------------------------------
        # 1. SOIL TYPE SCORE - 40 POINTS
        # -------------------------------------------------

        if soil_type in requirements["soil_types"]:
            soil_type_score = 40
        else:
            soil_type_score = 0

        # -------------------------------------------------
        # 2. pH SCORE - 30 POINTS
        # -------------------------------------------------

        if (
            pH is not None
            and requirements["pH_min"] <= pH <= requirements["pH_max"]
        ):
            ph_score = 30
        else:
            ph_score = 0

        # -------------------------------------------------
        # 3. NUTRIENT SCORE - 30 POINTS
        # -------------------------------------------------

        nutrient_score = calculate_nutrient_suitability(
            nitrogen_gap,
            phosphorus_gap,
            potassium_gap,
            crop
        )

        # -------------------------------------------------
        # 4. FINAL SCORE
        # -------------------------------------------------

        total_score = (
            soil_type_score
            + ph_score
            + nutrient_score
        )

        # -------------------------------------------------
        # 5. SUITABILITY CATEGORY
        # -------------------------------------------------

        if total_score >= 80:
            category = "Highly Suitable"

        elif total_score >= 60:
            category = "Moderately Suitable"

        elif total_score >= 40:
            category = "Less Suitable"

        else:
            category = "Not Suitable"

        crop_results.append({
            "name": crop,
            "soil_type_score": soil_type_score,
            "pH_score": ph_score,
            "nutrient_score": nutrient_score,
            "score": round(total_score, 2),
            "suitability": category
        })

    # -----------------------------------------------------
    # RANK CROPS
    # -----------------------------------------------------

    crop_results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return crop_results


# =========================================================
# MAIN SOIL ANALYSIS FUNCTION
# =========================================================

def analyze_soil(
    nitrogen: float,
    phosphorus: float,
    potassium: float,
    pH: float,
    moisture: float,
    organicMatter: float,
    soil_type: str = "Unknown"
):
    """
    Farmer-facing soil analysis service.

    Includes:

    - Nutrient deficiency detection
    - Soil health scoring
    - pH assessment
    - Soil recommendations
    - Management actions
    - Crop suitability scoring

    ML nutrient-gap models are kept separate because
    they require 28 environmental/geospatial features.
    """

    # =====================================================
    # 1. NUTRIENT DEFICIENCY DETECTION
    # =====================================================

    deficiencies = []

    if nitrogen < 40:
        deficiencies.append("Nitrogen")

    if phosphorus < 40:
        deficiencies.append("Phosphorus")

    if potassium < 40:
        deficiencies.append("Potassium")

    # =====================================================
    # 2. SOIL HEALTH SCORING
    # =====================================================

    nutrient_score = 60

    if len(deficiencies) == 1:
        nutrient_score = 40

    elif len(deficiencies) == 2:
        nutrient_score = 20

    elif len(deficiencies) >= 3:
        nutrient_score = 0

    # -----------------------------------------------------
    # pH SCORE
    # -----------------------------------------------------

    if 6.0 <= pH <= 8.0:
        ph_score = 20
    else:
        ph_score = 10

    # -----------------------------------------------------
    # ORGANIC MATTER SCORE
    # -----------------------------------------------------

    if organicMatter >= 0.5:
        organic_matter_score = 20
    else:
        organic_matter_score = 10

    # -----------------------------------------------------
    # FINAL SOIL HEALTH SCORE
    # -----------------------------------------------------

    soil_health_score = (
        nutrient_score
        + ph_score
        + organic_matter_score
    )

    # -----------------------------------------------------
    # HEALTH LEVEL
    # -----------------------------------------------------

    if soil_health_score >= 80:
        health_level = "Good"

    elif soil_health_score >= 60:
        health_level = "Moderate"

    elif soil_health_score >= 40:
        health_level = "Poor"

    else:
        health_level = "Very Poor"

    # =====================================================
    # 3. pH STATUS
    # =====================================================

    if pH < 6:
        ph_status = "Acidic"

    elif pH > 8:
        ph_status = "Alkaline"

    else:
        ph_status = "Suitable"

    # =====================================================
    # 4. RECOMMENDATIONS
    # =====================================================

    recommendations = []

    # -----------------------------------------------------
    # NITROGEN
    # -----------------------------------------------------

    if "Nitrogen" in deficiencies:

        recommendations.append(
            "Apply nitrogen fertilizer according to the soil test "
            "and crop-specific recommendation."
        )

        recommendations.append(
            "Prefer split application of nitrogen where recommended "
            "for the crop."
        )

    # -----------------------------------------------------
    # PHOSPHORUS
    # -----------------------------------------------------

    if "Phosphorus" in deficiencies:

        recommendations.append(
            "Apply phosphorus fertilizer according to the soil test "
            "and crop-specific recommendation."
        )

        recommendations.append(
            "Use the appropriate phosphorus source recommended "
            "for the crop and soil."
        )

    # -----------------------------------------------------
    # POTASSIUM
    # -----------------------------------------------------

    if "Potassium" in deficiencies:

        recommendations.append(
            "Apply potassium fertilizer according to the soil test "
            "and crop-specific recommendation."
        )

    # -----------------------------------------------------
    # pH RECOMMENDATIONS
    # -----------------------------------------------------

    if pH < 6:

        recommendations.append(
            "Verify soil acidity through soil testing and follow "
            "locally recommended liming practices."
        )

    if pH > 8:

        recommendations.append(
            "Use crop- and soil-specific management practices "
            "for alkaline soil."
        )

    # -----------------------------------------------------
    # ORGANIC MATTER
    # -----------------------------------------------------

    if organicMatter < 0.5:

        recommendations.append(
            "Increase organic matter using suitable organic inputs "
            "such as compost or farmyard manure."
        )

    # -----------------------------------------------------
    # HEALTHY SOIL
    # -----------------------------------------------------

    if not recommendations:

        recommendations.append(
            "Maintain balanced nutrient management."
        )

        recommendations.append(
            "Continue soil testing to monitor nutrient status."
        )

    # =====================================================
    # 5. MANAGEMENT ACTIONS
    # =====================================================

    management_actions = [

        "Maintain balanced NPK nutrition.",

        "Use suitable organic nutrient sources where appropriate.",

        "Continue soil testing to monitor soil condition.",

        "Follow crop-specific nutrient recommendations."
    ]

    # =====================================================
    # 6. FARMER-INPUT NUTRIENT GAPS
    # =====================================================
    #
    # These are used for the current farmer-facing
    # recommendation/crop-suitability layer.
    #
    # 40 is the current deficiency threshold used by
    # the Week 5 rule-based logic.
    #
    # Positive value = deficiency gap.
    # Zero = no deficiency.
    #

    nitrogen_gap = max(
        0,
        40 - nitrogen
    )

    phosphorus_gap = max(
        0,
        40 - phosphorus
    )

    potassium_gap = max(
        0,
        40 - potassium
    )

    # =====================================================
    # 7. CROP SUITABILITY
    # =====================================================

    crop_results = calculate_final_crop_suitability(

        soil_type=soil_type,

        pH=pH,

        nitrogen_gap=nitrogen_gap,

        phosphorus_gap=phosphorus_gap,

        potassium_gap=potassium_gap
    )

    # =====================================================
    # 8. FINAL RESPONSE
    # =====================================================

    return {

        "soil_parameters": {

            "nitrogen": nitrogen,

            "phosphorus": phosphorus,

            "potassium": potassium,

            "pH": pH,

            "moisture": moisture,

            "organicMatter": organicMatter
        },

        "soil_type": soil_type,

        "nutrient_deficiencies": deficiencies,

        "soil_health": {

            "score": soil_health_score,

            "level": health_level,

            "nutrient_score": nutrient_score,

            "pH_score": ph_score,

            "organic_matter_score": organic_matter_score
        },

        "pH_status": ph_status,

        "recommendations": recommendations,

        "management_actions": management_actions,

        "crop_suitability": crop_results,

        "nutrient_gaps": {

            "nitrogen": round(
                nitrogen_gap,
                4
            ),

            "phosphorus": round(
                phosphorus_gap,
                4
            ),

            "potassium": round(
                potassium_gap,
                4
            )
        }
    }