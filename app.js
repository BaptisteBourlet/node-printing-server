const printer = require("pdf-to-printer");
const express = require("express");
const download = require("./config/downloadPDF");
const randomId = require("random-id");
const logger = require("./config/winston");
const timeConverter = require("./config/timeConverter");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = 3000;
const LENGTH = 7;
const pattern = "aA0";

// ============= MIDDLEWARES===================
app.use(express.json());
app.use(cors());
app.use(morgan("combined", { stream: logger.stream }));

// ============END POINTS======================
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
  

  // first, download the file 
  download(path, fileName)
    .then((success) => {
      let file = "pdf/" + fileName;
      printer
        .getPrinters()
        .then((allPrinters) => { 
          if (allPrinters.includes(printerID)) { //check if printer is available on machine
            printer
              .print(file, options)
              .then((response) => {
                logger.info(
                  `${req.ip} - - ${timeConverter(
                    Date.now()
                  )} - successful print request with ID: ${jobID} | fileName: ${fileName}`
                );
                res.send(
                  `success, ${fileName} is being printed by ${printerID} with ID: ${jobID}`
                );
              })
              .catch((error) => {
                logger.error(
                  `${req.ip} - - ${timeConverter(
                    Date.now()
                  )} - print request failed with ID: ${jobID} || see => ${
                    error.cmd
                  }`
                );
                res.send(
                  `print request failed with ID: ${jobID} - please see logs.`
                );
              });
          } else {
            res.send(
              `no printer matches ${printerID}, please use another one or try again!`
            );
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((error) => console.error(error));

  // check if requested printer is available
});

app.get("/test", (req, res) => {
  printer
    .getDefaultPrinter()
    .then((defaultPrinter) => {
      console.log(defaultPrinter);
    })
    .catch((error) => console.error(error));

  res.send("Working good, See the logs in console for printers");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
