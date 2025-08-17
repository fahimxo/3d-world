import React from "react";
import ReactPlayer from "react-player";

interface InfoSectionProps {
  title: string;
  description: string | null | undefined;
  videoUrl: string | null | undefined;
}

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  description,
  videoUrl,
}) => {
  return (
    <div className="mt-3.5">
      <div className="mt-4.5 h-px bg-white w-full opacity-50" />
      <h3 className="text-white text-lg font-bold my-3.5">{title}</h3>
      <div className="w-full flex items-stretch lg:flex-row flex-col gap-4 lg:h-[192px] h-full">
        <div className="lg:flex-1 w-full lg:h-full h-[179px] bg-black rounded-lg">
          {videoUrl && (
            <ReactPlayer
              src={videoUrl}
              width="100%"
              height="100%"
              controls={true}
              light={true}
            />
          )}
        </div>
        <div className="lg:flex-1 w-full h-full overflow-hidden relative ">
          <p className="text-gray-300 text-sm leading-6 tracking-widest h-full overflow-auto">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
