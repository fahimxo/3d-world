import { FC } from "react";

export interface ClubPreviewProps {
 latetude:number;   
 longitude:number;  
 sportType:string;
 currentName:string;
 lore:string;
 clubAnthem:string;
 logo:string;

 clubKitUrl:string;
 clubKitDescription:string;
}

 interface VideoCardProps {
   title:string;
   description:string;  
   url:string;  
   }


const ClubPreview:FC<ClubPreviewProps> = ({...props}) => {
  return (
    <div className="flex flex-col items-center gap-3 ">      
      <ClubInfo/>    </div>
  );
};

export default ClubPreview;


const ClubInfo=({name='Galactic Crown',technoSector='Eurovia',country='Spain',city='Madrid',logo='/src/assets/images/clubLogoTest.png',}) => {
  return (
    <div
    style={{ 
      clipPath: "polygon(98% 0, 100% 16%, 100% 100%, 2% 100%, 0 84%, 0 0)",
    }}
      className={`flex flex-col w-full p-[2px] color-[rgba(0,119,86,0.2)] min-h-[106px]`}  
    >
<div className="text-[rgba(0,255,166,1)] text-[12px] text-left">Club Info</div>
<div className="flex justify-between items-center gap-3">
          <div className="flex flex-col items-center gap-2 justify-between h-full"><span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">Coordinates</span><span className="text-[12px] font-[400] font-bold">{technoSector}</span></div>
          <div className="flex flex-col items-center gap-2 justify-between h-full"><span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">Sport Type</span><span className="text-[12px] font-[400] font-bold">{country}</span></div>
          <div className="flex flex-col items-center gap-2 justify-between h-full"><span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">Current Name</span><span className="text-[12px] font-[400] font-bold">{city}</span></div>
          <div className="flex flex-col items-center gap-2 justify-between h-full"><span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">Club Lore</span><span className="text-[12px] font-[400] font-bold">{city}</span></div>
          <div className="flex flex-col items-center gap-2 justify-between h-full"><span className="text-[12px] font-[400] font-regular text-[#7D7D7D]" >Club Anthem</span><span className="text-[12px] font-[400] font-bold">{city}</span></div>
          <div className="flex flex-col items-center gap-2 justify-between h-full"><span className="text-[12px] font-[400] font-regular text-[#7D7D7D]">Club Logo</span><span className="text-[12px] font-[400] font-bold"> <img
            src={logo}
            alt={name}
            className="w-[80px] h-auto "
          /></span></div>
        
        </div>



    </div>
  );
}


const VideoCard:FC<VideoCardProps>=({title='Galactic Crown',url='url',description=""}) => {
  return (
    <div>
    <div>
        {title}
    </div>
    <div>

        <div></div>
        <div></div>
    </div>
    
    
    
    </div>)}