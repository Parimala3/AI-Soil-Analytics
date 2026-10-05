# AI-Powered Soil Analytics System

## Project Overview

The AI-Powered Soil Analytics System is a machine learning-based project designed to analyze soil using soil images and structured soil data. The system aims to assess soil characteristics, identify nutrient gaps, and provide intelligent recommendations for improving soil health and crop suitability.

## Current Progress

### Milestone 1 – Data Ingestion & Preparation
- Dataset collection and analysis
- AgriNet structured soil dataset analysis
- Soil image dataset analysis
- Image preprocessing
- Structured data preprocessing
- Exploratory Data Analysis (EDA)
- PostgreSQL database schema design

### Milestone 2 – AI/ML Soil Analysis Engine
- Soil image classification using ResNet-50 with transfer learning
- Classification of four soil types:
  - Alluvial Soil
  - Black Soil
  - Clay Soil
  - Red Soil
- Nutrient-gap prediction using XGBoost
- Nitrogen, Phosphorus, and Potassium gap analysis
- Model evaluation using standard ML metrics
- Explainable AI using Grad-CAM and SHAP
- Hybrid soil assessment combining image classification and nutrient analysis
- Soil-health score generation

## Model Performance

The soil image classification model achieved:

- Accuracy: 92.08%
- Precision: 92.53%
- Recall: 92.08%
- F1-Score: 92.24%

The XGBoost nutrient-gap models were developed for Nitrogen, Phosphorus, and Potassium prediction.

## Explainable AI

The project uses:

- **Grad-CAM** to visualize important regions of soil images influencing CNN predictions.
- **SHAP** to understand the contribution of structured soil features to nutrient-gap predictions.

## Repository Structure

```text
AI-Soil-Analytics/
├── data/
├── notebooks/
├── models/
├── outputs/
├── reports/
├── database/
├── src/
├── README.md
└── requirements.txt
