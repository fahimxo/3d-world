// src/App.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import WorldComponent, { WorldHandle } from "./ts/index";
import "./app.css";
import { Headers } from "./layouts/header/Header";
import { Filters } from "./components/filters";
import { ComboboxOption, Tooltip } from "./components";
import { PublicClubFilter, usePublicClubs } from "./lib/usePublicClubs";
import { Loading } from "./components/loading";

const App: React.FC = () => {
  const [modalData, setModalData] = useState({ name: "", data: "" });
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
  const [modalVisible, setModalVisible] = useState(false);
  const showCityModal = useCallback((name: string, data: string) => {
    setModalData({ name, data });
    setModalVisible(true);
  }, []);

  const hideCityModal = useCallback(() => {
    setModalVisible(false);
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
        data={clubData}
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
      {/* Loading Indicator (can remain outside the main container) */}
      {loading && <Loading />}
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
