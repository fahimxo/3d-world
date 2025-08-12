// src/App.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import WorldComponent, { WorldHandle } from "./ts/index";
import "./app.css";
import { Headers } from "./layouts/header/Header";
import { Filters } from "./components/filters";
import { Tooltip, ComboboxOption, ClubDetailsModal } from "./components";
import {
  PublicClubFilter,
  usePublicClubs,
  PublicClubResult,
} from "./lib/usePublicClubs";

export type DataType = {
  id: number;
  reImaginedName: string;
  originalClubName: string;
  lore: string;
  city: string;
  latitude: number;
  longitude: number;
  logoUrl: string;
  videoUrl: string;
  status: number;
  isActive: boolean;
  displayOrder: number;
  sportId: number;
  sportName: string;
  sectorId: number;
  sectorName: string;
  sectorColorCode: string;
  countryId: number;
  countryName: string;
  anthemUrl: string;
  kitImageUrl: string;
  kitVideoUrl: string;
  stadiumImageUrl: string;
  stadiumVideoUrl: string;
  bestPlayerImageUrl: string;
  bestPlayerVideoUrl: string;
  coachImageUrl: string;
  coachVideoUrl: string;
  vehicleImageUrl: string;
  vehicleVideoUrl: string;
  symbolImageUrl: string;
  symbolVideoUrl: string;
  averageRating: number;
  totalRatings: number;
  created: string;
  lastModified: string;
};

const App: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [detailsModal, setDetailsModal] = useState(false);
  const [modalData, setModalData] = useState({ name: "", data: "" });
  const [selectedClubData, setSelectedClubData] = useState<
    PublicClubResult | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [cityOptions, setCityOptions] = useState<ComboboxOption[]>([]);

  const worldRef = useRef<WorldHandle>(null);

  const {
    data: clubData,
    loading: clubsLoading,
    fetchClubs,
  } = usePublicClubs();

  useEffect(() => {
    // هوک fetchClubs را بدون هیچ فیلتری فراخوانی می‌کنیم تا همه باشگاه‌ها را بگیرد
    fetchClubs({});
  }, []);

  useEffect(() => {
    // اگر بارگذاری اولیه تمام شده باشد و نتیجه فیلتر دقیقا یک باشگاه باشد
    if (
      !isInitialLoad &&
      clubData &&
      clubData?.length > 0 &&
      worldRef.current
    ) {
      const targetClub = clubData[0];
      worldRef.current.rotateToCoordinates(
        targetClub.latitude,
        targetClub.longitude
      );
    }
  }, [clubData, isInitialLoad]);

  const handleFilterSubmit = async (filterPayload: PublicClubFilter) => {
    // وقتی کاربر فیلتر می‌کند، دیگر بارگذاری اولیه نیست
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
    await fetchClubs(filterPayload);
  };

  // This effect hides the loading screen after a delay.
  useEffect(() => {
    const loadingScreen = document.getElementById("loading");
    const timer = setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add("out");
      }
    }, 2500); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  // This function can be passed to the WorldComponent to show the modal

  const showCityModal = useCallback((name: string, data: string) => {
    try {
      const clubData = JSON.parse(data);
      console.log("Clicked club data:", clubData);
      if (clubData && clubData.id) {
        setModalData({ name, data });
        setSelectedClubData(clubData);
        setDetailsModal(true);
      }
    } catch (error) {
      console.error("Error parsing club data:", error);
    }
  }, []);

  const hideCityModal = useCallback(() => {
    setDetailsModal(false);
    setSelectedClubData(undefined);
    setModalData({ name: "", data: "" });
  }, []);

  return (
    <div className="app-container">
      {/* The component that will render your Three.js world in the background */}
      <WorldComponent
        onCityClick={showCityModal}
        data={clubData as DataType[]}
        ref={worldRef}
        cityList={cityOptions}
      />
      <div className="fixed top-0 left-0 w-full z-50">
        <Headers
          children="Logo"
          fetchClubs={handleFilterSubmit}
          loading={clubsLoading}
        />
      </div>
      <Filters
        onFilterSubmit={handleFilterSubmit}
        loading={clubsLoading}
        cityOptions={cityOptions}
        setCityOptions={setCityOptions}
      />
      <Tooltip />
      <ClubDetailsModal
        isOpen={detailsModal}
        onClose={hideCityModal}
        clubData={selectedClubData}
      />
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
      {/* {modalVisible && (
        <div id="cityModal" className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={hideCityModal}>
              &times;
            </span>
            <h3 className="text-amber-800">{modalData.name}</h3>
            <p id="cityData">{modalData.data}</p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default App;
