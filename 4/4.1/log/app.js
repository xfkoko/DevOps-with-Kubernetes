const http = require("http");
const request = require("request");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.static(path.join("./")));

const port = 3002;

var rotatingstring;

const getString = () => {
    const randomstring = (Math.random() + 1).toString(36).substring(2);
    const date = new Date();
    rotatingstring = date.toString() + " " + randomstring;
    setTimeout(getString, 5000);
}

app.get("/", (req, res) => {
    console.log("Home called, making request to db");
    request("http://ping-pong-svc:2346", function (err, response, body) {
        if (err) return res.end("Failed to do something");
        res.statusCode == 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(rotatingstring + "\n" + "Ping / Pongs: " + body);
    });
});

app.get("/click", (req, res) => {
    console.log("Sending PING ...");
    request.post({
        headers: {'content-type' : 'application/x-www-from-urlencoded'},
        url: 'http://ping-pong-svc:2346/add',
        form: {mes: "Hello"}
    }, function (error, response, body){
        if (error) console.log(error);
        if (response) console.log(response);
        res.send(body);
    });
});

app.get("/healthz", (req, res) => {
    console.log("Health check pong connection");
    request("http://ping-pong-svc:2346/healthz", function (err, response, body) {
        if (err) {
            console.log("Health check failed");
            res.status(500);
            res.send("Failed the health check");
        } else {
            console.log("Health check ok");
            res.status(200);
            res.end("Health check ok");
        }
    });
});

getString();
console.log("Server started in port " + port);
app.listen(port, () => console.log("Running on port 3002"));