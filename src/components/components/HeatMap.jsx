import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar';
import { db, firebaseConfig } from "./firebaseConfig"; // Importing db and firebaseConfig together
import { collection, getDocs } from "firebase/firestore"; // Import Firestore methods

// Log Firebase Config
console.log("Firebase Configuration: ", firebaseConfig);
console.log(import.meta.env.VITE_FIREBASE_API_KEY);
console.log(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log(import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
console.log(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
console.log(import.meta.env.VITE_FIREBASE_APP_ID);


// Helper component for map interaction and data fetching
function MapInteraction({ selectedMunicipality, selectedYear, setBarangayData }) {
    const map = useMap();

    useEffect(() => {
        if (selectedMunicipality) {
            let lat, lng;
            if (selectedMunicipality === 'Inabanga') {
                lat = 10.031585907069738; lng = 124.06593791556023;
                map.setView([lat, lng], 13);
            } else if (selectedMunicipality === 'Clarin') {
                lat = 9.961337649195176; lng = 124.02418094548925;
                map.setView([lat, lng], 13);
            } else if (selectedMunicipality === 'San Isidro') {
                lat = 9.859532833312024; lng = 123.95578417427441;
                map.setView([lat, lng], 13);
            } else if (selectedMunicipality === 'Tubigon') {
                lat = 9.951360814425401; lng = 123.96075655593741;
                map.setView([lat, lng], 13);
            }
        } else {
            map.setView([9.8543, 124.0125], 11);
        }
    }, [selectedMunicipality, map]);

    useEffect(() => {
        const fetchBarangayData = async () => {
            if (!selectedMunicipality) {
                setBarangayData({});
                return;
            }

            try {
                const querySnapshot = await getDocs(collection(db, 'predict'));
                const data = querySnapshot.docs.map(doc => doc.data());
                // Filter data based on the selected year
                const positiveData = data.filter(item => 
                    Number(item.target) >= 0.5 && item.municipality === selectedMunicipality && item.year === selectedYear
                );

                const barangayTotals = {};
                positiveData.forEach(item => {
                    const { barangay } = item;
                    if (barangay) {
                        barangayTotals[barangay] = (barangayTotals[barangay] || 0) + 1;
                    }
                });

                console.log("Barangay Totals:", barangayTotals);
                setBarangayData(barangayTotals);
            } catch (error) {
                console.error('Error fetching barangay data:', error);
                setBarangayData({});
            }
        };

        fetchBarangayData();
    }, [selectedMunicipality, selectedYear, setBarangayData]);

    return null;
}

const HeatMap = () => {
    const [municipalityTotals, setMunicipalityTotals] = useState({});
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [barangayData, setBarangayData] = useState({});
    const [selectedYear, setSelectedYear] = useState('2023'); // Default year

    const barangayCoordinates = {
        Inabanga: {
            Anonang: { lat: 10.020685139361854, lng: 124.14466672277383 },
            Badiang: { lat: 10.001003886395818, lng: 124.06700974987373 },
            Baguhan: { lat: 9.981562983295879, lng: 124.11778768330512 },
            Bahan: { lat: 9.959452122545118, lng: 124.09436443574924 },
            Banahao: { lat: 9.969941799921829, lng: 124.09079807135856 },
            Baogo: { lat: 10.030133010536037, lng: 124.1157631588496 },
            Bugang: { lat: 10.057181250327524, lng: 124.07777396150516 },
            Cagawasan: { lat: 10.005340068358095, lng: 124.06153169617208 },
            Cagayan: { lat: 10.031762866647508, lng: 124.07934615208428 },
            Cambitoon: { lat: 9.949609200971398, lng: 124.13762227766303 },
            Canlinte: { lat: 9.982715714950347, lng: 124.10005236475256 },
            Cawayan: { lat: 9.99176905027865, lng: 124.08345397826872 },
            Cogon: { lat: 10.024126834828003, lng: 124.06906788293175 },
            Cuaming: { lat: 10.112981585041215, lng: 123.98793502622527 },
            Dagnawan: { lat: 9.95927601426189, lng: 124.10458796979253 },
            Dagohoy: { lat: 9.994783071377483, lng: 124.06890998894511 },
            "Dait Sur": { lat: 10.038347754127646, lng: 124.09561257674868 },
            Datag: { lat: 9.995262458405021, lng: 124.1246262938093 },
            Fatima: { lat: 10.043109000017292, lng: 124.09158815869615 },
            Hambongan: { lat: 10.07026097220026, lng: 124.02319024859143 },
            Ilaud: { lat: 10.029754446295351, lng: 124.06687659449246 },
            Ilaya: { lat: 9.99611765896778, lng: 124.13153604429593 },
            Ilihan: { lat: 9.960457415874728, lng: 124.0832022128327 },
            "Lapacan Norte": { lat: 10.035660595226268, lng: 124.13500656281188 },
            "Lapacan Sur": { lat: 10.037577362772105, lng: 124.12232656454314 },
            Lawis: { lat: 10.065414830756207, lng: 124.06260693296467 },
            "Liloan Norte": { lat: 10.01452877257886, lng: 124.10524146129762 },
            "Liloan Sur": { lat: 10.013154144930043, lng: 124.09646549353806 },
            Lomboy: { lat: 9.971964932154709, lng: 124.11090592163767 },
            "Lonoy Cainsican": { lat: 10.002997190030694, lng: 124.08496931799591 },
            "Lonoy Roma": { lat: 10.012961489473414, lng: 124.08417631435512 },
            Lutao: { lat: 10.01437025842619, lng: 124.06902034903894 },
            Luyo: { lat: 10.032962528167218, lng: 124.06871265194113 },
            Mabuhay: { lat: 9.974662795044464, lng: 124.07620152193313 },
            "Maria Rosario": { lat: 9.964686146244915, lng: 124.11641887940449 },
            Nabuad: { lat: 10.029071865233558, lng: 124.09225990011703 },
            Napo: { lat: 9.99289121884843, lng: 124.09464121301473 },
            Ondol: { lat: 10.048278671185503, lng: 124.05906680092427 },
            Poblacion: { lat: 10.026891591722743, lng: 124.05897312185041 },
            Riverside: { lat: 9.961377947608511, lng: 124.12421086222868 },
            Saa: { lat: 10.038338957123969, lng: 124.0655589854152 },
            "San Isidro": { lat: 10.036672819380305, lng: 124.081644877701 },
            "San Jose": { lat: 9.959892287796087, lng: 124.1399282572304 },
            "Santo Niño": { lat: 10.06836749618306, lng: 124.07153445762687 },
            "Santo Rosario": { lat: 9.988912427123074, lng: 124.05691521747416 },
            Sua: { lat: 9.960267724847194, lng: 124.14211338571337 },
            Tambook: { lat: 10.022511407397216, lng: 124.07385097371305 },
            Tungod: { lat: 10.034738438755374, lng: 124.05922055814533 },
            "U-og": { lat: 9.98319949118187, lng: 124.05863901345039 },
            Ubujan: { lat: 9.978235997070238, lng: 124.05570164149259 },
        },
        Clarin: {
            Bacani: { lat: 9.968006904355287, lng: 124.03983057581027 },
            Bogtongbod: { lat: 9.92058851625245, lng: 124.03634396438575 },
            Bonbon: { lat: 9.963847539033459, lng: 124.01778355561038 },
            Bontud: { lat: 9.946924539868615, lng: 124.03480562626349 },
            Buacao: { lat: 9.952621859232545, lng: 124.00322992841912 },
            Buangan: { lat: 9.930096353572027, lng: 124.01700876366132 },
            Cabog: { lat: 9.902611749011761, lng: 124.02457918968709 },
            Caboy: { lat: 9.949335095083963, lng: 124.06007378460069 },
            Caluwasan: { lat: 9.943796048503996, lng: 124.0623486690358 },
            Candajec: { lat: 9.94930287563597, lng: 124.02325984762142 },
            Cantoyoc: { lat: 9.963887074385608, lng: 124.05512450876142 },
            Comaang: { lat: 9.96451791579757, lng: 124.03431559028368 },
            Danahao: { lat: 9.914620934850813, lng: 124.01520890006228 },
            Katipunan: { lat: 9.94168691241247, lng: 124.00870482706411 },
            Lajog: { lat: 9.954597784072352, lng: 124.01137948509897 },
            Mataub: { lat: 9.952114212381048, lng: 124.04331676649865 },
            Nahawan: { lat: 9.969440324140482, lng: 124.04898979092646 },
            "Poblacion Centro": { lat: 9.961056671529281, lng: 124.02479267433498 },
            "Poblacion Norte": { lat: 9.965155716402556, lng: 124.02383045026501 },
            "Poblacion Sur": { lat: 9.956938506747175, lng: 124.02603865270723 },
            Tangaran: { lat: 9.967572199930146, lng: 124.0342434383897 },
            Tontunan: { lat: 9.939810882605252, lng: 124.0362847786144 },
            Tubod: { lat: 9.921085108044405, lng: 124.03995460850687 },
            Villaflor: { lat: 9.957886839092986, lng: 124.06682166917801 },
        },
        'San Isidro': {
            Abehilan: { lat: 9.82785975418135, lng: 123.92497323266173 },
            "Baryong Daan": { lat: 9.88896509356085, lng: 123.95605421935417 },
            Baunos: { lat: 9.803325304675084, lng: 123.95035665421753 },
            Cabanugan: { lat: 9.889819691255195, lng: 123.96758664186132 },
            Caimbang: { lat: 9.849627258968649, lng: 123.97192320594641 },
            Cambansag: { lat: 9.845766417265988, lng: 123.9365132532547 },
            Candungao: { lat: 9.864990542054667, lng: 123.93589835331298 },
            "Cansague Norte": { lat: 9.83606536168348, lng: 123.9608756809401 },
            "Cansague Sur": { lat: 9.82405574044616, lng: 123.95774912822117 },
            "Causwagan Sur": { lat: 9.872755540457662, lng: 123.9728787735306 },
            Masonoy: { lat: 9.8549, lng: 123.94988486359904 },
            Poblacion: { lat: 9.855778796030823, lng: 123.95508707534199 },
        },
        Tubigon: {
            Bagongbanwa: { lat: 10.055475724597231, lng: 123.89903912672871 },
            Banlasan: { lat: 9.89077952712821, lng: 123.939360985639 },
            Batasan: { lat: 10.014735208566561, lng: 123.98837432240927 },
            Bilangbilangan: { lat: 9.916994931719197, lng: 123.96395895431867 },
            Bosongon: { lat: 9.934488420450032, lng: 123.99603509075618 },
            "Buenos Aires": { lat: 9.902070501613165, lng: 124.00809236166391 },
            Bunacan: { lat: 9.916817980625938, lng: 123.9999229708125 },
            Cabulihan: { lat: 9.949417058147615, lng: 123.9790103815471 },
            Cahayag: { lat: 9.919052306734613, lng: 123.92729657640362 },
            Cawayanan: { lat: 9.91702348460065, lng: 123.99628392613965 },
            Centro: { lat: 9.953609282774414, lng: 123.96199354922871 },
            Genonocan: { lat: 9.929820287755042, lng: 123.96009287120651 },
            Guiwanon: { lat: 9.937983294000482, lng: 123.96009287120651 },
            "Ilihan Norte": { lat: 9.919465304176153, lng: 123.9394126464783 },
            "Ilihan Sur": { lat: 9.900713776419213, lng: 123.95639574836902 },
            Libertad: { lat: 9.890050300661425, lng: 123.9891515190343 },
            Macaas: { lat: 9.949210012045954, lng: 123.99434367421729 },
            Matabao: { lat: 9.930642737060328, lng: 123.91244640957434 },
            "Mocaboc Island": { lat: 10.071314441459782, lng: 123.92772299045588 },
            Panadtaran: { lat: 9.910470831274143, lng: 123.93754508191145 },
            Panaytayon: { lat: 9.932956386047714, lng: 123.93276568049556 },
            Pandan: { lat: 9.930751233418043, lng: 123.92375528121357 },
            Pangapasan: { lat: 9.997812599105744, lng: 123.9408365366647 },
            "Pinayagan Norte": { lat: 9.938578102664227, lng: 123.94462358770355 },
            "Pinayagan Sur": { lat: 9.929288362790556, lng: 123.94622607996988 },
            "Pooc Occidental": { lat: 9.95047893999693, lng: 123.96072141124196 },
            "Pooc Oriental": { lat: 9.948460280071016, lng: 123.963529017592 },
            Potohan: { lat: 9.942190311733938, lng:  123.96221612160716 },
            Talenceras: { lat: 9.92367131823996, lng:  123.98913655201356 },
            "Tan-awan": { lat: 9.915148387401198, lng:  123.97431674598698 },
            Tinangnan: { lat: 9.952994299646976, lng:  123.97358325481261 },
            "Ubay Island": { lat: 10.024959881319784, lng:  123.96674199457915 },
            Ubojan: { lat: 9.938583406193779, lng:  123.9727170916726 },
            Villanueva: { lat: 9.908235406932926, lng:  123.93108337133785 },
        },
    };

    useEffect(() => {
        const fetchMunicipalityData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'predict'));
                const data = querySnapshot.docs.map(doc => doc.data());
                // Filter total cases based on selected year
                const positiveData = data.filter(item => 
                    Number(item.target) >= 0.5 && item.year === selectedYear
                );

                const totals = {};
                positiveData.forEach(item => {
                    const { municipality } = item;
                    if (municipality) {
                        totals[municipality] = (totals[municipality] || 0) + 1;
                    }
                });

                console.log("Municipality Totals:", totals);
                setMunicipalityTotals(totals);
            } catch (error) {
                console.error('Error fetching municipality data:', error);
            }
        };

        fetchMunicipalityData();
    }, [selectedYear]);

    const municipalityCoordinates = {
        Inabanga: { lat: 10.031585907069738, lng: 124.06593791556023 },
        Clarin: { lat: 9.961337649195176, lng: 124.02418094548925 },
        'San Isidro': { lat: 9.859532833312024, lng: 123.95578417427441 },
        Tubigon: { lat: 9.951360814425401, lng: 123.96075655593741 },
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center py-10 px-4 bg-[#1d1836] min-h-screen pt-24">
                <h1 className="text-4xl font-bold text-white-800 mb-6">Heat Map</h1>
                <p className="text-lg text-white-600 mb-10 text-center max-w-xl">
                    View the heat map below to understand dengue distribution and risk areas.
                </p>

                <div className="mb-6">
                    <label htmlFor="year" className="text-xl font-semibold text-white-700 mr-4">
                        Enter Year:
                    </label>
                    <input
                        type="number"
                        id="year"
                        className="px-4 py-2 border rounded-md"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        placeholder="Enter the year"
                    />
                </div>

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

                <div className="w-full max-w-4xl">
                    <MapContainer
                        center={[9.8543, 124.0125]} 
                        zoom={11}
                        className="w-full h-96 bg-white shadow-lg rounded-lg"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="© <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
                        />

                        {/* Municipality Circles */}
                        {Object.keys(municipalityTotals).map(municipality => {
                            const coordinates = municipalityCoordinates[municipality];
                            if (!coordinates) return null;

                            const totalCases = municipalityTotals[municipality];
                            if (!totalCases) return null;

                            return (
                                <Circle
                                    key={`municipality-${municipality}`}
                                    center={[coordinates.lat, coordinates.lng]}
                                    radius={totalCases * 20}
                                    fillColor="red"
                                    color="red"
                                    fillOpacity={0.4}
                                    onClick={() => setSelectedMunicipality(municipality)}
                                >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                                        {municipality}: {totalCases} positive cases
                                    </Tooltip>
                                </Circle>
                            );
                        })}

                        {/* Barangay Circles */}
                        {selectedMunicipality && Object.keys(barangayData).map(barangay => {
                            const municipalityBarangays = barangayCoordinates[selectedMunicipality];
                            if (!municipalityBarangays) return null;
                            const coordinates = municipalityBarangays[barangay];

                            if (!coordinates) return null;

                            const caseCount = barangayData[barangay];
                            if (!caseCount) return null;

                            return (
                                <Circle
                                    key={`barangay-${barangay}`}
                                    center={[coordinates.lat, coordinates.lng]}
                                    radius={caseCount * 15}
                                    fillColor="orange"
                                    color="orange"
                                    fillOpacity={0.6}
                                >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                                        {barangay}: {caseCount} cases
                                    </Tooltip>
                                </Circle>
                            );
                        })}

                        <MapInteraction
                            selectedMunicipality={selectedMunicipality}
                            selectedYear={selectedYear}
                            setBarangayData={setBarangayData}
                        />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default HeatMap;