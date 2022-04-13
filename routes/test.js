var express = require("express");
var router = express.Router();
const categoryController = require("../app/controllers/categoryController");
const { getNearestBranch } = require("../app/controllers/storeController");
const { getNearestLocation, getDistance } = require("../app/helpers/location");
/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    //const cats = await categoryController.getCategories("gfgfgf", 1);
    const store = await getNearestBranch(
      "55238886",
      34.904184112985334,
      3.452754391614417
    );
    console.log(JSON.stringify(store, null, 2));
    res.send("respond with a resource");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
