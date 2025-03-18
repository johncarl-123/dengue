from flask import Flask, request, jsonify
import joblib
import numpy as np
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load the model at startup
MODEL_PATH = "svm_model4.pkl"
model = None

try:
    model = joblib.load(MODEL_PATH)
    logger.info("✅ Model loaded successfully.")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")

# Helper function to parse binary (1/0) values safely
def parse_binary(value):
    try:
        value = int(value)
        if value not in [0, 1]:
            raise ValueError("Binary values must be 0 or 1")
        return value
    except ValueError:
        return None  # Return None for invalid values

# Health check endpoint
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"message": "API is running!"})

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        # Get JSON data from request
        data = request.get_json()
        logger.info(f"📩 Received data: {data}")

        # Validate required fields
        required_fields = ["age", "gender", "municipality", "year", "barangay", "symptoms"]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        # Extract and validate input data
        try:
            age = float(data["age"])
            gender = int(data["gender"])
            municipality = data["municipality"]
            year = data["year"]
            barangay = data["barangay"]
            symptoms = [parse_binary(s) for s in data["symptoms"]]
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid data format"}), 400

        # Ensure symptoms are all valid binary values (0 or 1)
        if None in symptoms or len(symptoms) != 16:
            return jsonify({"error": "Symptoms must be a list of 16 binary (0/1) values"}), 400

        # Prepare input features
        features = np.array(symptoms).reshape(1, -1)
        logger.info(f"🧬 Features: {features}")

        # Get prediction probability
        probabilities = model.predict_proba(features)[0]  # Get probabilities for both classes
        positive_class_probability = probabilities[1]  # Probability of class 1 (positive class)

        # Convert to percentage
        probability_percentage = positive_class_probability * 100
        logger.info(f"🔮 Prediction probability: {probability_percentage:.2f}%")

        # Return response as JSON
        return jsonify({
            "prediction_probability": f"{probability_percentage:.2f}%",
            "raw_probability": positive_class_probability
        })

    except Exception as e:
        logger.error(f"🚨 Error during prediction: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))  # Railway sets the PORT automatically
    app.run(host="0.0.0.0", port=port)
