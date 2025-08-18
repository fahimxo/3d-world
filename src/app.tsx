// src/App.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import WorldComponent, { WorldHandle } from './ts/index';
import './app.css';
import { Headers } from './layouts/header/Header';
import { Filters } from './components/filters';
import { Tooltip, ComboboxOption, ClubDetailsModal } from './components';
import {
  PublicClubFilter,
  usePublicClubs,
  PublicClubResult,
} from './lib/usePublicClubs';
import { Loading } from './components/loading';
import ClubsManagement from './components/ClubsManagement';
import { Clubs } from './assets/icons/Locations';

const App: React.FC = () => {
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedClubData, setSelectedClubData] = useState<
    PublicClubResult | undefined
  >();
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [cityOptions, setCityOptions] = useState<ComboboxOption[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [locationsModalOpen, setLocationsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // وقتی کامپوننت لود میشه مقدار localStorage رو بخون
    const admin = localStorage.getItem('isAdmin');
    console.log('admin', admin);

    setIsAdmin(admin === 'true');

    // لیسنر بذار برای تغییرات localStorage (مثلاً وقتی لاگ‌اوت بشه)
    const handleStorageChange = () => {
      const updatedAdmin = localStorage.getItem('isAdmin');
      setIsAdmin(updatedAdmin === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
  }, [clubData]);

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
      console.log('Clicked club data:', clubData);
      if (clubData && clubData.id) {
        setSelectedClubData(clubData);
        setDetailsModal(true);
      }
    } catch (error) {
      console.error('Error parsing club data:', error);
    }
  }, []);

  const hideCityModal = useCallback(() => {
    setDetailsModal(false);
    setSelectedClubData(undefined);
  }, []);

  const handleWorldLoaded = useCallback(() => {
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
      // This class will trigger your fade-out animation
      loadingScreen.classList.add('out');
    }
    // Set loading to false after a short delay to allow the animation to play
    setTimeout(() => {
      setLoading(false);
    }, 800); // Match this delay to your CSS transition duration
  }, []);

  return (
     //<ClubsManagement onClose={() => setLocationsModalOpen(false)} />
    <div className="app-container">
      {/* The component that will render your Three.js world in the background */}
      <WorldComponent
        onCityClick={showCityModal}
        data={clubData}
        ref={worldRef}
        cityList={cityOptions}
        onLoaded={handleWorldLoaded}
        setFilterModalVisible={setFilterModalVisible}
      />
      <div className="fixed top-0 left-0 w-full z-50">
        <Headers
          fetchClubs={handleFilterSubmit}
          loading={clubsLoading}
          setFilterModalVisible={setFilterModalVisible}
          filterModalVisible={filterModalVisible}
          setIsAdmin={setIsAdmin}
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
      <div className="fixed top-30 right-40 z-40">
        {isAdmin && (
          <Clubs
            onClick={() => {
              setLocationsModalOpen(true);
              setFilterModalVisible(false);
            }}
          />
        )}
      </div>
      {locationsModalOpen && (
        <ClubsManagement onClose={() => setLocationsModalOpen(false)} />
      )}
      <Tooltip />
      <ClubDetailsModal
        isOpen={detailsModal}
        onClose={hideCityModal}
        clubData={selectedClubData}
      />
      {/* Loading Indicator (can remain outside the main container) */}
      {loading && <Loading />}
    </div>
  );
};

export default App;
