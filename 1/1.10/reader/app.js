const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;

const directory = path.join("/", "usr", "src", "app", "files");
const filePath = path.join(directory, "test.txt");

const server = http.createServer((req, res) => {
    fs.readFile(filePath, (err, content) => {
        if (err) return console.log("Failed to read file", "--------", err);
        res.statusCode == 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(content);
    });
});

console.log("Server started in port " + port);
server.listen(port);