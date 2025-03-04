// Import required modules
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';
import path from 'path';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env
dotenv.config();

// Define directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware setup
const allowedOrigins = process.env.ALLOWED_ORIGIN ? [process.env.ALLOWED_ORIGIN] : ['*'];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'], // Specify the allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(bodyParser.json());

// Firebase Initialization
async function initializeFirebase() {
    try {
        let serviceAccount;

        if (process.env.FIREBASE_CREDENTIALS) {
            // If credentials are stored as an environment variable (Render Deployment)
            serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
        } else if (process.env.FIREBASE_CREDENTIALS_PATH) {
            // If credentials are stored in a file (Local Development)
            const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
            if (!fs.existsSync(credentialsPath)) {
                throw new Error(`Firebase credentials file not found at ${credentialsPath}`);
            }
            serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        } else {
            throw new Error("Missing Firebase credentials. Set FIREBASE_CREDENTIALS or FIREBASE_CREDENTIALS_PATH.");
        }

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

// Start the server after Firebase initialization
initializeFirebase().then(() => {
    const db = admin.firestore();

    // Prediction API endpoint
    app.post('https://dengue-g8ge.onrender.com/predict', async (req, res) => {
        try {
            console.log('📥 Incoming request:', req.body);

            // Extract and validate request body parameters
            const {
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

            // Validate year format
            if (year !== 'unknown' && !/^\d{4}$/.test(year)) {
                console.warn("⚠️ Invalid year format. Using default value.");
            }

            // Prepare arguments for the Python script
            const pythonArgs = [
                'svm_model4.pkl',
                age,
                gender.toLowerCase() === 'male' ? '1' : '0',
                municipality,
                year,
                barangay,
                fever, allergy, colds, chestPain, suka, headache, cough,
                stomachache, soreThroat, nausea, backPain, jointPain,
                noseBleed, wateryStool, preOrbitalPain, bodyMalaise
            ].map(String);

            const options = {
                mode: 'text',
                pythonOptions: ['-u'],
                scriptPath: __dirname,
                args: pythonArgs,
            };

            // Run the Python script and get prediction results
            const results = await new Promise((resolve, reject) => {
                PythonShell.run('predict_model.py', options, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            // Process prediction
            let prediction = null;
            if (results && results.length > 0) {
                try {
                    prediction = parseFloat(results[0].match(/[\d.]+/)?.[0] || null);
                } catch (parseError) {
                    console.error("🚨 Error parsing prediction:", parseError);
                }
            }

            console.log("🔮 Prediction probability:", prediction);

            // Save to Firestore only if prediction is significant
            if (prediction !== null && prediction > 0.5) {
                const predictionData = {
                    age,
                    gender: gender.toLowerCase() === 'male' ? 1 : 0,
                    municipality,
                    year,
                    barangay,
                    fever, allergy, colds, chestPain, suka, headache, cough,
                    stomachache, soreThroat, nausea, backPain, jointPain,
                    noseBleed, wateryStool, preOrbitalPain, bodyMalaise,
                    target: prediction,
                };

                await db.collection('predict').add(predictionData);
                console.log("✅ Positive case added to Firestore.");
            } else {
                console.log("ℹ️ Prediction is not high enough. Not saving.");
            }

            res.json({ prediction: prediction !== null ? `${(prediction * 100).toFixed(2)}%` : 'N/A' });
        } catch (error) {
            console.error("🚨 Error during prediction:", error.message);
            res.status(500).json({ error: "Prediction failed" });
        }
    });

    // Heatmap Data API (Fetch positive cases)
    app.get('/heatmap-data', async (req, res) => {
        try {
            const snapshot = await db.collection('predict').where('target', '>', 0.5).get();
            const data = snapshot.docs.map(doc => doc.data());

            // Count cases by municipality
            const heatmapData = data.reduce((acc, entry) => {
                const { municipality } = entry;
                acc[municipality] = (acc[municipality] || 0) + 1;
                return acc;
            }, {});

            res.json(heatmapData);
        } catch (error) {
            console.error("🚨 Error fetching heatmap data:", error.message);
            res.status(500).json({ error: "Failed to retrieve heatmap data" });
        }
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });

}).catch(err => {
    console.error('❌ Error initializing Firebase:', err.message);
});