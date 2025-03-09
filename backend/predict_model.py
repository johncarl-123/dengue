import sys
import joblib
import numpy as np
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper function to parse binary (1/0) values
def parse_binary(value):
    return int(value)

try:
    logger.info("Starting prediction script...")

    # Get arguments from command line
    args = sys.argv[1:]
    logger.info(f"Arguments received: {args}")

    # Load the model
    model_path = args[0]
    logger.info(f"Loading model from: {model_path}")
    with open(model_path, 'rb') as f:
        model = joblib.load(f)

    # Parse input parameters
    age = float(args[1])
    gender = int(args[2])
    municipality = args[3]
    year = args[4]  # Capture year
    barangay = args[5]  # Capture barangay

    # Parse the 16 binary symptoms from the command line arguments
    symptoms = [parse_binary(arg) for arg in args[6:22]]  # Adjusted the slicing for the 16 symptoms
    logger.info(f"Symptoms: {symptoms}")

    # Only use the symptoms for prediction
    features = np.array(symptoms).reshape(1, -1)
    logger.info(f"Features: {features}")

    # Get the predicted probability (output for the positive class)
    probabilities = model.predict_proba(features)[0]  # The probabilities for both classes
    positive_class_probability = probabilities[1]  # Probability of class 1 (positive class)

    # Convert the probability to a percentage
    probability_percentage = positive_class_probability * 100
    logger.info(f"Prediction probability: {probability_percentage:.2f}%")

    # Output the probability as a percentage
    print(f"Prediction probability: {probability_percentage:.2f}%")

except Exception as e:
    logger.error(f"Error in prediction script: {e}")
    sys.exit(1)