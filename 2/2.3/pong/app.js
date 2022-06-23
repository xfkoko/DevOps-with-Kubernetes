const http = require("http");
const path = require("path");

const port = 3001;

var pongs = 0;

const server = http.createServer((req, res) => {
    pongs += 1;
    var content = "Ping / Pongs: " + pongs;
    res.statusCode == 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(content);
});

console.log("Server started in port " + port);
server.listen(port);