import { Router } from 'express';
const sendTextMedia = require('../../utils/functions/sendTextMedia.ts');
const welcome_lang = require('../../utils/phases/welcome_lang.ts')


// Export module for registering router in express app
export const router: Router = Router();

// Define your routes here


// Post to recive  messages
router.post("/", async(req, res) => {

    if (!req.body.Body){

      return res.status(400).json({
        status: "Bad Request",
        message: "req body cannot be empty!" 
      }); 
    }
    
    let message = req.body.Body;
    let Sender_ID = req.body.From;

    console.log(message);
    console.log(Sender_ID);
  //  await sendTextMedia(` شكرا على رسالتك لقد ارسلت ${message}`,Sender_ID);
   await welcome_lang(Sender_ID);


    res.status(200).json({
      status_code: 1,
      message: req.body
    });

})
