const axios = require("axios");
const geolib = require("geolib");

/*
return city name from google maps api
*/
const getCityName = async (lat, lng) => {
  const baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";
  const key = "AIzaSyCsF0xICeSZccCfk5lZ_jeNBpT5N4-uOsc";
  let city;
  await axios
    .get(baseUrl + `latlng=${lat},${lng}&key=${key}`)
    .then((res) => {
      console.log("res",res);
    for(let j=0; j < res.data.results.length ;j++){

      let address_components = res.data.results[j].address_components;

       for (let i = 0; i < address_components.length; i++) {
        if (
          address_components[i].types[0] === "locality" &&
          address_components[i].types[1] === "political"
        ) {
         
          city = address_components[i].long_name;
        }
       
      }
    }
     
    })
    .catch((err) => {
      throw err;
    });
    console.log("City name:  ",city);
  return city;
};

/**
 * function return nerset location from user cuurent location
 */

const getNearestLocation = async (current, locations) => {
  const nearest = geolib.findNearest(current, locations);
  return nearest;
};

/**
 * function return distance between to locations
 * default unit is meter, another option is "km"
 */
const getDistance = async (start, end, unit = null) => {
  const distance = geolib.getDistance(start, end);
  if (unit === "km") return distance / 1000;
  return distance;
};

module.exports = { getCityName, getNearestLocation, getDistance };
