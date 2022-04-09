const express = require("express");
const router = express.Router();
const redis = require("ioredis");
const client = redis.createClient();
const sendMsg = require("../public/phases")

//set data to the redis session
const setUserVars = async (receiver_id, variable, value) => {
  await client.set(`${receiver_id}:${variable}`, value);
};

//get the stored data from the redis session
const getUserVars = async (receiver_id, variable) => {
  const myKeyValue = await client.get(`${receiver_id}:${variable}`);
  return myKeyValue;
};

const bot = (sender_id, message) => {

  let Phase = await getUserVars(sender_id, "phase");

  switch (Phase) {
    case "0":
    case null:
    case undefined:
      //Send ERROR message : If the message sent is wrong
      sendMsg.errorMsg(sender_id);
      //Store phase # 1 EX: (key, value) => ( whatsapp:+96563336437 , 1 )
      setUserVars(sender_id, "phase", "1");

      break;

    case "1":
      if (req.body.Body === "العربية") {
        setUserVars(
          sender_id,
          "cats",
          JSON.stringify(await categoryController.getCat(1))
        );
        const cats = JSON.parse(await getUserVars(sender_id, "cats"));
        sendMsg(sender_id, responses.categories(cats));
        setUserVars(sender_id, "phase", "2");
      } else {
        sendMsg(sender_id, responses.errorMsg);
      }
      console.log("phase 1");
      break;
    case "2":
      if (req.body.Body == "0") {
        sendMsg(sender_id, responses.welcomeMsg());
        setUserVars(sender_id, "phase", "1");
      }
      console.log("phase 2");
      break;
    case "3":
      console.log("phase 3");
      break;
    case "4":
      console.log("phase 4");
      break;
    case "5":
      console.log("phase 5");
      break;
    case "6":
      console.log("phase 6");
      break;
    case "7":
      console.log("phase 7");
      break;
    case "8":
      console.log("phase 8");
      break;
    default:
      break;
  }
};

router.post("/", function (req, res, next) {
  let message = req.body.Body;
  let sender_ID = req.body.From;

  bot(sender_ID, message);
});

module.exports = router;
