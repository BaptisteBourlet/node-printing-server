const printer = require("pdf-to-printer");
const express = require("express");
const randomId = require("random-id");
const cors = require("cors");
const app = express();
const PORT = 3000;
const LENGTH = 7;
const pattern = "aA0";

app.use(express.json());
app.use(cors());

app.post("/print", (req, res) => {
  let printOptions, options, jobID, logObject;

  const {
    printerID,
    path,
    fileName,
    printSettings, //see params.txt
    printDescription,
  } = req.body;

  printOptions = "-print-settings " + '"' + printSettings + '"';
  jobID = randomId(LENGTH, pattern);
  options = {
    printer: printerID,
    win32: [printOptions],
  };

  console.log(printerID, path, fileName, printOptions, printDescription);

  printer
    .print(path + fileName, options)
    .then(
      res.send(
        `success, ${fileName} is being printed by ${printerID} with ID: ${jobID}`
      )
    )
    .catch(res.send("Error, please see logs!"));
});

app.get("/test", (req, res) => {
  res.send("testing");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
