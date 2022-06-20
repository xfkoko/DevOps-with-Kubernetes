const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3001;

const directory = path.join("/", "usr", "src", "app", "files");
const filePath = path.join(directory, "test.txt");

var pongs = 0;

const server = http.createServer((req, res) => {
    pongs += 1;
    var content = "Ping / Pongs: " + pongs;
    fs.writeFile(filePath, content, err => {
        if (err) {
            console.error(err);
        } else {
            console.log("Something written")
        }
    });
    res.statusCode == 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("pong " + pongs);
});

console.log("Server started in port " + port);
server.listen(port);