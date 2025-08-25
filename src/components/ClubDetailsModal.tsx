import React, { useEffect } from 'react';
import { Modal } from './modal';
import DetailsModal from '../assets/icons/DetailsModal';
import CardInfoModal from '../assets/icons/CardInfoModal';
import ReactPlayer from 'react-player';
import FanbasePower from './fanBase';
import { PublicClubResult } from '../lib/usePublicClubs';
import InfoSection from './clubKit';
import { useTooltip } from './tooltipContext';

interface ClubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubData?: PublicClubResult;
}

const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({
  isOpen,
  onClose,
  clubData,
}) => {
  if (!isOpen || !clubData) {
    return null;
  }
  const { setTooltipVisibility } = useTooltip();
  useEffect(() => {
    setTooltipVisibility(false);

    return () => {
      setTooltipVisibility(true);
    };
  }, [isOpen, setTooltipVisibility]);

  return (
    <Modal mode="center">
      <DetailsModal onClose={onClose}>
        <div className="flex flex-col lg:flex-row items-stretch gap-6 text-white lg:h-[232px]">
          <div
            className={` w-full h-full ${
              clubData?.anthemUrl ? 'lg:w-[240px]' : ''
            }`}
          >
            <CardInfoModal data={clubData} className="h-full" />
          </div>
          {clubData?.anthemUrl && (
            <div className="lg:flex-1 w-full h-[232px] lg:h-full mt-4 lg:mt-0.5">
              <ReactPlayer
                src={clubData?.anthemUrl}
                width="100%"
                height="100%"
                controls={true}
              />
            </div>
          )}
        </div>
        <p className="text-sm/6 mt-8 font-normal">
          {clubData?.detileDiscription}
        </p>
        <FanbasePower power={100} />

        {(clubData?.kitDiscription || clubData?.kitVideoUrl) && (
          <InfoSection
            title="Club Kit"
            description={clubData?.kitDiscription}
            videoUrl={clubData?.kitVideoUrl}
          />
        )}

        {(clubData?.staduimDiscription || clubData?.stadiumVideoUrl) && (
          <InfoSection
            title="Club stadium"
            description={clubData?.staduimDiscription}
            videoUrl={clubData?.stadiumVideoUrl}
          />
        )}

        {(clubData?.bestPlayerDiscription || clubData?.bestPlayerVideoUrl) && (
          <InfoSection
            title="Club Best Player"
            description={clubData?.bestPlayerDiscription}
            videoUrl={clubData?.bestPlayerVideoUrl}
          />
        )}

        {(clubData?.coachDiscription || clubData?.coachVideoUrl) && (
          <InfoSection
            title="Club Manager"
            description={clubData?.coachDiscription}
            videoUrl={clubData?.coachVideoUrl}
          />
        )}
        {(clubData?.vehicleDiscription || clubData?.vehicleVideoUrl) && (
          <InfoSection
            title="Club Transport"
            description={clubData?.vehicleDiscription}
            videoUrl={clubData?.vehicleVideoUrl}
          />
        )}
        {(clubData?.symbolDiscription || clubData?.symbolVideoUrl) && (
          <InfoSection
            title="Club Mascot"
            description={clubData?.symbolDiscription}
            videoUrl={clubData?.symbolVideoUrl}
          />
        )}
      </DetailsModal>
    </Modal>
  );
};

export default ClubDetailsModal;
