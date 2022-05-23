var express = require("express");
const bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
//var demoRouter = require("./routes/demo");

var app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/users", usersRouter);
//app.use("/demo", demoRouter);


app.listen(8080, () => {
  console.log(`Example app listening at http://localhost:8080`);
});


