from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
from PIL import Image
import numpy as np
from sklearn.ensemble import VotingClassifier
import torch
import torchvision


app = Flask(__name__)
CORS(app)

# Load models
model_paths = [
    "googlenet_model_animal_10.pkl",  
    "googlenet_model_animal_20.pkl",
    "googlenet_model_animal_30.pkl"
]

models = []
for path in model_paths:
    with open(path, "rb") as f:
        models.append(pickle.load(f))

# Ensemble voting setup
def ensemble_prediction(image_array):
    predictions = [model.predict(image_array) for model in models]
    # Majority voting for ensemble
    final_prediction = max(set(predictions), key=predictions.count)
    return final_prediction

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded."}), 400

    image_file = request.files["image"]
    image = Image.open(image_file).convert("RGB").resize((224, 224))  # Resizing to 224x224
    image_array = np.array(image).reshape(1, -1)  # Flatten for models

    # Ensemble prediction
    result = ensemble_prediction(image_array)

    return jsonify({"prediction": str(result)})

if __name__ == "__main__":
    app.run(debug=True)
