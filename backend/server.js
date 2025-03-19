import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';
import path from 'path';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MODEL_PATH = process.env.MODEL_PATH || 'svm_model4.pkl';

// Validate Environment Variables
if (!process.env.MODEL_PATH || !process.env.FIREBASE_CONFIG) {
    console.error('❌ Required environment variables are missing.');
    process.exit(1);
}

// Middleware
app.use(cors({
    origin: ['https://dengue-project.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Initialize Firebase
async function initializeFirebase() {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

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

// Start Server
initializeFirebase().then(() => {
    const db = admin.firestore();

    app.get('/', (req, res) => {
        res.send('Welcome to the Dengue Prediction API.');
    });

    app.post('/predict', async (req, res) => {
        try {
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

            if (isNaN(age) || age < 0 || age > 120) {
                return res.status(400).json({ error: 'Invalid age. Age must be between 0 and 120.' });
            }

            if (!['male', 'female'].includes(gender.toLowerCase())) {
                return res.status(400).json({ error: 'Invalid gender. Must be "male" or "female".' });
            }

            if (!/^\d{4}$/.test(year)) {
                return res.status(400).json({ error: 'Invalid year format. Year must be a 4-digit number.' });
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
                timeout: 10000,
            };

            const results = await new Promise((resolve, reject) => {
                PythonShell.run('predict_model.py', options, (err, result) => {
                    if (err) {
                        console.error("🚨 Python script error:", err.message);
                        console.error("🚨 Python script stderr:", err.stderr);
                        return reject(err);
                    }
                    resolve(result);
                });
            });

            let prediction = null;
            if (results && results.length > 0) {
                try {
                    prediction = parseFloat(results[0].match(/[\d.]+/)?.[0] || null);
                } catch (parseError) {
                    console.error("🚨 Error parsing prediction:", parseError);
                }
            }

            if (prediction !== null && prediction > 0.5) {
                const predictionData = {
                    age,
                    gender: gender.toLowerCase() === 'male' ? 1 : 0,
                    municipality: municipality.toLowerCase(),
                    year,
                    barangay: barangay.toLowerCase(),
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
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                };

                const docRef = await db.collection('predict').add(predictionData);
                console.log(`✅ Positive case added to Firestore (ID: ${docRef.id}).`);
            }

            res.json({ prediction: prediction !== null ? `${(prediction * 100).toFixed(2)}%` : 'N/A' });
        } catch (error) {
            console.error("🚨 Error during prediction:", error.message);
            res.status(500).json({ error: "Prediction failed" });
        }
    });

    app.get('/heatmap-data', async (req, res) => {
        try {
            const { year, municipality } = req.query;
            let query = db.collection('predict').where('target', '>', 0.5);

            if (year) {
                query = query.where('year', '==', year);
            }

            if (municipality) {
                query = query.where('municipality', '==', municipality.toLowerCase());
            }

            const snapshot = await query.get();
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

    app.use((err, req, res, next) => {
        console.error("🚨 Global error handler:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('❌ Error initializing Firebase:', err.message);
});