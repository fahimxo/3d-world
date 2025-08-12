import { FC, useEffect, useState } from "react";
import ClubCard, { ClubData } from "./ClubCard";
// import api from "src/config/axios";
import { API_ENDPOINTS } from "../config/endpoint";
import api from "../config/axios";

interface ClubListProps {
  isShowVisibleClubs?: boolean;
  isShowLockedClubs?: boolean;
}
const ClubList: FC<ClubListProps> = ({
  isShowVisibleClubs = false,
  isShowLockedClubs = false,
}) => {
  const [clubsData, setClubData] = useState<ClubData[]>([]);

  const getClubsData = async () => {
    try {
      const data: any = await api.post(API_ENDPOINTS.ADMIN.GET_CLUBS_LIST, {
        filter: {
          // "sportId": 0,
          // "sectorId": 0,
          // "countryId": 0,
          // "reImaginedName": "string",
          // "originalClubName": "string",
          // "city": "string",
          onlyVisible: isShowVisibleClubs,
          page: 1,
          pageSize: 100,
          // "sortBy": "string",
          // "sortDirection": "string"
        },
      });
      setClubData(data?.result);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    getClubsData();
  }, []);

  return (
    <div className="py-6 flex flex-col gap-3">
      {Array.isArray(clubsData) &&
        clubsData.length > 0 &&
        clubsData?.map((data) => (
          <ClubCard clubData={data} getClubsData={getClubsData} key={data.id} />
        ))}
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
