const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const indexRouter = require("./routes");
const getConversations = require("./routes/getConversations");
const getMessages = require("./routes/getMessages");
const renameConversation = require("./routes/renameConversation");

// Define the express app
const app = express();


// // adding Helmet to enhance your Rest API's security
// app.use(helmet());

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// defining an endpoint to use it as webhook in whatsapp bot
app.use("/", indexRouter);

// // enabling CORS for all requests
// app.use(cors());

// // adding morgan to log HTTP requests
// app.use(morgan("combined"));

//Get all conversations based on the store's phone number
app.use("/getConversations", getConversations);

//Get all messages of a conversation based on the conversation id
app.use("/getMessages", getMessages);

// Rename a conversation
app.use("/renameConversation", renameConversation);
// starting the server
app.listen(8080, () => {
  console.log(`Example app listening at http://localhost:8080`);
});
