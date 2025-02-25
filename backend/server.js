import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';
import path from 'path';
import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase asynchronously
async function initializeFirebase() {
    try {
        const serviceAccount = JSON.parse(await readFile(new URL('./firebaseServiceAccountKey.json', import.meta.url)));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase initialized successfully!');
    } catch (err) {
        console.error('Failed to initialize Firebase:', err);
        process.exit(1);
    }
}

// Start the server after initializing Firebase
initializeFirebase().then(() => {
    const db = admin.firestore();

    // Prediction endpoint
    app.post('/predict', async (req, res) => {
        let {
            age = 0,
            gender = 'unknown',
            municipality = 'unknown',
            year = 'unknown',
            barangay = 'unknown',
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

        console.log('Received request body:', req.body);

        if (year !== 'unknown' && !/^\d{4}$/.test(year)) {
            console.warn("Invalid year format. Using default.");
            year = 'unknown';
        }

        const pythonArgs = [
            'svm_model4.pkl',
            age || 0,
            gender.toLowerCase() === 'male' ? '1' : '0',
            municipality || 'unknown',
            year || 'unknown',
            barangay || 'unknown',
            fever,
            allergy,
            colds,
            chestPain,
            suka,
            headache,
            cough,
            stomachache,
            soreThroat,
            nausea,
            backPain,
            jointPain,
            noseBleed,
            wateryStool,
            preOrbitalPain,
            bodyMalaise,
        ].map(String);

        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: __dirname,
            args: pythonArgs,
        };

        try {
            const results = await new Promise((resolve, reject) => {
                PythonShell.run('predict_model.py', options, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            let prediction = null;
            if (results && results.length > 0) {
                try {
                    prediction = parseFloat(results[0].match(/[\d.]+/)?.[0] || null);
                } catch (parseError) {
                    console.error("Error parsing prediction:", parseError, "Raw result:", results[0]);
                }
            }
            
            console.log("Prediction probability:", prediction);

            if (prediction !== null && prediction > 0.5) {
                const predictionData = {
                    age,
                    gender: gender.toLowerCase() === 'male' ? 1 : 0,
                    municipality,
                    year,
                    barangay,
                    fever,
                    allergy,
                    colds,
                    chestPain,
                    suka,
                    headache,
                    cough,
                    stomachache,
                    soreThroat,
                    nausea,
                    backPain,
                    jointPain,
                    noseBleed,
                    wateryStool,
                    preOrbitalPain,
                    bodyMalaise,
                    target: prediction,
                };

                await db.collection('predict').add(predictionData);
                console.log("Positive case added to Firestore.");
            } else {
                console.log("Prediction is not positive. Not saving to Firestore.");
            }

            res.json({ prediction: prediction !== null ? `${prediction.toFixed(2)}%` : 'N/A' });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Prediction failed" });
        }
    });

    // Heatmap data endpoint (fetches only positive cases)
    app.get('/heatmap-data', async (req, res) => {
        try {
            const snapshot = await db.collection('predict').where('target', '>', 0.5).get();
            const data = snapshot.docs.map(doc => doc.data());

            const heatmapData = data.reduce((acc, entry) => {
                const { municipality } = entry;
                acc[municipality] = (acc[municipality] || 0) + 1;
                return acc;
            }, {});

            res.json(heatmapData);
        } catch (error) {
            console.error("Error fetching heatmap data:", error);
            res.status(500).json({ error: "Failed to retrieve heatmap data" });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Error during Firebase initialization:', err);
});
