import React, { useState, useEffect } from "react";
import { Modal } from "./modal";
import DetailsModal from "../assets/icons/DetailsModal";
import CardInfoModal from "../assets/icons/CardInfoModal";
import ReactPlayer from "react-player";
import FanbasePower from "./fanBase";
import { PublicClubResult } from "../lib/usePublicClubs";
import InfoSection from "./clubKit";

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
  const [modalData, setModalData] = useState<PublicClubResult | null>(null);

  useEffect(() => {
    if (isOpen && clubData) {
      console.log("Setting modal data:", clubData);
      setModalData(clubData);
    } else if (isOpen && !clubData) {
      console.log("No club data provided, closing modal");
      onClose();
    }
  }, [isOpen, clubData, onClose]);

  if (!isOpen || !modalData) {
    return null;
  }

  return (
    <Modal mode="center">
      <DetailsModal onClose={onClose}>
        <div className="flex items-stretch gap-6 text-white h-[232px]">
          <div className="w-[240px] h-full">
            <CardInfoModal data={modalData} className="h-full" />
          </div>
          <div className="flex-1 h-full mt-0.5">
            <ReactPlayer
              src={modalData?.videoUrl}
              width="100%"
              height="100%"
              controls={true}
            />
          </div>
        </div>
        <FanbasePower power={100} />
        <InfoSection
          title="Club Kit"
          description={modalData?.kitDiscription}
          videoUrl={modalData?.kitVideoUrl}
        />
        <InfoSection
          title="Club stadium"
          description={modalData?.staduimDiscription}
          videoUrl={modalData?.stadiumVideoUrl}
        />
        <InfoSection
          title="Club Best Player"
          description={modalData?.bestPlayerDiscription}
          videoUrl={modalData?.bestPlayerVideoUrl}
        />

        <InfoSection
          title="Club Manager"
          description={modalData?.managerDescription}
          videoUrl={modalData?.managerVideoUrl}
        />
        <InfoSection
          title="Club Transport"
          description={modalData?.transportDescription}
          videoUrl={modalData?.transportVideoUrl}
        />
        <InfoSection
          title="Club Mascot"
          description={modalData?.mascotDescription}
          videoUrl={modalData?.mascotVideoUrl}
        />
      </DetailsModal>
    </Modal>
  );
};

export default ClubDetailsModal;
