const printer = require("pdf-to-printer");
const express = require("express");
const randomId = require("random-id");
const logger = require("./config/winston");
const timeConverter = require('./config/timeConverter');
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = 3000;
const LENGTH = 7;
const pattern = "aA0";

app.use(express.json());
app.use(cors());
app.use(morgan("combined", { stream: logger.stream }));

app.post("/print", (req, res) => {
  let printSettings, options, jobID;

  const {
    printerID,
    path,
    fileName,
    printOptions, //see params.txt
    printDescription,
  } = req.body;

  printSettings = "-print-settings " + '"' + printOptions + '"';
  jobID = randomId(LENGTH, pattern);
  options = {
    printer: printerID,
    win32: [printSettings],
  };

  // check if requested printer is available
  printer.getPrinters()
  .then(allPrinters => {
    if(allPrinters.includes(printerID)) {
      printer
      .print(path + fileName, options)
      .then(response => {
        logger.info(`${req.ip} - - ${timeConverter(Date.now())} - successful print request with ID: ${jobID} | fileName: ${fileName}`);
        res.send(`success, ${fileName} is being printed by ${printerID} with ID: ${jobID}`)
      })
      .catch(error => {
        logger.error(`${req.ip} - - ${timeConverter(Date.now())} - print request failed with ID: ${jobID} || see => ${error.cmd}`)
        res.send(`print request failed with ID: ${jobID} - please see logs.`)
      });
    } else {
      res.send(`no printer matches ${printerID}, please use another one or try again!`)
      return;
    }
  })
  .catch(err => {
    console.log(err)
  })
});

app.get("/test", (req, res) => {
  printer.getDefaultPrinter()
  .then(defaultPrinter => {console.log(defaultPrinter)})
  .catch(error => console.error(error));
  
  res.send("Working good, See the logs in console for printers");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
