var express = require("express");
var router = express.Router();

const demo = require("../public/javascripts/demoApp");

router.post("/", (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: "Bad Request",
      message: "req body cannot be empty!",
    });
  }

  let message = req.body.Body;
  let Sender_ID = req.body.From;
  let Latitude = req.body.Latitude;
  let Longitude = req.body.Longitude;
  demo(message, Sender_ID, Latitude, Longitude);
  console.log(req.body);
  console.log(Sender_ID);

  return res.status(200).json({
    status: "success",
    message: req.body,
  });
});

module.exports = router;
