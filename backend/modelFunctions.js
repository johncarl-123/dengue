import { readFileSync } from 'fs';
import { join } from 'path';
import * as tf from '@tensorflow/tfjs-node';

// Load the model (ensure the path is correct)
const modelPath = join(process.cwd(), 'backend', 'backend', 'rf_model.pkl');

// Function to make a prediction
export async function makePrediction(inputData) {
  try {
    // Convert the input data to a tensor
    const inputTensor = tf.tensor([Object.values(inputData)]);

    // Predict (replace with your model's prediction code)
    const prediction = await model.predict(inputTensor).dataSync();

    return prediction[0];
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
}
