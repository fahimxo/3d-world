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
import { Locations } from "./assets/icons/Locations";
import AddClubForm from "./components/AddClubForm";

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
  const [isLocationsModalOpen, setLocationsModalOpen] = useState(false);

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
  const [modalVisible, setModalVisible] = useState(false);
  const showCityModal = useCallback((name: string, data: string) => {
    setModalData({ name, data });
    setModalVisible(true);
  }, []);

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
      {/* Moodals modal preview */}

      <div className="fixed top-0 left-0 w-full z-50">
        <Headers children="Logo" />
      </div>
      <div className="absolute top-30 w-full px-20 z-40">
        <div className="flex justify-between w-full mb-4">
          <FilterButton onClick={toggleFilterModal} />
          <Locations onClick={() => setLocationsModalOpen(true)} />
        </div>
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
      {isLocationsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setLocationsModalOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddClubForm onClose={() => setLocationsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
