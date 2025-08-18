import { Dispatch, SetStateAction, useState } from 'react';
import ClubPreview from './ClubPreview';
import api from '../config/axios';
import { API_ENDPOINTS } from '../config/endpoint';
import { showToast } from '../config/toastService';

export interface ClubData {
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
  lockStatus: number;
  isActive: boolean;
  displayOrder: number;
  sportId: number;
  sportName: string;
  sectorId: number;
  sectorName: string;
  sectorColorCode: number;
  countryId: number;
  countryName: string;
  anthemUrl: string;
  kitImageUrl: string;
  kitVideoUrl: string;
  kitDiscription: string;
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
}

interface ClubCardProps {
  clubData: ClubData;
  getClubsData: () => void;
  setClubDataForEdit: Dispatch<SetStateAction<ClubData>>;
  setIsShowClubInfo: Dispatch<SetStateAction<boolean>>;
}
const ClubCard = ({
  getClubsData = () => {
    return;
  },
  setIsShowClubInfo,
  setClubDataForEdit,
  ...props
}: ClubCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { originalClubName, sectorName, countryName, city, logoUrl, id } =
    props.clubData;

  const removeClub = async (e) => {
    try {
      const result: any = await api.post(API_ENDPOINTS.ADMIN.DELETE_CLUB, {
        id,
      });
      if (result?.result) {
        getClubsData();
        showToast(result?.message, 'success');
      } else {
        showToast(result?.message, 'failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const editClub = async (e) => {
    setIsShowClubInfo(true);
    setClubDataForEdit(props.clubData);
  };
  return (
    <div className=" text-white w-full ">
      <div
        style={{
          clipPath: 'polygon(98% 0, 100% 16%, 100% 100%, 2% 100%, 0 84%, 0 0)',
        }}
        className={`flex justify-between items-center px-8 cursor-pointer ${
          isOpen ? 'bg-[rgba(0,119,86,0.7)]' : 'bg-[rgba(0,119,86,0.25)]'
        } transition h-[81px] `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 min-w-[200px]">
          <img
            src={`data:image/png;base64,${logoUrl}`}
            alt={originalClubName}
            className="w-[80px] h-auto "
          />
          <div className="text-[16px] font-bold truncate">
            {originalClubName}
          </div>
        </div>
        <div className="flex items-center gap-3 w-full justify-between px-5">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[12px] font-[400] font-regular">
              Techno Sector
            </span>
            <span className="text-[12px] font-[700] truncate">{sectorName}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[12px] font-[400] font-regular">Country</span>
            <span className="text-[12px] font-[700] truncate">{countryName}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[12px] font-[400] font-regular">City</span>
            <span className="text-[12px] font-[700] truncate">{city}</span>
          </div>
        </div>

        <div className="flex  flex-col  items-center gap-3 justify-center">
          <button className="cursor-pointer " onClick={editClub}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.25 13.75V10.5625L10.15 0.68125C10.3 0.54375 10.4656 0.4375 10.6469 0.3625C10.8281 0.2875 11.0188 0.25 11.2188 0.25C11.4187 0.25 11.6125 0.2875 11.8 0.3625C11.9875 0.4375 12.15 0.55 12.2875 0.7L13.3188 1.75C13.4688 1.8875 13.5781 2.05 13.6469 2.2375C13.7156 2.425 13.75 2.6125 13.75 2.8C13.75 3 13.7156 3.19062 13.6469 3.37187C13.5781 3.55312 13.4688 3.71875 13.3188 3.86875L3.4375 13.75H0.25ZM11.2 3.85L12.25 2.8L11.2 1.75L10.15 2.8L11.2 3.85Z"
                fill="#00B8FF"
              />
            </svg>
          </button>
          <button className="cursor-pointer " onClick={removeClub}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer "
            >
              <mask
                id="mask0_283_3144"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="20"
                height="20"
              >
                <rect width="20" height="20" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_283_3144)">
                <path
                  d="M5.83301 17.5C5.37467 17.5 4.98231 17.3368 4.65592 17.0104C4.32954 16.684 4.16634 16.2917 4.16634 15.8333V5H3.33301V3.33333H7.49967V2.5H12.4997V3.33333H16.6663V5H15.833V15.8333C15.833 16.2917 15.6698 16.684 15.3434 17.0104C15.017 17.3368 14.6247 17.5 14.1663 17.5H5.83301ZM7.49967 14.1667H9.16634V6.66667H7.49967V14.1667ZM10.833 14.1667H12.4997V6.66667H10.833V14.1667Z"
                  fill="#FF0004"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="py-4 space-y-4 ">
          <ClubPreview {...props.clubData} />
        </div>
      )}
    </div>
  );
};

export default ClubCard;
