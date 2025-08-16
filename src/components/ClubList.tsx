import { FC, useEffect, useState } from 'react';
import ClubCard, { ClubData } from './ClubCard';
// import api from "src/config/axios";
import { API_ENDPOINTS } from '../config/endpoint';
import api from '../config/axios';
import { set } from 'lodash';
import ClubInfo from './ClubInfo';

interface ClubListProps {
  isShowVisibleClubs?: boolean;
  isShowLockedClubs?: boolean;
}
const ClubList: FC<ClubListProps> = ({
  isShowVisibleClubs = false,
  isShowLockedClubs = false,
}) => {
  const [clubsData, setClubData] = useState<ClubData[]>([]);
  const [clubDataForEdit, setClubDataForEdit] = useState<boolean>({});
  const [isShowClubInfo, setIsShowClubInfo] = useState<ClubData>(false);

  const getClubsData = async () => {
    try {
      const data: any = await api.post(API_ENDPOINTS.ADMIN.GET_CLUBS_LIST, {
        filter: {
          onlyVisible: isShowVisibleClubs,
          page: 1,
          pageSize: 100,
        },
      });
      setClubData(data?.result);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    getClubsData();
  }, []);

  return (
    <div className="py-6 flex flex-col gap-3">
      {!isShowClubInfo &&
        Array.isArray(clubsData) &&
        clubsData.length > 0 &&
        clubsData?.map((data) => (
          <ClubCard
            clubData={data}
            getClubsData={getClubsData}
            key={data.id}
            setClubDataForEdit={setClubDataForEdit}
            setIsShowClubInfo={setIsShowClubInfo}
          />
        ))}
      {isShowClubInfo && (
        <ClubInfo
          onClose={() => {
            setIsShowClubInfo(false);
            setClubDataForEdit({});
          }}
          prevData={clubDataForEdit}
        />
      )}

      {/* <ClubCard
        name="Galactic Crown"
        technoSector="Eurovia"
        country="Spain"
        city="Madrid"
        logo="/src/assets/images/clubLogoTest.png"
        id={5}
        clubPreviewData={{
          latetude: 50.510287,
          longitude: 4.719585,
          sportType: "Football",
          currentName: "Real Madrid",
          lore: "Born from Earth’s... ",
          clubAnthem: "url",
          logo: "/src/assets/images/clubLogoTest.png",

          clubKitUrl: "url",
          clubKitDescription: "url",
        }} 
      />*/}
    </div>
  );
};

export default ClubList;
