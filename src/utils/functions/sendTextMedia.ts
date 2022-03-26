const twilio = require('twilio');
import dotenv from 'dotenv';

dotenv.config();

//  string فيبقى الاحتمال الاخير وهو undefined or null علامة ! هي من اجل الغاء ال 
const ACCOUNT_SID: string = (process.env.TWILIO_ACCOUNT_SID! as string);
const AUTH_TOKEN:  string = (process.env.TWILIO_AUTH_TOKEN! as string);
const senderID:    string =  (process.env.SENDER_ID! as string);

const client = twilio( ACCOUNT_SID, AUTH_TOKEN, { lazyloading: false } ); //lazyloading:  speed of sending /true or false

//Send text , media & emoji message to specific number
const sendTextMedia = async(message: string, receiverID: string) => {

     await client.messages
        .create({
            from: senderID,
            to: receiverID, 
            body: message
        })
        .then( (message: any):any  => {
             console.log( message.body)
        })

        .catch( (error: any) => {
            console.log (`Error at sending message: ${error}`); 
        })
       console.log(senderID)
  }


module.exports= sendTextMedia;