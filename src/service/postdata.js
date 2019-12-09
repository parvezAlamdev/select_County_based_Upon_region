const axios = require("axios");

export const getAllCountries = region => {
  return axios.get("https://restcountries.eu/rest/v2/region/" + region);
};
export const getCountryInfo = col => {
  return axios.get("https://restcountries.eu/rest/v2/alpha/" + col);
};
