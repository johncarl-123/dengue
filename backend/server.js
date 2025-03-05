import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';
import path from 'path';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL_PATH = process.env.MODEL_PATH || 'svm_model4.pkl';

// 🔹 CORS Middleware
const allowedOrigins = ['http://localhost:5173', 'https://dengue-production.up.railway.app'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(bodyParser.json());

let db; // Firestore database instance

// 🔹 Initialize Firebase
async function initializeFirebase() {
    try {
        const credentialsPath = path.join(__dirname, 'firebaseServiceAccountKey.json');
        if (!fs.existsSync(credentialsPath)) {
            throw new Error(`Firebase credentials file not found at ${credentialsPath}`);
        }
        const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: serviceAccount.project_id,
            });
            console.log('✅ Firebase initialized successfully!');
        }
        db = admin.firestore();
    } catch (err) {
        console.error('❌ Firebase initialization failed:', err.message);
        process.exit(1);
    }
}

initializeFirebase().then(() => {
    app.get('/', (req, res) => {
        res.send('Welcome to the Dengue Prediction API.');
    });

    app.post('/predict', async (req, res) => {
        try {
            console.log('📥 Incoming request:', req.body);

            let {
                age = 0, gender = 'unknown', municipality = 'unknown', year = 'unknown',
                barangay = 'unknown', fever = 0, allergy = 0, colds = 0, chestPain = 0,
                suka = 0, headache = 0, cough = 0, stomachache = 0, soreThroat = 0,
                nausea = 0, backPain = 0, jointPain = 0, noseBleed = 0,
                wateryStool = 0, preOrbitalPain = 0, bodyMalaise = 0,
            } = req.body;

            // Validate Year Format
            if (!/^\d{4}$/.test(year)) {
                console.warn("⚠️ Invalid year format. Setting year to 'unknown'.");
                year = 'unknown';
            }

            // Ensure Municipality Formatting
            municipality = municipality.trim().toLowerCase();
            barangay = barangay.trim().toLowerCase();

            const pythonArgs = [
                MODEL_PATH, age, gender.toLowerCase() === 'male' ? '1' : '0',
                municipality, year, barangay, fever, allergy, colds, chestPain, suka,
                headache, cough, stomachache, soreThroat, nausea, backPain, jointPain,
                noseBleed, wateryStool, preOrbitalPain, bodyMalaise
            ].map(String);

            const options = {
                mode: 'text',
                pythonOptions: ['-u'],
                scriptPath: __dirname,
                args: pythonArgs,
            };

            const results = await new Promise((resolve, reject) => {
                PythonShell.run('predict_model.py', options, (err, result) => {
                    if (err) {
                        console.error("🚨 Python script error:", err.message);
                        return reject(err);
                    }
                    resolve(result);
                });
            });

            let prediction = null;
            if (results && results.length > 0) {
                const match = results[0].match(/[\d.]+/);
                prediction = match ? parseFloat(match[0]) : null;
            }

            console.log("🔮 Prediction probability:", prediction);

            if (prediction !== null && prediction > 0.5) {
                const predictionData = {
                    age, gender: gender.toLowerCase() === 'male' ? 1 : 0,
                    municipality, year, barangay,
                    fever, allergy, colds, chestPain, suka, headache, cough, stomachache,
                    soreThroat, nausea, backPain, jointPain, noseBleed, wateryStool,
                    preOrbitalPain, bodyMalaise, target: prediction,
                };

                const docRef = await db.collection('predict').add(predictionData);
                console.log(`✅ Positive case added to Firestore (ID: ${docRef.id}).`);
            } else {
                console.log("ℹ️ Prediction below threshold. Not saving.");
            }

            res.json({ prediction: prediction !== null ? `${(prediction * 100).toFixed(2)}%` : 'N/A' });
        } catch (error) {
            console.error("🚨 Error during prediction:", error.message);
            res.status(500).json({ error: "Prediction failed" });
        }
    });

    app.get('/heatmap-data', async (req, res) => {
        try {
            const snapshot = await db.collection('predict').where('target', '>', 0.5).get();
            if (snapshot.empty) {
                return res.json({});
            }

            const heatmapData = {};
            snapshot.docs.forEach(doc => {
                const { municipality } = doc.data();
                if (municipality) {
                    const formattedMunicipality = municipality.toLowerCase();
                    heatmapData[formattedMunicipality] = (heatmapData[formattedMunicipality] || 0) + 1;
                }
            });

            res.json(heatmapData);
        } catch (error) {
            console.error("🚨 Error fetching heatmap data:", error.message);
            res.status(500).json({ error: "Failed to retrieve heatmap data" });
        }
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });

}).catch(err => {
    console.error('❌ Error initializing Firebase:', err.message);
});
