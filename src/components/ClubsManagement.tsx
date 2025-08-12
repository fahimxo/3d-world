import { useCallback, useRef, useState } from "react";
import { LocationsModal } from "../assets/icons/LocationsModal";
import { Accordion } from "./Accordion";
import Combobox from "./combobox";
import { Checkbox } from "./Checkbox";
import { FileUpload } from "./FileUpload";
import Input from "./input";
import ClubList from "./ClubList";
import ClubInfo from "./ClubInfo";
import Line from "./Line";

const countryOptions = [
  { value: "usa", label: "United States" },
  { value: "jp", label: "Japan" },
  { value: "uk", label: "United Kingdom" },
];

enum tabs {
  add = 1,
  edit = 2,
}
const ClubsManagement = ({ onClose }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const changeTabs = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <div
      className=" inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 "
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LocationsModal>
          {/* inner Scroll */}
          <div className=" space-y-6 text-white h-full  ">
            <div className="flex flex-wrap justify-evenly items-center gap-20 mb-8">
              <Button
                onClick={() => {
                  changeTabs(tabs.add);
                }}
              >
                Add New Club
              </Button>
              <Button
                onClick={() => {
                  changeTabs(tabs.edit);
                }}
              >
                Edit Club
              </Button>
            </div>
            {currentTab == tabs.add ? <ClubInfo /> : <ClubList />}
          </div>
        </LocationsModal>
      </div>
    </div>
  );
};

export default ClubsManagement;

const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer relative w-[220px] h-[44px] text-[14px] font-[700] text-[#00FFA6] hover:text-[#011231] bg-[rgba(0,255,166,0.10)] hover:bg-[#00FFA6] transition"
      style={{
        clipPath: "polygon(93% 0, 100% 10%, 100% 100%, 5% 100%, 0 93%, 0 0)",
      }}
    >
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute inset-0 w-full h-full cursor-pointer"
        viewBox="0 0 220 44"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="205 0, 220 4.4, 220 44, 11 44, 0 41, 0 0"
          fill="transparent"
          stroke="#00FFA6"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
};
