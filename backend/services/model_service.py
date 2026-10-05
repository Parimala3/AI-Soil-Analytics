import os
import joblib
import pandas as pd
import xgboost as xgb


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)


# =========================================================
# FEATURE LISTS
# =========================================================

N_FEATURES = [
    "pH",
    "alb",
    "bio1",
    "bio12",
    "bio15",
    "bio7",
    "cec20",
    "dows",
    "ecec20",
    "hp20",
    "ls",
    "lstd",
    "lstn",
    "mb1",
    "mb2",
    "mb3",
    "mb7",
    "mdem",
    "para",
    "parv",
    "ph20",
    "slope",
    "snd20",
    "soc20",
    "tim",
    "wp",
    "xhp20",
    "BulkDensity"
]

P_FEATURES = N_FEATURES.copy()

K_FEATURES = N_FEATURES.copy()


# =========================================================
# MODEL FILE PATHS
# =========================================================

N_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "xgb_nitrogen_gap.json"
)

P_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "xgb_phosphorus_gap.json"
)

K_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "xgb_potassium_gap_tuned.json"
)

IMPUTER_PATH = os.path.join(
    MODEL_DIR,
    "soil_feature_imputer.pkl"
)


# =========================================================
# LOAD XGBOOST MODELS
# =========================================================

N_MODEL = xgb.XGBRegressor()

N_MODEL.load_model(
    N_MODEL_PATH
)


P_MODEL = xgb.XGBRegressor()

P_MODEL.load_model(
    P_MODEL_PATH
)


K_MODEL = xgb.XGBRegressor()

K_MODEL.load_model(
    K_MODEL_PATH
)


# =========================================================
# LOAD SOIL FEATURE IMPUTER
# =========================================================

SOIL_IMPUTER = joblib.load(
    IMPUTER_PATH
)


# =========================================================
# STATUS
# =========================================================

print("==============================================")
print("SOIL ML MODELS LOADED")
print("==============================================")
print("Nitrogen model      : OK")
print("Phosphorus model    : OK")
print("Potassium model     : OK")
print("Soil imputer        : OK")
print("==============================================")


# =========================================================
# CREATE MODEL INPUT
# =========================================================

def create_feature_dataframe(
    features,
    values
):
    """
    Create a DataFrame using the exact feature
    order expected by the trained model.
    """

    data = {}

    for feature in features:

        if feature in values:
            data[feature] = values[feature]
        else:
            data[feature] = None

    return pd.DataFrame(
        [data],
        columns=features
    )


# =========================================================
# PREDICT NUTRIENT GAPS
# =========================================================

def predict_nutrient_gaps(
    features: dict
):
    """
    Predict N, P and K nutrient gaps.

    IMPORTANT:
    The trained models require 28 features.
    Missing features are passed to the saved
    imputer rather than manually inventing values.
    """

    # -----------------------------------------------------
    # Nitrogen
    # -----------------------------------------------------

    n_df = create_feature_dataframe(
        N_FEATURES,
        features
    )

    n_df = SOIL_IMPUTER.transform(
        n_df
    )

    nitrogen_gap = float(
        N_MODEL.predict(n_df)[0]
    )


    # -----------------------------------------------------
    # Phosphorus
    # -----------------------------------------------------

    p_df = create_feature_dataframe(
        P_FEATURES,
        features
    )

    p_df = SOIL_IMPUTER.transform(
        p_df
    )

    phosphorus_gap = float(
        P_MODEL.predict(p_df)[0]
    )


    # -----------------------------------------------------
    # Potassium
    # -----------------------------------------------------

    k_df = create_feature_dataframe(
        K_FEATURES,
        features
    )

    k_df = SOIL_IMPUTER.transform(
        k_df
    )

    potassium_gap = float(
        K_MODEL.predict(k_df)[0]
    )


    # -----------------------------------------------------
    # FINAL RESULT
    # -----------------------------------------------------

    return {
        "nitrogen_gap": nitrogen_gap,
        "phosphorus_gap": phosphorus_gap,
        "potassium_gap": potassium_gap
    }