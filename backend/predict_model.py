import sys
import joblib
import numpy as np

# Load the model from the provided path
model_path = sys.argv[1]
model = joblib.load(model_path)

# Helper function to parse binary (1/0) values
def parse_binary(value):
    return int(value)

try:
    # Parse input parameters
    age = float(sys.argv[2])
    gender = int(sys.argv[3])
    municipality = sys.argv[4]
    year = sys.argv[5]  # Capture year
    barangay = sys.argv[6] # Capture barangay

    # Parse the 16 binary symptoms from the command line arguments
    symptoms = [parse_binary(arg) for arg in sys.argv[7:23]] # Adjusted the slicing for the 16 symptoms


    # Only use the symptoms for prediction
    features = np.array(symptoms).reshape(1, -1)

    # Get the predicted probability (output for the positive class)
    probabilities = model.predict_proba(features)[0]  # The probabilities for both classes
    positive_class_probability = probabilities[1]  # Probability of class 1 (positive class)

    # Convert the probability to a percentage
    probability_percentage = positive_class_probability * 100

    print(f"Prediction probability: {probability_percentage:.2f}%")  # Output the probability as a percentage

except Exception as e:
    print("Error:", e)
    sys.exit(1)