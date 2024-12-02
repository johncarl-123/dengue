import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';
import path from 'path';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Configure MySQL database connection
const dbConfig = {
  host: 'localhost',
  user: 'dengue_carl',
  password: 'carl123',
  database: 'dengue',
};

// Check database connection on server start
(async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Successfully connected to the MySQL database!");
    await connection.end();
  } catch (error) {
    console.error("Error connecting to the MySQL database:", error);
  }
})();

// Prediction endpoint
app.post('/predict', async (req, res) => {
  const {
    age = 0, 
    gender = 'unknown', 
    municipality = 'unknown',
    fever = 0, 
    allergy = 0, 
    colds = 0, 
    chestPain = 0, 
    suka = 0, 
    headache = 0, 
    cough = 0, 
    stomachache = 0, 
    soreThroat = 0, 
    nausea = 0, 
    backPain = 0, 
    jointPain = 0, 
    noseBleed = 0, 
    wateryStool = 0, 
    preOrbitalPain = 0, 
    bodyMalaise = 0,
  } = req.body;

  console.log('Received data:', req.body);

  const pythonArgs = [
    'svm_model4.pkl',
    age || 0,
    gender.toLowerCase() === 'male' ? '1' : '0',
    municipality || 'unknown',
    fever, allergy, colds, chestPain, suka,
    headache, cough, stomachache, soreThroat, nausea, backPain, jointPain,
    noseBleed, wateryStool, preOrbitalPain, bodyMalaise,
  ].map(String);

  const options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: __dirname,
    args: pythonArgs,
  };

  try {
    // Run the Python prediction script
    const results = await new Promise((resolve, reject) => {
      PythonShell.run('predict_model.py', options, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const prediction = results ? parseFloat(results[0].match(/[\d.]+/)[0]) : null;
    console.log("Prediction probability percentage:", prediction);

    if (prediction !== null) {
      // Connect to the MySQL database and insert data
      const connection = await mysql.createConnection(dbConfig);
      const query = `
        INSERT INTO predict (age, gender, municipality, fever, allergies, colds, cp,
        vomiting, headache, cough, stomach, st, nausea, bp, jp, nosebleeds, ws, eyes, bm, target)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        age, gender.toLowerCase() === 'male' ? 1 : 0, municipality,
        fever, allergy, colds, chestPain, suka,
        headache, cough, stomachache, soreThroat, nausea, backPain, jointPain,
        noseBleed, wateryStool, preOrbitalPain, bodyMalaise, prediction // Ensure `prediction` is the 20th value
      ];

      await connection.execute(query, values);
      await connection.end();

      // Send formatted prediction with percentage symbol for client display
      res.json({ prediction: `${prediction}%` });
    } else {
      res.status(500).json({ error: "Failed to get a prediction" });
    }

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Prediction failed" });
  }
});

// Heatmap data endpoint
app.get('/heatmap-data', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Modify query to count positive and negative cases separately
    const [rows] = await connection.execute(`
      SELECT municipality, 
             SUM(CASE WHEN target > 0.5 THEN 1 ELSE 0 END) AS positive_cases, 
             SUM(CASE WHEN target <= 0.5 THEN 1 ELSE 0 END) AS negative_cases
      FROM predict
      WHERE municipality IN ('Inabanga', 'Clarin', 'San Isidro', 'Tubigon')
      GROUP BY municipality
    `);

    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    res.status(500).json({ error: "Failed to retrieve heatmap data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
