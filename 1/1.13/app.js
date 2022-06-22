const http = require("http");
var request = require("request");
const fs = require("fs");
const path = require("path");

const port = 3002;

//const directory = path.join("/", "usr", "src", "app", "files");
const directory = path.join(".");
const filePath = path.join(directory, "date.txt");
const imagePath = path.join(directory, "image.png");

function downloadImage() {
    var url = "https://picsum.photos/250";
    request.head(url, function(err, res, body) {
        request(url).pipe(fs.createWriteStream(imagePath)).on("close", function(){console.log("Image req done.")});
    });
}

function dateMaker(oldDate) {
    var newDate = new Date();
    var month = newDate.getUTCMonth() + 1;
    var day = newDate.getUTCDate();
    var year = newDate.getUTCFullYear();
    finalDate = day + "/" + month + "/" + year;
    return finalDate;
}

const server = http.createServer((req, res) => {
    const url = req.url;
    if (url == "/img") {
        res.statusCode == 200;
        res.setHeader("Content-Type", "image/png");
        var img = fs.readFileSync(imagePath);
        res.end(img, "binary");
    } 
    else {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                return res.end("Failed to read file");
            }
            var currentDate = dateMaker(new Date());
            if (content == currentDate) {
                res.statusCode == 200;
                res.setHeader("Content-Type", "text/html");
                var html = fs.readFileSync('./index.html');
                res.end(html);
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
                html = fs.readFileSync('./index.html');
                res.end(html);
            }
        });
    }
    
});

console.log("Server started in port " + port);
server.listen(port);