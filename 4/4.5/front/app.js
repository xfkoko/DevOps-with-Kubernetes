const express = require('express');
const app = express();
var request = require("request");
const fs = require("fs");
const path = require("path");
var cors = require('cors');
app.use(cors());
app.use(express.json());
const port = 3002;

//const directory = path.join("/", "usr", "src", "app", "files");
const directory = path.join(".");
app.use(express.static(directory));
const filePath = path.join(directory, "date.txt");
const imagePath = path.join(directory, "image.png");

var htmlpage = path.join(__dirname, 'home.html')

function downloadImage() {
    var url = "https://picsum.photos/250";
    request.head(url, function(err, res, body) {
        request(url).pipe(fs.createWriteStream(imagePath)).on("close", function(){console.log("Image req done.")});
    });
}

function dateMaker() {
    var newDate = new Date();
    var month = newDate.getUTCMonth() + 1;
    var day = newDate.getUTCDate();
    var year = newDate.getUTCFullYear();
    finalDate = day + "/" + month + "/" + year;
    return finalDate;
}

app.get('/', (req, res) => {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            return res.end("Failed to read file");
        }
        var currentDate = dateMaker();
        if (content == currentDate) {
            res.statusCode == 200;
            res.setHeader("Content-Type", "text/html");
            res.sendFile(htmlpage);
        } else {
            fs.writeFile(filePath, currentDate, err => {
                if (err) {
                    console.error(err);
                } else {
                    console.log("Something written to date file")
                }
            });
            downloadImage();
            res.statusCode == 200;
            res.setHeader("Content-Type", "text/html");
            res.sendFile(htmlpage);
        }
    });
})

app.get('/img', (req, res) => {
    res.statusCode == 200;
    res.setHeader("Content-Type", "image/png");
    var img = fs.readFileSync(imagePath);
    res.end(img, "binary");
})

app.get('/gettodos', (req, res) => {
    console.log("Getting todos");
    request("http://ping-pong-svc:2346/todos", function (err, response, body) {
        if (err) {
            console.log("Failed to do something")
            return res.end("Failed to do something");
        }
        res.statusCode == 200;
        res.setHeader("Content-Type", "text/plain");
        res.send({body});
    });
});

app.get("/healthz", (req, res) => {
    console.log("Health check pong connection");
    request("http://ping-pong-svc:2346/healthz", function (err, response, body) {
        if (err) {
            console.log("Health check failed");
            console.log(err);
            res.status(500);
            res.send("Failed the health check");
        } else {
            console.log("Health check ok");
            res.status(200);
            res.end("Health check ok");
        }
    });
});

app.get("/putdone/*", (req, res) => {
    var id = req.url.slice(9);
    console.log("putdone id:", id);
    request.put("http://ping-pong-svc:2346/todos/" + id, function (err, response, body) {
        if (err) {
            console.log("Error happened");
            console.log(err);
            res.status(500);
            res.send("Failed to putdone");
        } else {
            console.log("No error");
            if (response.statusCode == 200) {
                console.log("UPDATE OK");
                res.status(500);
                res.send("UPDATE OK");
            } else {
                console.log("UPDATE not OK");
                res.status(500);
                res.send("UPDATE not OK");
            }
        }
    });
});

app.post('/posttodo', (req, res) => {
    console.log("Posting todo");
    console.log("Todo: ", req.body.value);
    request.post({
        headers: {'Content-Type' : 'application/json'},
        url: 'http://ping-pong-svc:2346/todo',
        body: JSON.stringify({value: req.body.value})
    });
    console.log("Post should be done now")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })