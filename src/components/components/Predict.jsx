import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Predict = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    municipality: "",
    symptoms: {
      fever: "",
      allergy: "",
      colds: "",
      chestPain: "",
      suka: "",
      headache: "",
      cough: "",
      stomachache: "",
      soreThroat: "",
      nausea: "",
      backPain: "",
      jointPain: "",
      noseBleed: "",
      wateryStool: "",
      preOrbitalPain: "",
      bodyMalaise: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(true); // State to manage visibility of reminder
  const navigate = useNavigate();

  const symptomQuestions = {
    fever: "Are you experiencing fever? (Lagnat)",
    allergy: "Do you have any known allergies? (Allergy)",
    colds: "Are you experiencing colds? (Sipon)",
    chestPain: "Are you experiencing chest pain? (Sakit sa dibdib)",
    suka: "Are you vomiting? (Nagsusuka)",
    headache: "Are you experiencing a headache? (Sakit ng ulo)",
    cough: "Are you experiencing a cough? (Ubo)",
    stomachache: "Are you experiencing a stomachache? (Sakit ng tiyan)",
    soreThroat: "Do you have a sore throat? (Masakit ang lalamunan)",
    nausea: "Are you experiencing nausea? (Pagduduwal)",
    backPain: "Are you experiencing back pain? (Sakit sa likod)",
    jointPain: "Are you experiencing joint pain? (Sakit sa kasukasuan)",
    noseBleed: "Have you had any nosebleeds? (Pagdurugo ng ilong)",
    wateryStool: "Are you experiencing watery stool? (Malabnaw na dumi)",
    preOrbitalPain: "Are you experiencing pain around your eyes? (Sakit sa paligid ng mata)",
    bodyMalaise: "Are you feeling general body malaise? (Pakiramdam na masama ang katawan)",
  };

  const municipalities = [
    { value: "Inabanga", label: "Inabanga" },
    { value: "Clarin", label: "Clarin" },
    { value: "San Isidro", label: "San Isidro" },
    { value: "Tubigon", label: "Tubigon" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSymptomChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      symptoms: { ...formData.symptoms, [name]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    const symptomData = { ...formData.symptoms };
    const data = {
      age: formData.age,
      gender: formData.gender,
      municipality: formData.municipality,
      ...Object.keys(symptomData).reduce((acc, symptom) => {
        acc[symptom] = symptomData[symptom] === "yes" ? 1 : 0;
        return acc;
      }, {}),
    };

    axios
      .post("http://localhost:5000/predict", data)
      .then((response) => {
        setLoading(false); // Stop loading
        navigate("/result", { state: { prediction: response.data.prediction } });
      })
      .catch((error) => {
        setLoading(false); // Stop loading
        console.error("Prediction error", error);
        alert("Error: Unable to make a prediction. Please try again.");
      });
  };

  return (
    <div>
      <Navbar />
      {/* Reminder Banner */}
      {reminderVisible && (
        <div
          className="bg-gray-500 text-white text-center py-3 mt-20 z-50 absolute w-full top-0 left-0" 
          style={{ position: 'absolute', top: '80px' }} // Positioned further down
        >
          <p className="font-semibold">
            Please ensure you fill out the form with the correct symptoms you're experiencing. Your accurate input will help with a more precise prediction.
          </p>
          <button
            onClick={() => setReminderVisible(false)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close Reminder
          </button>
        </div>
      )}

      <div className="flex flex-col items-center mt-16 py-10 px-4 bg-[#1d1836] min-h-screen">
        <motion.div>
          <div className="w-full xs:w-[600px] md:w-[700px] lg:w-[800px]">
            <div className="green-pink-gradient p-[2px] rounded-[20px] shadow-card">
              <div className="bg-tertiary rounded-[20px] py-10 px-8 flex flex-col items-center text-white">
                <h1 className="text-4xl font-bold mb-4 text-center">
                  Predict Dengue Outcomes
                </h1>
                {loading ? (
                  <div className="flex items-center justify-center h-16">
                    <p className="text-lg font-semibold">Predicting...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="w-full space-y-6">
                    {/* Your form inputs here */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-lg font-semibold">Age:</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          required
                          className="input-class w-full p-2 rounded-md border border-gray-300 text-white bg-[#232631]"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-semibold">
                          Gender:
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          className="input-class w-full p-2 rounded-md border border-gray-300 text-white bg-[#232631]"
                        >
                          <option value="" disabled>
                            Select Gender
                          </option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-lg font-semibold">
                          Municipality:
                        </label>
                        <select
                          name="municipality"
                          value={formData.municipality}
                          onChange={handleChange}
                          required
                          className="input-class w-full p-2 rounded-md border border-gray-300 text-white bg-[#232631]"
                        >
                          <option value="" disabled>
                            Select Municipality
                          </option>
                          {municipalities.map((municipality) => (
                            <option
                              key={municipality.value}
                              value={municipality.value}
                            >
                              {municipality.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {Object.keys(symptomQuestions).map((symptom) => (
                      <div key={symptom} className="space-y-1">
                        <p className="font-semibold text-lg">
                          {symptomQuestions[symptom]}
                        </p>
                        <div className="flex space-x-4">
                          <label>
                            <input
                              type="radio"
                              name={symptom}
                              value="yes"
                              checked={formData.symptoms[symptom] === "yes"}
                              onChange={handleSymptomChange}
                              required
                              className="mr-1"
                            />
                            Yes
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={symptom}
                              value="no"
                              checked={formData.symptoms[symptom] === "no"}
                              onChange={handleSymptomChange}
                              required
                              className="mr-1"
                            />
                            No
                          </label>
                        </div>
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`mt-4 w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Predict
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Predict;
