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
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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
        +targetClub.latitude,
        +targetClub.longitude
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


  const handleWorldLoaded = useCallback(() => {
    const loadingScreen = document.getElementById("loading");
    if (loadingScreen) {
      // This class will trigger your fade-out animation
      loadingScreen.classList.add("out");
    }
    // Set loading to false after a short delay to allow the animation to play
    setTimeout(() => {
      setLoading(false);
    }, 800); // Match this delay to your CSS transition duration
  }, []);

  return (
    <div className="app-container">
      {/* The component that will render your Three.js world in the background */}
      <WorldComponent
        onCityClick={showCityModal}
        data={clubData as DataType[]}
        ref={worldRef}
        cityList={cityOptions}
        onLoaded={handleWorldLoaded}
      />
      <div className="fixed top-0 left-0 w-full z-50">
        <Headers
          children="Logo"
          fetchClubs={handleFilterSubmit}
          loading={clubsLoading}
          setFilterModalVisible={setFilterModalVisible}
          filterModalVisible={filterModalVisible}
        />
      </div>
      <Filters
        onFilterSubmit={handleFilterSubmit}
        loading={clubsLoading}
        cityOptions={cityOptions}
        setCityOptions={setCityOptions}
        filterModalVisible={filterModalVisible}
        setFilterModalVisible={setFilterModalVisible}
      />
      <Tooltip />
      <ClubDetailsModal
        isOpen={detailsModal}
        onClose={hideCityModal}
        clubData={selectedClubData}
      />
      {/* Loading Indicator (can remain outside the main container) */}
      {loading && <Loading />}
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
