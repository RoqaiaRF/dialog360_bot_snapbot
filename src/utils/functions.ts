const twilio = require('twilio');
const client = twilio(
    "ACd4d92fca5bbdb9a425b4d78d7c3d58f7",'5de0895e94164fa5dad19ed34858440a'
// process.env.TWILIO_ACCOUNT_SID,
// process.env.TWILIO_AUTH_TOKEN
);

//Send text message to specific number
const sendTextMessage = () => {


client.messages
.create({
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+962799849386',
    body: 'Ahoy from Twilio',
    mediaUrl: 'https://bit.ly/whatsapp-image-example',
})
 
console.log("post from function") 
  
  }
export default sendTextMessage;