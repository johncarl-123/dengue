import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar';

const HeatMap = () => {
  const [heatData, setHeatData] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState('');

  // Fetch heatmap data
  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await fetch('http://localhost:5000/heatmap-data');
        const data = await response.json();
        setHeatData(data);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      }
    };
    fetchHeatmapData();
  }, []);

  // Filter heatmap data based on selected municipality
  const filteredData = heatData.filter(({ municipality, positive_cases }) => {
    // Only include municipalities with positive cases and filter by selected municipality
    const byMunicipality = selectedMunicipality ? municipality === selectedMunicipality : true;
    return positive_cases > 0 && byMunicipality;
  });

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-10 px-4 bg-[#1d1836] min-h-screen pt-24">
        <h1 className="text-4xl font-bold text-white-800 mb-6">Heat Map</h1>
        <p className="text-lg text-white-600 mb-10 text-center max-w-xl">
          View the heat map below to understand dengue distribution and risk areas.
        </p>

        {/* Dropdown to select municipality */}
        <div className="mb-6">
          <label htmlFor="municipality" className="text-xl font-semibold text-white-700 mr-4">
            Select Municipality:
          </label>
          <select
            id="municipality"
            className="px-4 py-2 border rounded-md"
            value={selectedMunicipality}
            onChange={(e) => setSelectedMunicipality(e.target.value)}
          >
            <option value="">All Municipalities</option>
            <option value="Inabanga">Inabanga</option>
            <option value="Clarin">Clarin</option>
            <option value="San Isidro">San Isidro</option>
            <option value="Tubigon">Tubigon</option>
          </select>
        </div>

        {/* Heat Map */}
        <div className="w-full max-w-4xl">
          <MapContainer
            center={[9.8543, 124.0125]} // Center of Bohol region
            zoom={11}
            className="w-full h-96 bg-white shadow-lg rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
            />
            {filteredData.map(({ municipality, positive_cases }) => {
              let lat, lng;

              // Use coordinates for each municipality
              if (municipality === 'Inabanga') {
                lat = 10.0547; lng = 124.0588;
              } else if (municipality === 'Clarin') {
                lat = 9.958891861945746; lng = 124.05804149156423;
              } else if (municipality === 'San Isidro') {
                lat = 9.867449945300862; lng = 123.94859491274384;
              } else if (municipality === 'Tubigon') {
                lat = 9.9140689182578; lng = 123.96352677145639;
              }

              return (
                <Circle
                  key={municipality}
                  center={[lat, lng]}
                  radius={positive_cases * 20} // Adjust scaling factor to avoid large circles
                  fillColor="red"
                  color="red"
                  fillOpacity={0.4}
                >
                  {/* Tooltip showing number of positive cases */}
                  <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                    {municipality}: {positive_cases} positive cases
                  </Tooltip>
                </Circle>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;