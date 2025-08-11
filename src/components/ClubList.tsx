import { useEffect, useState } from "react";
import ClubCard, { ClubCardProps } from "./ClubCard"
// import api from "src/config/axios";
import { API_ENDPOINTS } from "src/config/endpoint";

const ClubList = () => {
const [clubsData,setClubData] = useState<ClubCardProps[]>([]); 

// const getClubs= async ()=>{
//     try {
//         await api.post(API_ENDPOINTS.ADMIN.GET_CLUBS_LIST, {
//             filter: {
//                 // "sportId": 0,
//                 // "sectorId": 0,
//                 // "countryId": 0,
//                 // "reImaginedName": "string",
//                 // "originalClubName": "string",
//                 // "city": "string",
//                 "onlyVisible": true,
//                 "page": 0,
//                 "pageSize": 100,
//                 // "sortBy": "string",
//                 // "sortDirection": "string"
//           },
//         });
//       } catch (error) {
//         console.error("Logout failed:", error);
//       }

// }


    // useEffect(()=>{
    //   console.log("clubList")
    // },[])   

              
  return (
    <div className="py-6">
    <ClubCard
      name="Galactic Crown"
      technoSector="Eurovia"
      country="Spain"
      city="Madrid"
      logo="/src/assets/images/clubLogoTest.png"
      id={5} 
      clubPreviewData={{
        latetude:50.510287,  
        longitude:4.719585, 
        sportType:"Football",
        currentName:"Real Madrid",
        lore:"Born from Earth’s... ",
        clubAnthem:"url",
        logo:"/src/assets/images/clubLogoTest.png",
       
        clubKitUrl:"url",
        clubKitDescription:"url",
      }}
    />
  </div>)}


export default ClubList;


