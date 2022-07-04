const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.static(path.join("./")));

const { Client } = require('pg');

process.on('uncaughtException', function (err) {
    console.log(err);
});

console.log("Setting up")
const passw = process.env.POSTGRES_PASSWORD.toString()

const qcall = async (query) => {
    console.log("Inside qcall");
    try {
        console.log("Try the query");
        await client.query(query, (err, res) => {
            if (err) {
                console.log("Error from qcall query");
                return false;
            } else {
                return true;
            }
        });
    } catch (e) {
        console.log("error catched in qcall");
        console.log(e.stack);
        return false;
    }
}

const initialize = async () => {
    try {
        console.log("Try to create table")
    
        qcall(`
        CREATE TABLE IF NOT EXISTS "pongs" (
            name VARCHAR(30) NOT NULL,
            count INT NOT NULL,
            PRIMARY KEY (name)
        );`).then(result => {
            console.log("result:", result);
            if (result) {
                console.log("Table created!")
                qcall(`INSERT INTO pongs (name, count) VALUES('pongcount', 0) ON CONFLICT DO NOTHING`).then(result => {
                    if (result) {
                        console.log("DB Initialized")
                    }
                });
            }
        });
    } catch (e) {
        console.log("Client initialization failed");
    }
}
function connecting() {
    var client = new Client({
        host: 'postgres-svc',
        user: 'postgres',
        database: 'postgres',
        password: passw,
        port: 5432,
    });
    try {
        client.connect();
        return client
    } catch (e) {
        console.log("db connect failed");
        console.log(e);
        client.end();
    }
}
var client;
client = connecting();
initialize();
var healthy = false;

app.get("/", (req, res) => {
    console.log("GET / called");
    const q = "SELECT count FROM pongs WHERE name = 'pongcount';";
    client.query(q, (e, r) => {
        if (e) throw e;
        console.log("Count:", r.rows[0].count);
        res.end(String(r.rows[0].count));
        }   
    )
});

app.post("/add", (req, res) => {
    console.log("GET /add called")
    const q = "UPDATE pongs SET count = count + 1 WHERE name = 'pongcount';";
    client.query(q, (e, r) => {
        if (e) throw e;
        console.log("Added one pong.")
        res.end("Success!");
    });
});

app.get("/healthz", (req, res) => {
    if (!healthy) {
        console.log("Health check called");
        client = connecting();
        client.query(`
        CREATE TABLE IF NOT EXISTS "pongs" (
            name VARCHAR(30) NOT NULL,
            count INT NOT NULL,
            PRIMARY KEY (name)
        );`, (e, r) => {
            if (e) {
                console.log("Error in health check");
                console.log(e);
                res.status(500);
                res.send("Error in health check");
            } else {
                console.log("Response.command:", r.command);
                console.log("Response.rows[0]:", r.rows[0]);
                console.log("Health check OK, table created");
                qcall(`INSERT INTO pongs (name, count) VALUES('pongcount', 0) ON CONFLICT DO NOTHING`).then(result => {
                    if (result) {
                        console.log("DB Initialized")
                        res.status(200);
                        res.send("Health check OK");
                        healthy = true;
                    } else {
                        console.log("Insert not done or failed");
                        res.status(200);
                        res.send("Health check OK??");
                        healthy = true;
                    }
                });
            }
        });
    } else {
        // Now when it passes once it will always check as healthy...
        res.status(200);
        console.log("Health check OK, didn't create new client");
        res.send("Health check OK")
    }
});

app.listen(3003, () => console.log("db running on port 3003"));