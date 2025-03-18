from flask import Flask, request, jsonify
import joblib
import numpy as np
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load the model at startup
MODEL_PATH = "svm_model4.pkl"
try:
    model = joblib.load(MODEL_PATH)
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    model = None

# Helper function to parse binary (1/0) values safely
def parse_binary(value):
    try:
        return int(value)
    except ValueError:
        return None  # Return None for invalid values

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        # Get JSON data from request
        data = request.get_json()
        logger.info(f"Received data: {data}")

        # Validate required fields
        required_fields = ["age", "gender", "municipality", "year", "barangay", "symptoms"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Extract data
        age = float(data["age"])
        gender = int(data["gender"])
        municipality = data["municipality"]
        year = data["year"]
        barangay = data["barangay"]
        symptoms = [parse_binary(s) for s in data["symptoms"]]

        # Ensure all symptoms are valid binary values (0 or 1)
        if None in symptoms or len(symptoms) != 16:
            return jsonify({"error": "Invalid symptoms. Must be a list of 16 binary (0/1) values."}), 400

        # Prepare input features
        features = np.array(symptoms).reshape(1, -1)
        logger.info(f"Features: {features}")

        # Get prediction probability
        probabilities = model.predict_proba(features)[0]  # Get probabilities for both classes
        positive_class_probability = probabilities[1]  # Probability of class 1 (positive class)

        # Convert to percentage
        probability_percentage = positive_class_probability * 100
        logger.info(f"Prediction probability: {probability_percentage:.2f}%")

        # Return response as JSON
        return jsonify({
            "prediction_probability": f"{probability_percentage:.2f}%",
            "raw_probability": positive_class_probability
        })

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    from os import getenv
    port = int(getenv("PORT", 5000))  # Railway sets the PORT automatically
    app.run(host="0.0.0.0", port=port)

