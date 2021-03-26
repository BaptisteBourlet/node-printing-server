const printer = require("pdf-to-printer");
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/print", (req, res) => {
  const {
    printerID,
    url,
    fileName,
    printSettings,
    printDescription,
  } = req.body;
  
  let printOptions = "-print-settings " + '"' + printSettings + '"';

  // const options = {
  //   printer: "Samsung M2020 Series (192.168.1.6)",
  //   win32: ['-print-settings "landscape,fit"']
  // };

  const options = {
    printer: printerID,
    win32: [printOptions],
  };

  console.log(printDescription);

  printer
    .print(url + fileName, options)
    .then(res.send(`success, ${fileName} is being printed by ${printerID}`))
    .catch(res.send("Error, please see logs!"));
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
