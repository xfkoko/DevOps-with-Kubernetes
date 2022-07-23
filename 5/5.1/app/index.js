const k8s = require('@kubernetes/client-node');
const express = require('express');
const axios = require("axios").default;

const app = express();

const port = process.env.PORT || 3000;

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const watch = new k8s.Watch(kc);

let defaulturl = "https://example.com/";
let rdata = "Placeholder before anything";

async function geturl(url) {
    console.log("Setting rdata");
    const r = await axios.get(url);
    rdata = r.data;
}

watch.watch('/apis/stable.dwk/v1/dummysites',
    // optional query parameters can go here.
    {
        allowWatchBookmarks: true,
    },
    // callback is called for each received object.
    (type, apiObj, watchObj) => {
        if (type === 'ADDED') {
            console.log('new object:');
            const url = apiObj.spec.website_url;
            if (!url) {
                console.log("No url");
                return;
            }
            console.log("Calling geturl()");
            geturl(url);
        } else if (type === 'MODIFIED') {
            console.log('changed object:');
        } else if (type === 'DELETED') {
            console.log('deleted object:');
        } else if (type === 'BOOKMARK') {
            console.log(`bookmark: ${watchObj.metadata.resourceVersion}`);
        } else {
            console.log('unknown type: ' + type);
        }
        console.log(apiObj);
    },
    (err) => {
        console.log("Error in watch");
        console.log(err);
    })
.then((req) => {
    // watch returns a request object which you can use to abort the watch.
    console.log("Setting timeout for abort");
    setTimeout(() => { req.abort(); }, 100 * 1000);
});

app.get('/', (req, res) => {
    console.log("Home called");
    return res.send(rdata);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })