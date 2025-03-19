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
    barangay: "",
    year: "",
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
  const [reminderVisible, setReminderVisible] = useState(true);
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

  const municipalityData = {
    Inabanga: [
      "Anonang",
      "Bahan",
      "Badiang",
      "Baguhan",
      "Banahao",
      "Baogo",
      "Bugang",
      "Cagawasan",
      "Cagayan",
      "Cambitoon",
      "Canlinte",
      "Cawayan",
      "Cogon",
      "Cuaming",
      "Dagnawan",
      "Dagohoy",
      "Dait Sur",
      "Datag",
      "Fatima",
      "Hambongan",
      "Ilaud",
      "Ilaya",
      "Ilihan",
      "Lapacan Norte",
      "Lapacan Sur",
      "Lawis",
      "Liloan Norte",
      "Liloan Sur",
      "Lomboy",
      "Lonoy Cainsican",
      "Lonoy Roma",
      "Lutao",
      "Luyo",
      "Mabuhay",
      "Maria Rosario",
      "Nabuad",
      "Napo",
      "Ondol",
      "Poblacion",
      "Riverside",
      "Saa",
      "San Isidro",
      "San Jose",
      "Santo Niño",
      "Santo Rosario",
      "Sua",
      "Tambook",
      "Tungod",
      "U-og",
      "Ubujan",
    ],
    Clarin: [
      "Bacani",
      "Bogtongbod",
      "Bonbon",
      "Bontud",
      "Buacao",
      "Buangan",
      "Cabog",
      "Caboy",
      "Caluwasan",
      "Candajec",
      "Cantoyoc",
      "Comaang",
      "Danahao",
      "Katipunan",
      "Lajog",
      "Mataub",
      "Nahawan",
      "Poblacion Centro",
      "Poblacion Norte",
      "Poblacion Sur",
      "Tangaran",
      "Tontunan",
      "Tubod",
      "Villaflor",
    ],
    'San Isidro': [
      "Abehilan",
      "Baryong Daan",
      "Baunos",
      "Cabanugan",
      "Caimbang",
      "Cambansag",
      "Candungao",
      "Cansague Norte",
      "Cansague Sur",
      "Causwagan Sur",
      "Masonoy",
      "Poblacion"
    ],
    Tubigon: [
      "Bagongbanwa",
      "Banlasan",
      "Batasan",
      "Bilangbilangan",
      "Bosongon",
      "Buenos Aires",
      "Bunacan",
      "Cabulihan",
      "Cahayag",
      "Cawayanan",
      "Centro",
      "Genonocan",
      "Guiwanon",
      "Ilihan Norte",
      "Ilihan Sur",
      "Libertad",
      "Macaas",
      "Matabao",
      "Mocaboc Island",
      "Panadtaran",
      "Panaytayon",
      "Pandan",
      "Pangapasan",
      "Pinayagan Norte",
      "Pinayagan Sur",
      "Pooc Occidental",
      "Pooc Oriental",
      "Potohan",
      "Talenceras",
      "Tan-awan",
      "Tinangnan",
      "Ubay Island",
      "Ubojan",
      "Villanueva"
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "municipality") {
      setFormData((prev) => ({ ...prev, barangay: "" }));
    }
  };

  const handleSymptomChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      symptoms: { ...formData.symptoms, [name]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const symptomData = { ...formData.symptoms };
      const data = {
        age: formData.age,
        gender: formData.gender,
        municipality: formData.municipality,
        barangay: formData.barangay,
        year: formData.year,
        ...Object.keys(symptomData).reduce((acc, symptom) => {
          acc[symptom] = symptomData[symptom] === "yes" ? 1 : 0;
          return acc;
        }, {}),
      };

      console.log('Sending prediction request to:', "/api/predict");
      const response = await axios.post("/api/predict", data, {
        withCredentials: true,
      });
      const { prediction } = response.data;

      console.log('Saving prediction result:', { ...data, prediction });
      await axios.post("/api/result", { ...data, prediction }, {
        withCredentials: true,
      });
      console.log("Prediction saved successfully");

      setLoading(false);
      navigate("/result", { state: { prediction } });
    } catch (error) {
      setLoading(false);

      if (error.response) {
        console.error("Prediction error:", error.response.data);
        alert(`Error: ${error.response.data.error || "Unable to make a prediction. Please try again."}`);
      } else if (error.request) {
        console.error("Prediction error: No response from server", error.request);
        alert("Error: No response from server. Check your connection.");
      } else {
        console.error("Prediction error:", error.message);
        alert("Error: Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      {reminderVisible && (
        <div
          className="bg-gray-500 text-white text-center py-3 mt-20 z-50 absolute w-full top-0 left-0"
          style={{ position: "absolute", top: "80px" }}
        >
          <p className="font-semibold">
            Please ensure you fill out the form with the correct symptoms
            you're experiencing. Your accurate input will help with a more
            precise prediction.
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
                    <div className="space-y-4">
                      <div>
                        <label className="block text-lg font-semibold">
                          Age:
                        </label>
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
                          {Object.keys(municipalityData).map(
                            (municipality) => (
                              <option
                                key={municipality}
                                value={municipality}
                              >
                                {municipality}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-lg font-semibold">
                          Barangay:
                        </label>
                        <select
                          name="barangay"
                          value={formData.barangay}
                          onChange={handleChange}
                          required
                          className="input-class w-full p-2 rounded-md border border-gray-300 text-white bg-[#232631]"
                          disabled={!formData.municipality}
                        >
                          <option value="" disabled>
                            Select Barangay
                          </option>
                          {municipalityData[formData.municipality]?.map(
                            (barangay) => (
                              <option key={barangay} value={barangay}>
                                {barangay}
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-lg font-semibold">
                          Year:
                        </label>
                        <input
                          type="text"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                          className="input-class w-full p-2 rounded-md border border-gray-300 text-white bg-[#232631]"
                          placeholder="e.g., 2023"
                        />
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
                            />
                            No
                          </label>
                        </div>
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform w-full`}
                    >
                      {loading ? 'Predicting...' : 'Predict'}
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