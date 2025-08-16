import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { LocationsModal } from '../assets/icons/LocationsModal';
import { Button } from './button';
import ClubInfo from './ClubInfo';
import ClubList from './ClubList';
import CustomScrollPanel from '../assets/icons/CustomScrollPanel';

enum tabs {
  add = 1,
  edit = 2,
}

const ClubsManagement = ({ onClose }) => {
  const [currentTab, setCurrentTab] = useState(tabs.add);
  const changeTabs = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <div
      className="inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LocationsModal>
          <div className="flex flex-wrap justify-evenly items-center gap-20 mb-8 px-10 pt-8">
            <Button
              onClick={() => changeTabs(tabs.add)}
              variant="tertiary"
              isActive={currentTab === tabs.add}
            >
              Add New Club
            </Button>
            <Button
              onClick={() => changeTabs(tabs.edit)}
              variant="tertiary"
              isActive={currentTab === tabs.edit}
            >
              Edit Club
            </Button>
          </div>
          {/* <CustomScrollPanel> */}
          <div className="px-10 pb-8">
            {currentTab === tabs.add ? (
              <ClubInfo onClose={onClose} />
            ) : (
              <ClubList />
            )}
          </div>
          {/* </CustomScrollPanel> */}
        </LocationsModal>
      </div>
    </div>
  );
};

export default ClubsManagement;
