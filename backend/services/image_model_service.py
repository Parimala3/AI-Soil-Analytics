import os
from PIL import Image

import torch
import torch.nn as nn
from torchvision import models, transforms


# =========================================================
# PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "resnet50_finetuned_final.pth"
)


# =========================================================
# DEVICE
# =========================================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# =========================================================
# SOIL CLASSES
# =========================================================

# The model has 4 output classes.
# These are the soil classes used by the application.

CLASS_NAMES = [
    "Alluvial Soil",
    "Black Soil",
    "Clay Soil",
    "Red Soil"
]


# =========================================================
# IMAGE TRANSFORMATION
# =========================================================

IMAGE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[
            0.485,
            0.456,
            0.406
        ],
        std=[
            0.229,
            0.224,
            0.225
        ]
    )
])


# =========================================================
# CREATE RESNET50 MODEL
# =========================================================

def create_model():

    model = models.resnet50(
        weights=None
    )

    model.fc = nn.Linear(
        2048,
        4
    )

    return model


# =========================================================
# LOAD MODEL
# =========================================================

MODEL = create_model()

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE
)

MODEL.load_state_dict(
    checkpoint
)

MODEL.to(DEVICE)

MODEL.eval()


# =========================================================
# MODEL STATUS
# =========================================================

print("==============================================")
print("SOIL IMAGE MODEL LOADED")
print("==============================================")
print("Model       : ResNet50")
print("Classes     : 4")
print("Device      :", DEVICE)
print("Model file  :", MODEL_PATH)
print("==============================================")


# =========================================================
# PREDICT SOIL IMAGE
# =========================================================

def predict_soil_image(image):

    """
    Predict soil type from an uploaded image.

    image can be:
        - PIL Image
        - uploaded image converted to PIL Image
    """

    # -----------------------------------------------------
    # Convert image to RGB
    # -----------------------------------------------------

    image = image.convert("RGB")


    # -----------------------------------------------------
    # Transform image
    # -----------------------------------------------------

    input_tensor = IMAGE_TRANSFORM(
        image
    )


    # -----------------------------------------------------
    # Add batch dimension
    # -----------------------------------------------------

    input_tensor = input_tensor.unsqueeze(
        0
    )


    # -----------------------------------------------------
    # Move to device
    # -----------------------------------------------------

    input_tensor = input_tensor.to(
        DEVICE
    )


    # -----------------------------------------------------
    # Prediction
    # -----------------------------------------------------

    with torch.no_grad():

        output = MODEL(
            input_tensor
        )

        probabilities = torch.softmax(
            output,
            dim=1
        )

        confidence, predicted_class = torch.max(
            probabilities,
            dim=1
        )


    # -----------------------------------------------------
    # Convert prediction
    # -----------------------------------------------------

    class_index = int(
        predicted_class.item()
    )

    confidence_value = float(
        confidence.item()
    )

    soil_type = CLASS_NAMES[
        class_index
    ]


    # -----------------------------------------------------
    # Return result
    # -----------------------------------------------------

    return {
        "soil_type": soil_type,
        "confidence": round(
            confidence_value * 100,
            2
        ),
        "class_index": class_index
    }