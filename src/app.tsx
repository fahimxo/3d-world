// src/App.tsx
import React, { useState, useEffect, useCallback } from "react";
import WorldComponent from "./ts/index";
import "./app.css";
import Input from "./components/input";
import Combobox, { ComboboxOption } from "./components/combobox";
import "leaflet/dist/leaflet.css";

export type DataType = {
  name: string;
  E: number;
  N: number;
  color: number;
}[];

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ name: "", data: "" });
  const [clubData, setClubData] = useState<DataType>([
    { name: "Kyiv", E: 30.5234, N: 50.4501, color: 0xffa500 }, // Longitude, Latitude
    { name: "London", E: -0.1276, N: 51.5074, color: 0xffa500 },
    { name: "Tokyo", E: 139.6503, N: 35.6762, color: 0xffa500 },
    // Add more cities here
  ]);

  // This effect hides the loading screen after a delay.
  useEffect(() => {
    const loadingScreen = document.getElementById("loading");
    const timer = setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add("out");
      }
      setLoading(false);
    }, 2500); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  // This function can be passed to the WorldComponent to show the modal
  const showCityModal = useCallback((name: string, data: string) => {
    setModalData({ name, data });
    setModalVisible(true);
  }, []); // Empty dependency array means the function is created once and never changes.

  const hideCityModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  console.log("modalData", modalData);

  const sportTypes: ComboboxOption[] = [
    { value: "football", label: "Football" },
    { value: "basketball", label: "Basketball" },
    { value: "esports", label: "eSports" },
    { value: "motorsport", label: "Motorsport" },
  ];

  const [selectedSport, setSelectedSport] = useState<string>("");

  return (
    <div className="app-container">
      {/* The component that will render your Three.js world in the background */}
      <WorldComponent onCityClick={showCityModal} data={clubData} />

      <div className="absolute top-8 left-8 z-[999] w-full max-w-sm space-y-8 bg-white">
        <Input
          name="technoSector"
          label="TECHNO SECTOR"
          placeholder="Enter sector name..."
        />

        <Combobox
          name="sportType"
          label="SPORT TYPE"
          options={sportTypes}
          value={selectedSport}
          onChange={setSelectedSport}
          placeholder="Choose one..."
          searchPlaceholder="Search sports..."
        />
      </div>

      {/* Loading Indicator (can remain outside the main container) */}
      <div id="loading">
        <div className="sk-chase">
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
          <div className="sk-chase-dot"></div>
        </div>
        <div>Loading resources...</div>
      </div>

      {/* Modal Dialog */}
      {modalVisible && (
        <div id="cityModal" className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={hideCityModal}>
              &times;
            </span>
            <h3 className="text-amber-800">{modalData.name}</h3>
            <p id="cityData">{modalData.data}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
