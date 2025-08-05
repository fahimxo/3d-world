// src/App.tsx
import React, { useState, useEffect, useCallback } from "react";
import WorldComponent from "./ts/index";
import "./app.css";
import Input from "./components/input";
import Combobox, { ComboboxOption } from "./components/combobox";
import { Funnel } from "lucide-react";
import { Modal } from "./components/modal";
import { Button } from "./components/button";
import { FilterButton } from "./components/filterButton";

export type DataType = {
  name: string;
  E: number;
  N: number;
  color: number;
}[];

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const toggleFilterModal = useCallback(() => {
    setFilterModalVisible((prev) => !prev);
  }, []);
  const [modalData, setModalData] = useState({ name: "", data: "" });
  const [clubData, setClubData] = useState<DataType>([
    { name: "London", E: -0.1276, N: 51.5074, color: 0xffa500 },
    { name: "Paris", E: 2.3522, N: 48.8566, color: 0xffa500 },
    { name: "Berlin", E: 13.405, N: 52.52, color: 0xffa500 },
    { name: "Madrid", E: -3.7038, N: 40.4168, color: 0xffa500 },
    { name: "Rome", E: 12.4964, N: 41.9028, color: 0xffa500 },
    { name: "Lisbon", E: -9.1393, N: 38.7223, color: 0xffa500 },
    { name: "Dublin", E: -6.2603, N: 53.3498, color: 0xffa500 },
    { name: "Amsterdam", E: 4.8952, N: 52.3702, color: 0xffa500 },
    { name: "Prague", E: 14.4378, N: 50.0755, color: 0xffa500 },
    { name: "Vienna", E: 16.3738, N: 48.2082, color: 0xffa500 },
    { name: "Warsaw", E: 21.0122, N: 52.2297, color: 0xffa500 },
    { name: "Budapest", E: 19.0402, N: 47.4979, color: 0xffa500 },
    { name: "Athens", E: 23.7275, N: 37.9838, color: 0xffa500 },
    { name: "Istanbul", E: 28.9784, N: 41.0082, color: 0xffa500 },
    { name: "Moscow", E: 37.6173, N: 55.7558, color: 0xffa500 },
    { name: "Kiev", E: 30.5234, N: 50.4501, color: 0xffa500 },
    { name: "Cairo", E: 31.2357, N: 30.0444, color: 0xffa500 },
    { name: "Algiers", E: 3.0588, N: 36.7762, color: 0xffa500 },
    { name: "Tunis", E: 10.1815, N: 36.8065, color: 0xffa500 },
    { name: "Tripoli", E: 13.1913, N: 32.8872, color: 0xffa500 },
    { name: "Casablanca", E: -7.5898, N: 33.5731, color: 0xffa500 },
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
  const [modalVisible, setModalVisible] = useState(false);
  const showCityModal = useCallback((name: string, data: string) => {
    setModalData({ name, data });
    setModalVisible(true);
  }, []);

  const hideCityModal = useCallback(() => {
    setModalVisible(false);
  }, []);

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

      <div className=" absolute top-8 left-8 w-full max-w-sm space-y-8 ">
        <FilterButton onClick={toggleFilterModal} />
        {filterModalVisible && (
          <Modal>
            <Combobox
              options={sportTypes}
              value={selectedSport}
              onChange={setSelectedSport}
              placeholder="select"
              label="Sport Type"
            />
            <Combobox
              options={sportTypes}
              value={selectedSport}
              onChange={setSelectedSport}
              placeholder="select"
              label="Techno Sector"
            />
            <Combobox
              options={sportTypes}
              value={selectedSport}
              onChange={setSelectedSport}
              placeholder="select"
              label="Country"
            />
            <Combobox
              options={sportTypes}
              value={selectedSport}
              onChange={setSelectedSport}
              placeholder="select"
              label="City"
            />
            <Input
              placeholder="Write reimagined name"
              label="Reimagined Name"
            />
            <Input placeholder="Write current name" label="Current Name" />
            <Button>confirm</Button>
          </Modal>
        )}
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
