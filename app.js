let express = require("express");
const bodyParser = require("body-parser");

const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const middleware = require('i18next-express-middleware');


const indexRouter = require("./routes/index");
//const demoRouter = require("./routes/demo");
const app = express();

//TODO: Handle Language Using "i18next" -- not very important
// For multiLanguage
/*i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
    fallbackLng: "ar",
    preload: ["en", "ar"],
    saveMissing: true,
  });
  */
//app.use(middleware.handle(i18next));

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", indexRouter);
//app.use("/demo", demoRouter);

app.listen(8080, () => {
  console.log(`Example app listening at http://localhost:8080`);
});
