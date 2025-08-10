// src/App.tsx
import React, { useState, useEffect, useCallback } from "react";
import WorldComponent from "./ts/index";
import "./app.css";
import Input from "./components/input";
import Combobox, { ComboboxOption } from "./components/combobox";
import { Modal } from "./components/modal";
import { Button } from "./components/button";
import { FilterButton } from "./components/filterButton";
import { Headers } from "./layouts/header/Header";
import { Tooltip } from "./components";

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
    {
      name: "barcelona",
      E: 0.8181,
      N: 41.9091,
      color: 0xffa500,
    },
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
      <div className="fixed top-0 left-0 w-full z-50">
        <Headers children="Logo" />
      </div>
      <div className="absolute top-30 left-8 w-full max-w-sm space-y-8 z-40">
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
      <Tooltip />
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
