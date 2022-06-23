const http = require("http");
const request = require("request");
const path = require("path");

const port = 3002;

var rotatingstring;

const getString = () => {
    const randomstring = (Math.random() + 1).toString(36).substring(2);
    const date = new Date();
    rotatingstring = date.toString() + " " + randomstring;
    setTimeout(getString, 5000);
}

const server = http.createServer((req, res) => {
    request("http://pong-svc.ping-pong-namespace:80", function (err, response, body) {
        if (err) return res.end("Failed to do something");
        res.statusCode == 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(rotatingstring + "\n" + body);
    });
});

getString();
console.log("Server started in port " + port);
server.listen(port);