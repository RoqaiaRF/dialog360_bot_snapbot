const twilio = require('twilio');
import dotenv from 'dotenv';

dotenv.config();

//  string فيبقى الاحتمال الاخير وهو undefined or null علامة ! هي من اجل الغاء ال 
const ACCOUNT_SID: string = (process.env.TWILIO_ACCOUNT_SID! as string);
const AUTH_TOKEN:  string = (process.env.TWILIO_AUTH_TOKEN! as string);
const senderID:    string = 'whatsapp:+96563336437';

//& EXAMPLE MESSAGE CONTENT
/* 
 * receiverID: 'whatsapp:+962799849386';
 * text message : `Welcome to our bot :) 💊🚰`
 * template message : `welcome roqaia which language you want ?roqaia`
 * mediaURL: 'https://www.gardeningknowhow.com/wp-content/uploads/2019/09/flower-color-400x391.jpg'
*/

const client = twilio( ACCOUNT_SID, AUTH_TOKEN, { lazyloading: true } );


//Send text , media & emoji message to specific number
const sendMessage = async(message: string, receiverID: string, mediaURL: any) => {

    try{ await client.messages
        .create({
            from: senderID,
            to: receiverID,
            body: message,
            mediaUrl: mediaURL,
        });

      } catch(error){ console.log (`Error at sending message: ${error}`); }
       
  }


export { sendMessage };