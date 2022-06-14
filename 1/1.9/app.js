const http = require("http");

const port = process.env.PORT || 3000;

var pongs = 0;

const server = http.createServer((req, res) => {
    pongs += 1;
    res.statusCode == 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("pong " + pongs);
});

console.log("Server started in port " + port);
server.listen(port);