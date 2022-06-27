const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.static(path.join("./")));

const { Client } = require('pg');

const passw = process.env.POSTGRES_PASSWORD.toString()

const client = new Client({
    host: 'postgres-svc',
    user: 'postgres',
    database: 'postgres',
    password: passw,
    port: 5432,
});

const execute = async (query) => {
    try {
        await client.connect();
        await client.query(query);
        return true;
    } catch (e) {
        console.log(e.stack);
        return false;
    }
}

const qcall = async (query) => {
    try {
        await client.query(query);
        return true;
    } catch (e) {
        console.log(e.stack);
        return false;
    }
}

execute(`
    CREATE TABLE IF NOT EXISTS "pongs" (
        name VARCHAR(30) NOT NULL,
        count INT NOT NULL,
        PRIMARY KEY (name)
    );`).then(result => {
    if (result) {
        console.log("Table created!")
        qcall(`INSERT INTO pongs (name, count) VALUES('pongcount', 0) ON CONFLICT DO NOTHING`).then(result => {
            if (result) {
                console.log("DB Initialized")
            }
        })
    }
});

app.get("/", (req, res) => {
    const q = "SELECT count FROM pongs WHERE name = 'pongcount';";
    client.query(q, (e, r) => {
        if (e) throw e;
        console.log("Count:", r.rows[0].count);
        res.end(String(r.rows[0].count));
        }   
    )
});

app.post("/add", (req, res) => {
    const q = "UPDATE pongs SET count = count + 1 WHERE name = 'pongcount';";
    client.query(q, (e, r) => {
        if (e) throw e;
        console.log("Added one pong.")
        res.end("Success!");
    });
});

app.listen(3003, () => console.log("db running on port 3003"));