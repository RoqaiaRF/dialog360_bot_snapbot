var haversine = require("haversine-distance");

//First point in your haversine calculation
var point1 = { lat:30.826932, lng: 35.649337 }

//Second point in your haversine calculation
var point2 = { lat: 31.075179, lng: 35.595378 }

var haversine_m = haversine(point1, point2); //Results in meters (default)
var haversine_km = haversine_m /1000; //Results in kilometers

module.exports = 
haversine_m,
haversine_km
;
