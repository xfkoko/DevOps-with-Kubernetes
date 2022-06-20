const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3002;

const directory = path.join("/", "usr", "src", "app", "files");
const filePath = path.join(directory, "test.txt");

var rotatingstring;

const getString = () => {
    const randomstring = (Math.random() + 1).toString(36).substring(2);
    const date = new Date();
    rotatingstring = date.toString() + " " + randomstring;
    setTimeout(getString, 5000);
}

const server = http.createServer((req, res) => {
    fs.readFile(filePath, (err, content) => {
        if (err) return res.end("Failed to read file");
        res.statusCode == 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(rotatingstring + "\n" + content);
    });
});

getString();
console.log("Server started in port " + port);
server.listen(port);