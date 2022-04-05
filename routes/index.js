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
  //&  DONE
  /*
  console.log("Test all redis functions: ");

  const obj=  {
    'javascript': 'ReactJS',
    'css': 'TailwindCSS',
    'node': 'Express'
  }
  getStoreData.setObject('frameworks_hash', obj);
  console.log(await  getStoreData.getObject('frameworks_hash'))
  
  getStoreData.setString("framework", "ReactJS")
  console.log(await getStoreData.getString("framework"))
  
  const array = ['frameworks_list', 'ReactJS', 'Angular'];
  getStoreData.setList(array)
  console.log(await getStoreData.getList('frameworks_list',0,-1)) //0, -1 get all list item
*/
//TODO: TEST ALL REDIS OPERATIONS

//Test redis operations
/*
operations.deleteKeys("framework");
operations.giveExpirationTime("frameworks_list",3)
*/

});

module.exports = router;
 