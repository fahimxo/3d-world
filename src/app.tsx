// src/App.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import WorldComponent, { WorldHandle } from "./ts/index";
import "./app.css";
import { Headers } from "./layouts/header/Header";
import { Filters } from "./components/filters";
import { Tooltip } from "./components";
import { PublicClubFilter, usePublicClubs } from "./lib/usePublicClubs";
import AddClubForm from "./components/AddClubForm";

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
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState({ name: "", data: "" });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // const [clubData, setClubData] = useState<DataType[]>([]);
  const worldRef = useRef<WorldHandle>(null);

  const {
    data: clubData,
    error,
    loading: clubsLoading,
    fetchClubs,
  } = usePublicClubs();
  // [
  //   { name: "London", E: -0.1276, N: 51.5074, color: 0xffa500 },
  //   { name: "Paris", E: 2.3522, N: 48.8566, color: 0xffa500 },
  //   { name: "Berlin", E: 13.405, N: 52.52, color: 0xffa500 },
  //   { name: "Madrid", E: -3.7038, N: 40.4168, color: 0xffa500 },
  //   {
  //     name: "barcelona",
  //     E: 0.8181,
  //     N: 41.9091,
  //     color: 0xffa500,
  //   },
  // ]

  useEffect(() => {
    // هوک fetchClubs را بدون هیچ فیلتری فراخوانی می‌کنیم تا همه باشگاه‌ها را بگیرد
    fetchClubs({});
  }, []);

  useEffect(() => {
    // اگر بارگذاری اولیه تمام شده باشد و نتیجه فیلتر دقیقا یک باشگاه باشد
    if (!isInitialLoad && clubData && worldRef.current) {
      console.log("clubData[0]", clubData[5]);

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

  return (
    <AddClubForm />
    // <div className="app-container">
    //   {/* The component that will render your Three.js world in the background */}
    //   <WorldComponent
    //     onCityClick={showCityModal}
    //     data={clubData}
    //     ref={worldRef}
    //   />
    //   <div className="fixed top-0 left-0 w-full z-50">
    //     <Headers children="Logo" />
    //   </div>
    //   <Filters onFilterSubmit={handleFilterSubmit} loading={clubsLoading} />
    //   <Tooltip />
    //   {/* Loading Indicator (can remain outside the main container) */}
    //   <div id="loading">
    //     <div className="sk-chase">
    //       <div className="sk-chase-dot"></div>
    //       <div className="sk-chase-dot"></div>
    //       <div className="sk-chase-dot"></div>
    //       <div className="sk-chase-dot"></div>
    //       <div className="sk-chase-dot"></div>
    //       <div className="sk-chase-dot"></div>
    //     </div>
    //     <div>Loading resources...</div>
    //   </div>
    //   {/* Modal Dialog */}
    //   {modalVisible && (
    //     <div id="cityModal" className="modal">
    //       <div className="modal-content">
    //         <span className="close-button" onClick={hideCityModal}>
    //           &times;
    //         </span>
    //         <h3 className="text-amber-800">{modalData.name}</h3>
    //         <p id="cityData">{modalData.data}</p>
    //       </div>
    //     </div>
    //   )}
    //   {isLocationsModalOpen && (
    //     <div
    //       className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    //       onClick={() => setLocationsModalOpen(false)}
    //     >
    //       <div onClick={(e) => e.stopPropagation()}>
    //         <AddClubForm onClose={() => setLocationsModalOpen(false)} />
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export default App;
