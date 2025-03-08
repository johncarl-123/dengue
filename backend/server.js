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

// 🔹 Validate Environment Variables
if (!process.env.MODEL_PATH) {
    console.error('❌ MODEL_PATH environment variable is not set.');
    process.exit(1);
}

// 🔹 CORS Middleware (Allow specific frontend origin)
app.use(cors({
    origin: 'https://dengue-project.vercel.app', // Replace with your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials (if needed)
}));

// 🔹 Preflight Request Handler
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://dengue-project.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true'); // If cookies are used
    res.sendStatus(204); // No content for preflight requests
});

app.use(bodyParser.json());

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
    } catch (err) {
        console.error('❌ Firebase initialization failed:', err.message);
        process.exit(1);
    }
}

initializeFirebase().then(() => {
    const db = admin.firestore();

    // 🔹 Root Endpoint
    app.get('/', (req, res) => {
        res.send('Welcome to the Dengue Prediction API.');
    });

    // 🔹 Predict Endpoint
    app.post('/predict', async (req, res) => {
        try {
            console.log('📥 Incoming request:', JSON.stringify(req.body, null, 2));

            // Validate required fields
            const requiredFields = ['age', 'gender', 'municipality', 'year', 'barangay'];
            for (const field of requiredFields) {
                if (!req.body[field]) {
                    return res.status(400).json({ error: `Missing required field: ${field}` });
                }
            }

            const {
                age, gender, municipality, year, barangay,
                fever = 0, allergy = 0, colds = 0, chestPain = 0,
                suka = 0, headache = 0, cough = 0, stomachache = 0,
                soreThroat = 0, nausea = 0, backPain = 0, jointPain = 0,
                noseBleed = 0, wateryStool = 0, preOrbitalPain = 0, bodyMalaise = 0,
            } = req.body;

            // Validate Year Format
            if (!/^\d{4}$/.test(year)) {
                console.warn("⚠️ Invalid year format. Setting year to 'unknown'.");
                year = 'unknown';
            }

            const pythonArgs = [
                MODEL_PATH, age, gender.toLowerCase() === 'male' ? '1' : '0',
                municipality.toLowerCase(), year, barangay.toLowerCase(), fever, allergy,
                colds, chestPain, suka, headache, cough, stomachache, soreThroat,
                nausea, backPain, jointPain, noseBleed, wateryStool, preOrbitalPain, bodyMalaise
            ].map(String);

            const options = {
                mode: 'text',
                pythonOptions: ['-u'],
                scriptPath: __dirname,
                args: pythonArgs,
                timeout: 10000, // 10 seconds timeout
            };

            console.log("🔄 Running Python script with args:", pythonArgs);

            const results = await new Promise((resolve, reject) => {
                PythonShell.run('predict_model.py', options, (err, result) => {
                    if (err) {
                        console.error("🚨 Python script error:", err.message);
                        return reject(err);
                    }
                    resolve(result);
                });
            });

            console.log("📜 Raw Python Output:", results);

            let prediction = null;
            if (results && results.length > 0) {
                try {
                    prediction = parseFloat(results[0].match(/[\d.]+/)?.[0] || null);
                } catch (parseError) {
                    console.error("🚨 Error parsing prediction:", parseError);
                }
            }

            console.log("🔮 Prediction probability:", prediction);

            if (prediction !== null && prediction > 0.5) {
                const predictionData = {
                    age, gender: gender.toLowerCase() === 'male' ? 1 : 0,
                    municipality: municipality.toLowerCase(), year, barangay: barangay.toLowerCase(),
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

    // 🔹 Heatmap Data Endpoint
    app.get('/heatmap-data', async (req, res) => {
        try {
            const snapshot = await db.collection('predict').where('target', '>', 0.5).get();
            const data = snapshot.docs.map(doc => doc.data());

            const heatmapData = data.reduce((acc, entry) => {
                const municipality = entry.municipality.toLowerCase();
                acc[municipality] = (acc[municipality] || 0) + 1;
                return acc;
            }, {});

            res.json(heatmapData);
        } catch (error) {
            console.error("🚨 Error fetching heatmap data:", error.message);
            res.status(500).json({ error: "Failed to retrieve heatmap data" });
        }
    });

    // 🔹 Start Server
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });

}).catch(err => {
    console.error('❌ Error initializing Firebase:', err.message);
});