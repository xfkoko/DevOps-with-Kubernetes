const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3001;

var content;

const directory = path.join("/", "usr", "src", "app", "files");
const filePath = path.join(directory, "test.txt");

const writeString = () => {
    const randomstring = (Math.random() + 1).toString(36).substring(2);
    const date = new Date();
    content = date.toString() + " " + randomstring;
    fs.writeFile(filePath, content, err => {
        if (err) {
            console.error(err);
        }
    });
    setTimeout(writeString, 5000);
}

const server = http.createServer((req, res) => {
    res.statusCode == 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Writer");
});


writeString();
console.log("Server started in port " + port);
server.listen(port);