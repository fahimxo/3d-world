import { FC, useEffect, useState } from 'react';
import ClubCard, { ClubData } from './ClubCard';
// import api from "src/config/axios";
import { API_ENDPOINTS } from '../config/endpoint';
import api from '../config/axios';
import ClubInfo from './ClubInfo';
import { Button } from './button';

interface ClubListProps {
  isShowVisibleClubs?: boolean;
  isShowLockedClubs?: boolean;
  onClose: () => void;
  onDataChange: () => void;
}
const ClubList: FC<ClubListProps> = ({
  isShowVisibleClubs = false,
  isShowLockedClubs = false,
  onClose,
  onDataChange,
}) => {
  const [clubsData, setClubData] = useState<ClubData[]>([]);
  const [clubDataForEdit, setClubDataForEdit] = useState<ClubData>({});
  const [isShowClubInfo, setIsShowClubInfo] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(true);

  const getClubsData = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClubsData();
  }, []);

  return (
    <div className="py-6 flex flex-col gap-3">
      {!isShowClubInfo &&
        (Array.isArray(clubsData) && clubsData.length > 0 ? (
          clubsData?.map((data) => (
            <ClubCard
              clubData={data}
              getClubsData={onDataChange}
              key={data.id}
              setClubDataForEdit={setClubDataForEdit}
              setIsShowClubInfo={setIsShowClubInfo}
            />
          ))
        ) : (
          <div className="flex justify-center items-center">
            {loading ? '... Loading' : ' there is no club!'}
          </div>
        ))}

      {isShowClubInfo && (
        <ClubInfo
          onClose={() => {
            setIsShowClubInfo(false);
            // setClubDataForEdit({});
          }}
          prevData={clubDataForEdit}
          onClubCreated={onDataChange}
        />
      )}
      {!isShowClubInfo && (
        <div className="flex gap-4 justify-end mt-7">
          <Button
            onClick={onClose}
            className="relative flex items-center justify-center cursor-pointer"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClubList;
