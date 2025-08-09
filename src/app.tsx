// src/App.tsx
import React, { useState, useEffect, useCallback } from "react";
import WorldComponent from "./ts/index";
import "./app.css";
import { Headers } from "./layouts/header/Header";
import DetailsModal from "./assets/icons/DetailsModal";
import { Filter } from "./components/filter";
import CardInfoModal from "./assets/icons/CardInfoModal";
import ClubKit from "./components/clubKit";
import { FilterButton } from "./components/filterButton";
import Combobox, { ComboboxOption } from "./components/combobox";
import { Modal } from "./components/modal";
import Input from "./components/input";
import { Button } from "./components/button";

export type DataType = {
  name: string;
  E: number;
  N: number;
  color: number;
}[];

const App: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [detailsModal, setDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const toggleFilterModal = useCallback(() => {
    setFilterModalVisible((prev) => !prev);
  }, []);
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

  const handleDetailsModal = () => {
    setDetailsModal((prev) => !prev);
  };

  return (
    <div className="app-container">
      {/* The component that will render your Three.js world in the background */}
      <WorldComponent onCityClick={showCityModal} data={clubData} />
      <div className="fixed top-0 left-0 w-full z-10">
        <Headers children="Logo" />
      </div>
      <div className="absolute top-30 left-8 w-full max-w-sm space-y-8 z-40">
        <FilterButton onClick={toggleFilterModal} />
        {filterModalVisible && (
          <Modal className="w-[335px] h-[678px]">
            <Filter />
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
        <p
          className="font-normal text-[26px] leading-[100%] tracking-[0px] text-cyan-300 orbitron-font"
          onClick={handleDetailsModal}
        >
          MODAl
        </p>

        {detailsModal && (
          <Modal mode="center">
            <DetailsModal onClose={handleDetailsModal}>
              <div className="flex items-stretch gap-6 text-white h-[232px]">
                <div className="w-[240px] h-full">
                  <CardInfoModal
                    logoUrl="https://example.com/logo.png"
                    title="GALACTIC CROWN"
                    country="Eurovia"
                    state="Spain"
                    city="Madrid"
                    className="h-full"
                  />
                </div>
                <div className="flex-1 h-full">
                  <video
                    src="https://example.com/video.mp4"
                    controls
                    className="w-full h-full rounded-lg border-none object-cover"
                  />
                </div>
              </div>
              <ClubKit />
            </DetailsModal>
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
