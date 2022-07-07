const NATS = require('nats');
const request = require("request");
const nc = NATS.connect({
    url: 'nats://my-nats:4222'
});

setTimeout(function(){console.log(":)");}, 2000);

nc.subscribe('chat_data', (msg) => {
    console.log("Message recieved!")
    const message = JSON.stringify(JSON.parse(msg));
    postTelegram(message);
});

const botToken = process.env.BOTPASS.toString();

function postTelegram(msg) {
    console.log("Posting to telegram:", msg);
    request.post({
        url:'https://api.telegram.org/bot' + botToken + '/sendMessage',
        method:'POST',
        form: {
            chat_id: '-1001675523202',
            text: msg
        }
        }, function (err, res, body) {
            if (err) {
                console.log(err);
            } else {
                console.log(res.statusCode)
                console.log(body);
            }
        });
}

//postTelegram("Broadcaster started!");

console.log("Saver listening")