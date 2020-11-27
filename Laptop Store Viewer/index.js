const http = require("http");
const fs = require("fs");
const url = require("url");

const laptopData = JSON.parse(
  fs.readFileSync("laptopAPISimulation.txt", "utf-8")
);

const server = http.createServer((req, res) => {
  const path = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;
  if (path === "/" || path === "") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.readFile(`${__dirname}/templates/index.html`, "utf-8", (err, data) => {
      let output = data;
      let cards = "";
      laptopData.forEach((element, id) => {
        fs.readFile(`${__dirname}/templates/laptopCards.html`, "utf-8", (err, data) => {
          let outputPart = replaceData(data, id);
          cards += outputPart;
          if (id == laptopData.length - 1) {
            output = output.replace("{&&CARDS&&}", cards);
            res.end(output);
          }
        });
      });
    });
  } else if (path === "/laptop" && id < laptopData.length) {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.readFile(`${__dirname}/templates/productLaptop.html`, "utf-8", (err, data) => {
      let output = replaceData(data, id);
      res.end(output);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    fs.readFile(`${__dirname}/templates/404.html`, "utf-8", (err, data) => {
      res.end(data);
    });
  }
});
server.listen(5000, "127.0.0.1", () => {
  console.log("Server started at 127.0.0.1:5000");
});

function replaceData(output, id) {
  output = output.replace(/{&&TITLE&&}/g, laptopData[id].name);
  output = output.replace(/{&&CLOCK&&}/g, laptopData[id].processor);
  output = output.replace(/{&&RAM&&}/g, laptopData[id].ram);
  output = output.replace(/{&&DISPLAY&&}/g, laptopData[id].display);
  output = output.replace(/{&&WARRENTY&&}/g, laptopData[id].warrenty);
  output = output.replace(/{&&IMG&&}/g, laptopData[id].img);
  output = output.replace(/{&&ID&&}/g, id);
  return output;
}
