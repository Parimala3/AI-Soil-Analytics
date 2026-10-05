import os
from typing import Dict, Any

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image


# =========================================================
# PATH
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

DEVICE = torch.device("cpu")


# =========================================================
# IMAGE TRANSFORM
# =========================================================

IMAGE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# =========================================================
# CREATE RESNET-50
# =========================================================

def create_model():

    model = models.resnet50(
        weights=None
    )

    # Your checkpoint has 4 classes
    model.fc = nn.Linear(
        2048,
        4
    )

    return model


# =========================================================
# LOAD MODEL
# =========================================================

SOIL_IMAGE_MODEL = create_model()

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE
)

SOIL_IMAGE_MODEL.load_state_dict(
    checkpoint
)

SOIL_IMAGE_MODEL.to(DEVICE)

SOIL_IMAGE_MODEL.eval()


print("==============================================")
print("SOIL IMAGE MODEL LOADED")
print("==============================================")
print("Model      : ResNet-50")
print("Classes    : 4")
print("Device     : CPU")
print("Status     : OK")
print("==============================================")


# =========================================================
# PREDICT SOIL IMAGE
# =========================================================

def predict_soil_image(
    image: Image.Image
) -> Dict[str, Any]:

    # Convert to RGB
    image = image.convert("RGB")

    # Apply preprocessing
    tensor = IMAGE_TRANSFORM(image)

    # Add batch dimension
    tensor = tensor.unsqueeze(0)

    tensor = tensor.to(DEVICE)

    # Prediction
    with torch.no_grad():

        outputs = SOIL_IMAGE_MODEL(
            tensor
        )

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

        confidence, predicted_class = torch.max(
            probabilities,
            dim=1
        )

    class_index = int(
        predicted_class.item()
    )

    confidence_value = float(
        confidence.item()
    )

    # Return raw class index because
    # the checkpoint does not contain
    # the original class-name mapping.
    return {
        "class_index": class_index,
        "confidence": round(
            confidence_value,
            4
        )
    }