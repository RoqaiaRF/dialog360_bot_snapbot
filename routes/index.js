const express = require("express");
const router = express.Router();
const getStoreData = require("../database/redis/getStoreData");
const productController = require("../app/controllers/productController");
const storeController = require("../app/controllers/storeController");
const categoryController = require("../app/controllers/categoryController");
const categoryPhase = require("../public/phases/categoryPhase");
const productPhase = require("../public/phases/productPhase");
const welcomeLangPhase = require("../public/phases/welcomeLangPhase");

const redis = require("redis");
const client = redis.createClient();
const locationPhase = require("../public/phases/locationPhase");
let phase_id;

//check if user is choose Arabic or English 
const setUserLannguage= (sender_id)=>{
  if (message == "العربية")
  {
    client.set(`${sender_id}:language`, "ar");
  }
  else if (message == "English")
  {
    client.set(`${sender_id}:language`, "en");

  }

}
// get the stored language from redis
const getUserLannguage= async(sender_id)=>{
  
  return  await client.get(`${sender_id}:language`);
  
}


const bot = (sender_id, message) => {
  // Welcome & Languages phase
  welcomeLangPhase(sender_id);
  //check if user is choose Arabic or English 
  setUserLannguage(sender_id);
 



}














const isPhase = (phase_id, sender_id) => {
  if (phase_id == 0 || phase_id == null || phase_id == undefined) {
    locationPhase(sender_id);
   
  } else {

  }
};

router.post("/",  function (req, res, next) {

  let message = req.body.Body;
  let sender_ID = req.body.From;
  //get the sestored data from the session

  client.get( key, (err, data) => {
    if (err) {
      phase_id = err;
    } 
    else if ( data !== null ) {
      phase_id= data;
   
    }
   
  });

  bot(sender_ID, message)
 // productPhase(req.body.From, 200);
  
 //isPhase(phase_id,sender_ID);

  //console.log(phase_id);

  //getStoreData.setString(req.body.WaId, 0 );

  // categoryPhase(req.body.From)
  // const storesList = await storeController.getAll();
  // let branchs = [];
  // storesList.map((el, i) => {
  //   branchs[i] = el.name_ar;
  // });
  // console.log("All stores:", JSON.stringify(branchs, null, 2));
});

module.exports = router;
