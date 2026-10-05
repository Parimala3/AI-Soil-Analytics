import os
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")


files = [
    "xgb_nitrogen_gap.pkl",
    "xgb_phosphorus_gap.pkl",
    "xgb_potassium_gap_tuned.pkl",
    "nitrogen_gap_features.pkl",
    "phosphorus_gap_features.pkl",
    "potassium_gap_features.pkl",
    "soil_feature_imputer.pkl",
]


print("=" * 70)
print("SAVED SOIL MODELS INSPECTION")
print("=" * 70)


for filename in files:

    path = os.path.join(MODEL_DIR, filename)

    print("\n" + "-" * 70)
    print(filename)

    if not os.path.exists(path):
        print("FILE NOT FOUND")
        continue

    print("File exists: YES")

    try:

        obj = joblib.load(path)

        print("Object type:", type(obj))

        if hasattr(obj, "feature_names_in_"):
            print(
                "feature_names_in_:",
                list(obj.feature_names_in_)
            )

        if hasattr(obj, "n_features_in_"):
            print(
                "n_features_in_:",
                obj.n_features_in_
            )

        if isinstance(obj, (list, tuple)):
            print("Contents:", obj)

        elif isinstance(obj, dict):
            print("Dictionary keys:", list(obj.keys()))

        else:
            print("Object:", obj)

    except Exception as e:

        print("Could not load:")
        print(e)


print("\n" + "=" * 70)
print("INSPECTION COMPLETE")
print("=" * 70)