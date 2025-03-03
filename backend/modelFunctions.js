export async function makePrediction(inputData) {
  try {
    const response = await fetch("https://dengue-g8ge.onrender.com/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result.prediction; // Ensure backend sends prediction in JSON
  } catch (error) {
    console.error("Prediction error:", error);
    throw error;
  }
}
