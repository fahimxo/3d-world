import React, { useState } from 'react';
import { Button } from './button';
import ClubInfo from './ClubInfo';
import ClubList from './ClubList';
import CustomScrollPanel from '../assets/icons/CustomScrollPanel';
import { LocationsModal } from '../assets/icons/LocationsModal';

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
      className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm p-4 md:p-0"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="bg-[#00120C]">
        <LocationsModal>
          <div className="relative z-10 flex-shrink-0 px-4 pt-8 mb-2 md:mb-8">
            <div className="flex flex-row justify-center items-center p-6 py-7 md:gap-28 gap-3">
              <Button
                className="flex-1 sm:flex-none sm:min-w-32 text-center text-sm md:text-base"
                onClick={() => changeTabs(tabs.add)}
                variant="tertiary"
                isActive={currentTab === tabs.add}
              >
                Add New Club
              </Button>
              <Button
                className="flex-1 sm:flex-none sm:min-w-32 text-center"
                onClick={() => changeTabs(tabs.edit)}
                variant="tertiary"
                isActive={currentTab === tabs.edit}
              >
                Edit Club
              </Button>
            </div>
          </div>

          <CustomScrollPanel className="relative z-10 flex-1 min-h-0 mt-8">
            <div>
              {currentTab === tabs.add ? (
                <ClubInfo onClose={onClose} />
              ) : (
                <ClubList onClose={onClose} />
              )}
            </div>
          </CustomScrollPanel>
        </LocationsModal>
      </div>
    </div>
  );
};

export default ClubsManagement;
