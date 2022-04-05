var haversine = require("haversine-distance");

//EX: var point1 = { lat:30.826932, lng: 35.649337 }

//EX: var point2 = { lat: 31.075179, lng: 35.595378 }

const distance_m = (point1, point2) => {
  return haversine(point1, point2); //Results in meters (default)
};

const distance_km = (point1, point2) => {
  return haversine_m(point1, point2) / 1000; //Results in kilometers
};
module.exports = { distance_m, distance_km };
 