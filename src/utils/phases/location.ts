// const Twilio = require('twilio');

// exports.handler = function (context:any, event:any, callback:any) {
//     let twiml = new Twilio.twiml.MessagingResponse();
  
//     if (!event.Latitude || !event.Longitude) {
//       twiml.message("If you would like some food, please send me your location.");
//       callback(null, twiml);
//     } else {
//       const location = {
//         lat: event.Latitude,
//         lon: event.Longitude
//       };
//       twiml.message(
//         `Your latitude is ${location.lat} and your longitude is ${location.lon}`
//       );
//       callback(null, twiml);
//     }
//   };
  