import { FC } from "react";
import { ClubData } from "./ClubCard";
import Line from "./Line";

export interface ClubPreviewProps {
  latetude: number;
  longitude: number;
  sportType: string;
  currentName: string;
  lore: string;
  clubAnthem: string;
  logo: string;

  clubKitUrl: string;
  clubKitDescription: string;
}

interface VideoCardProps {
  title: string;
  description: string;
  url: string;
}

const ClubPreview: FC<ClubData> = ({ ...props }) => {
  const { kitDiscription, kitVideoUrl, stadiumVideoUrl, bestPlayerVideoUrl } =
    props;
  return (
    <div className="flex flex-col items-center gap-3 ">
      <ClubInfo {...props} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full ">
        <VideoCard
          title="Club Kit"
          description={kitDiscription}
          url={kitVideoUrl}
        />
        <VideoCard
          title="Club Stadium"
          description={stadiumVideoUrl} //
          url={stadiumVideoUrl}
        />
        <VideoCard
          title="Club Best Player"
          description={bestPlayerVideoUrl} //
          url={bestPlayerVideoUrl}
        />
        <VideoCard
          title="Club Manager"
          description={kitDiscription} //
          url={kitVideoUrl} //
        />
        <VideoCard
          title="Club Transport"
          description={kitDiscription} //
          url={kitVideoUrl} //
        />
        <VideoCard
          title="Club Mascot"
          description={kitDiscription} //
          url={kitVideoUrl} //
        />
        <Line />
      </div>
    </div>
  );
};

export default ClubPreview;

const ClubInfo: FC<ClubData> = ({
  originalClubName,
  sectorName,
  countryName,
  city,
  logoUrl,
}) => {
  return (
    <div
      style={{
        clipPath: "polygon(98% 0, 100% 16%, 100% 100%, 2% 100%, 0 84%, 0 0) ",
      }}
      className={`flex flex-col w-full p-[5px] bg-[rgba(0,119,86,0.2)] min-h-[106px] gap-[10px]`}
    >
      <div className="text-[rgba(0,255,166,1)] text-[12px] text-left h-full">
        Club Info
      </div>
      <div className="flex justify-between items-top gap-3 h-fit">
        <div className="flex flex-col items-center gap-2 justify-between h-full stretch">
          <span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">
            Coordinates
          </span>
          <span className="text-[12px] font-[400] ">{sectorName}</span>
        </div>
        <div className="flex flex-col items-center gap-2 justify-between h-full">
          <span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">
            Sport Type
          </span>
          <span className="text-[12px] font-[400] ">{countryName}</span>
        </div>
        <div className="flex flex-col items-center gap-2 justify-between h-full">
          <span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">
            Current Name
          </span>
          <span className="text-[12px] font-[400] ">{city}</span>
        </div>
        <div className="flex flex-col items-center gap-2 justify-between h-full">
          <span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">
            Club Lore
          </span>
          <span className="text-[12px] font-[400] ">{city}</span>
        </div>
        <div className="flex flex-col items-center gap-2 justify-between h-full">
          <span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">
            Club Anthem
          </span>
          <span className="text-[12px] font-[400] ">{city}</span>
        </div>
        <div className="flex flex-col items-center gap-2 justify-between h-full">
          <span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">
            Club Logo
          </span>
          <span className="text-[12px] font-[400] ">
            <img
              src={logoUrl}
              alt={originalClubName}
              className="w-[80px] h-auto "
            />
          </span>
        </div>
      </div>
    </div>
  );
};

const VideoCard: FC<VideoCardProps> = ({
  title = "Galactic Crown",
  url = "https://www.youtube.com/watch?v=AvnUdL32afE",
  description = "",
}) => {
  return (
    <div
      style={{
        clipPath:
          "polygon(92% 0px, 100% 8%, 100% 100%, 8% 100%, 0px 92%, 0px 0px)",
      }}
      className="flex flex-col gap-3 w-full py-[5px] bg-[rgba(0,119,86,0.2)]  justify-center items-center h-fit"
    >
      <div className="text-[#00FFA6] font-[700] text-[12px]">{title}</div>
      <div className="flex gap-3 h-fit">
        <div className="h-[80px] flex flex-col gap-3 justify-start items-center">
          <div className="text-[#7D7D7D] text-[12px] font-[400]">Video</div>
          <div className="w-[82px] h-[41px]">
            <YouTubeThumbnail url={url} />
          </div>
        </div>
        <div className="h-[80px] flex flex-col gap-3 justify-start items-center">
          <div className="text-[#7D7D7D] text-[12px] font-[400]">
            Description
          </div>
          <div className="cursor-pointer" title={description}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer"
            >
              <path
                d="M10.833 17.8411H13.1663V10.8411H10.833V17.8411ZM11.9997 8.50779C12.3302 8.50779 12.6073 8.39599 12.8309 8.17238C13.0545 7.94876 13.1663 7.67168 13.1663 7.34113C13.1663 7.01057 13.0545 6.73349 12.8309 6.50988C12.6073 6.28626 12.3302 6.17446 11.9997 6.17446C11.6691 6.17446 11.392 6.28626 11.1684 6.50988C10.9448 6.73349 10.833 7.01057 10.833 7.34113C10.833 7.67168 10.9448 7.94876 11.1684 8.17238C11.392 8.39599 11.6691 8.50779 11.9997 8.50779ZM11.9997 23.6745C10.3858 23.6745 8.86912 23.3682 7.44968 22.7557C6.03023 22.1432 4.79551 21.312 3.74551 20.262C2.69551 19.212 1.86426 17.9772 1.25176 16.5578C0.639258 15.1383 0.333008 13.6217 0.333008 12.0078C0.333008 10.3939 0.639258 8.87724 1.25176 7.45779C1.86426 6.03835 2.69551 4.80363 3.74551 3.75363C4.79551 2.70363 6.03023 1.87238 7.44968 1.25988C8.86912 0.647375 10.3858 0.341125 11.9997 0.341125C13.6136 0.341125 15.1302 0.647375 16.5497 1.25988C17.9691 1.87238 19.2038 2.70363 20.2538 3.75363C21.3038 4.80363 22.1351 6.03835 22.7476 7.45779C23.3601 8.87724 23.6663 10.3939 23.6663 12.0078C23.6663 13.6217 23.3601 15.1383 22.7476 16.5578C22.1351 17.9772 21.3038 19.212 20.2538 20.262C19.2038 21.312 17.9691 22.1432 16.5497 22.7557C15.1302 23.3682 13.6136 23.6745 11.9997 23.6745ZM11.9997 21.3411C14.6052 21.3411 16.8122 20.437 18.6205 18.6286C20.4288 16.8203 21.333 14.6133 21.333 12.0078C21.333 9.40224 20.4288 7.19529 18.6205 5.38696C16.8122 3.57863 14.6052 2.67446 11.9997 2.67446C9.39412 2.67446 7.18718 3.57863 5.37884 5.38696C3.57051 7.19529 2.66634 9.40224 2.66634 12.0078C2.66634 14.6133 3.57051 16.8203 5.37884 18.6286C7.18718 20.437 9.39412 21.3411 11.9997 21.3411Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const YouTubeThumbnail = ({ url }) => {
  const extractVideoId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractVideoId(url);
  const thumbnails = {
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    default: `https://img.youtube.com/vi/${videoId}/0.jpg`,
  };

  return (
    <img
      className="w-full transition-opacity group-hover:opacity-90 h-full object-cover"
      src={thumbnails.mq}
      alt="YouTube video cover"
      onError={(e) => {
        e.target.src = thumbnails.default;
      }}
    />
  );
};
