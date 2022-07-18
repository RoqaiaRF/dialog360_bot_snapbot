const express = require("express");
const bodyParser = require("body-parser");
const app =express();
var cors = require('cors');
  app.use(function(req, res, next) {
    // cors({
    //   allowedHeaders: ["authorization", "Content-Type", 'X-Requested-With', "Origin", "Accept"], // you can change the headers
    //   exposedHeaders: ["authorization", 'X-Requested-With'], // you can change the headers
    //   Host :"bot.snapbot.app",
    //   Origin:"https://store.snapbot.app",
    //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //   preflightContinue: true,
      
    // })
   cors({
      credentials: true,
      preflightContinue: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH' , 'DELETE', 'OPTIONS'],
      origin: true
  })

  });

  
app.get('/test',(req, res)=>res.send('resres'))
const helmet = require("helmet");
const morgan = require("morgan");

const indexRouter = require("./routes");
const renameConversation = require("./routes/renameConversation");
const sendMessage = require("./routes/sendMessage")

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
