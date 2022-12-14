const express = require("express");
const bodyParser = require("body-parser");
const app =express();
var cors = require('cors');
  app.use(
    cors({
      allowedHeaders: ["authorization", "Content-Type", 'X-Requested-With'], // you can change the headers
      exposedHeaders: ["authorization", 'X-Requested-With'], // you can change the headers
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false
    })
  );

  
app.get('/test',(req, res)=>res.send('resres'))
const helmet = require("helmet");
const morgan = require("morgan");

const indexRouter = require("./routes");
const renameConversation = require("./routes/renameConversation");
const sendMessage = require("./routes/sendMessage")
const snapbotBot = require("./routes/snapbotBot")

// Define the express app

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// defining an endpoint to use it as webhook in whatsapp bot

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// enabling CORS for all requests
app.use("/", indexRouter);

// هذا بوت مخصص لشركة سنابوت , معمول هكذا مبدأيا فقط , سنطوره لاحقا
app.use("/snapbotbot", snapbotBot);

// adding morgan to log HTTP requests
app.use(morgan("combined"));

//Get all conversations based on the store's phone number
//app.use("/getConversations", getConversations);

//Get all messages of a conversation based on the conversation id

// Rename a conversation
app.use("/renameConversation", renameConversation);

// Get all messages of a conversation based on the conversation id
app.use("/sendMessage", sendMessage);


// starting the server
app.listen(8080, () => {
  console.log(`Example app listening at http://localhost:8080`);
});
