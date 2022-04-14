var express = require("express");
var router = express.Router();
const categoryController = require("../app/controllers/categoryController");
const { getNearestBranch } = require("../app/controllers/storeController");
const { getNearestLocation, getDistance, getCityName } = require("../app/helpers/location");
/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    //const cats = await categoryController.getCategories("gfgfgf", 1);
    const city = await getCityName( 30.77163179298992, 35.60097948249704)
  const store = await getNearestBranch(
      "55238886",
      30.77163179298992, 35.60097948249704
    ); 
    console.log(JSON.stringify(store, null, 2));
    res.send("respond with a resource");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
