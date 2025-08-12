import React, { useState, useEffect } from "react";
import { Modal } from "./modal";
import DetailsModal from "../assets/icons/DetailsModal";
import CardInfoModal from "../assets/icons/CardInfoModal";
import ClubKit from "./clubKit";
import FanbasePower from "./fanBase";
import { PublicClubResult } from "../lib/usePublicClubs";

interface ClubDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubData?: PublicClubResult;
}

const ClubDetailsModal: React.FC<ClubDetailsModalProps> = ({
  isOpen,
  onClose,
  clubData
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
            <CardInfoModal
              data={modalData}
              className="h-full"
            />
          </div>
          <div className="flex-1 h-full">
            <video
              src={modalData?.videoUrl}
              controls
              className="w-full h-full rounded-lg border-none object-cover"
            />
          </div>
        </div>
        <FanbasePower power={100} />
        <ClubKit data={modalData} />
      </DetailsModal>
    </Modal>
  );
};

export default ClubDetailsModal;
