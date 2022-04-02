const express = require("express");
const router = express.Router();
const operations = require("../database/redis/operations");
const getStoreData = require("../database/redis/getStoreData"); //import redis functions & operations
const storeController = require("../app/controllers/storeController");

/* Test To Get All Stores From Database. */
router.get("/", async function (req, res, next) {
  const storesList = await storeController.getAll();
  let branchs = [];
  storesList.map((el, i) => {
    branchs[i] = el.name_ar;
  });
  console.log("All stores:", JSON.stringify(branchs, null, 2));

  //Test all redis functions
  console.log("Test all redis functions: ");

  getStoreData.setString("framework", "ReactJS");
  console.log(await getStoreData.getString("framework") );
});

module.exports = router;
