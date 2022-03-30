var express = require('express');
var router = express.Router();

const storeController =  require("../app/controllers/storeController")


/* Test To Get All Stores From Database. */
router.get('/', async function(req, res, next) {
    const storesList = await storeController.getAll() 
    let branchs = []
    storesList.map((el, i) => {
        branchs[i] = el.name_ar
    })
    console.log("All stores:", JSON.stringify(branchs, null, 2));
});

module.exports = router;
