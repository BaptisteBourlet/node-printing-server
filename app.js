const printer = require("pdf-to-printer");
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json())

app.post("/print", (req, res) => {
  const {
    printerID,
    url,
    fileName,
    printSettings,
    printDescription,
  } = req.body;

  // const options = {
  //   printer: "Samsung M2020 Series (192.168.1.6)",
  //   win32: ['-print-settings "landscape,fit"']
  // };

  let printsetters = '-print-settings ' + '"' + printSettings + '"';

  const options = {
    printer: printerID,
    win32: [printsetters]
  };

  console.log(printDescription);
  console.log('hehe')

  printer
    .print(url + fileName, options)
    .then(console.log)
    .catch(console.error);

  res.send("ok");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
