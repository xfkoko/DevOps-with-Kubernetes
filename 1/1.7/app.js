const http = require("http");

const port = process.env.PORT || 3000;

var rotatingstring;

const getString = () => {
    const randomstring = (Math.random() + 1).toString(36).substring(2);
    const date = new Date();
    rotatingstring = date.toString() + " " + randomstring;
    setTimeout(getString, 5000);
}

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url === "/status") {
        res.statusCode == 200;
        res.setHeader("Content-Type", "text/plain");
        res.end(rotatingstring);
    } else {
        res.statusCode == 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("Hello world");
    } 
});

getString();
console.log("Server started in port " + port);
server.listen(port);