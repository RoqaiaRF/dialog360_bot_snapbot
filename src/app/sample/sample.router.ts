import { Router } from 'express';
// const sendTextMedia = require('../../utils/functions/sendTextMedia.ts');
// const welcome_lang = require('../../utils/phases/welcome_lang.ts');
const demo = require('../../utils/phases/demo')
// Export module for registering router in express app
export const router: Router = Router();

// Define your routes here


// Post to recive  messages
router.post("/demo", async (req, res) => {

  if (!req.body.Body) {

    return res.status(400).json({
      status: "Bad Request",
      message: "req body cannot be empty!"
    });
  }

  let message = req.body.Body;
  let Sender_ID = req.body.From;
  demo(message,Sender_ID)
  console.log(message);
  console.log(Sender_ID);

  return res.status(200).json({
    status: "success",
    message: req.body
  });

})
