var express = require("express");
var router = express.Router();
const categoryController = require("../app/controllers/categoryController");
const storeController = require("../app/controllers/storeController");
/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    const cats = await categoryController.getCategories(1);
    const store = await storeController.storeDetails("98746632");
    console.log(JSON.stringify(cats, null, 2));
    res.send("respond with a resource");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;