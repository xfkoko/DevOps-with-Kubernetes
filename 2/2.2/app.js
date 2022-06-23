const express = require('express');
const app = express();
var request = require("request");
const fs = require("fs");
const path = require("path");
var cors = require('cors')
app.use(cors())

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })