export const API_ENDPOINTS = {
  WORLD_MAP: {
    GET_SPORTS_LIST: '/api/WorldMap/GetSportsList/GetSportsList',
    GET_TECHNO_SECTORS_LIST: '/api/WorldMap/GetSectorsList/GetSectorsList',
    GET_COUNTRIES_LIST: '/api/WorldMap/GetCountriesList/GetCountriesList',
    GET_CITIES_LIST: '/api/WorldMap/GetCitiesList/GetCitiesList',
    GET_PUBLIC_CLUB: '/api/WorldMap/GetPublicClubs/GetPublicClubs',
    GET_COUNTRY_AND_CITY_NAME_WITH_COORDINATES:
      '/api/WorldMap/GetCountryAndCityNameWithCoordinates/GetCountryAndCityNameWithCoordinates',
  },
  USER: {
    LOGIN: '/api/User/Login',
    LOGOUT: '/api/User/Logout',
  },

  ADMIN: {
    GET_CLUBS_LIST: '/api/Admin/GetClubsList/GetClubsList',
    DELETE_CLUB: '/api/Admin/DeleteClub/DeleteClub',
    CREATE_CLUB: 'api/Admin/CreateClub/CreateClub',
  },
};
