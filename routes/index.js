const express = require("express");
const router = express.Router();

const productController = require("../app/controllers/productController")
const storeController = require("../app/controllers/storeController");
const categoryController = require("../app/controllers/categoryController");
const categoryPhase = require("../public/phases/categoryPhase")
/* Test To Get All Stores From Database. */
router.get("/", async function (req, res, next) {
  
 console.log( await productController.getProducts(100))
 // categoryPhase(req.body.From)
  // const storesList = await storeController.getAll();
  // let branchs = [];
  // storesList.map((el, i) => {
  //   branchs[i] = el.name_ar;
  // });
  // console.log("All stores:", JSON.stringify(branchs, null, 2));

});

module.exports = router;
 