const express = require('express');
const app = express();
var path = require('path');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});

process.on('uncaughtException', function (err) {
    console.log(err);
});

var cors = require('cors')
app.use(express.json());
app.use(cors());
app.use(express.static(path.join("./")));

const port = 3001;

const { Client } = require('pg');

const passw = process.env.POSTGRES_PASSWORD.toString()

const qcall = async (query) => {
    console.log(query);
    try {
        await client.query(query, (err, res) => {
            if (err) {
                console.log("Error from qcall query");
                return false;
            } else {
                return true;
            }
        });
    } catch (e) {
        console.log(e.stack);
        return false;
    }
}

const initialize = async () => {
    try {
        console.log("Try to create table")
    
        qcall(`
        CREATE TABLE IF NOT EXISTS todos (
            content VARCHAR(200)
        );`).then(result => {
            console.log("result:", result);
            if (result) {
                console.log("Table created!")
                qcall(`INSERT INTO todos (content) VALUES('TODO 1') ON CONFLICT DO NOTHING;`).then(result => {
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
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        database: process.env.DBDB,
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

app.get('/', (req, res) => {
  res.end("Backend");
})

app.get('/back', (req, res) => {
  res.end("Backend!!");
})

app.get('/todos', (req, res) => {
  console.log("DB fetch for all todos called")
  const q = "SELECT content FROM todos;";
  client.query(q, (e, r) => {
      if (e) throw e;
      var todosArray = r.rows;
      var finalTodos = [];
      todosArray.forEach(function (item, index) {
        finalTodos.push(item.content);
      })
      res.send(finalTodos);
      }   
  );
})

app.get("/healthz", (req, res) => {
    if (!healthy) {
        console.log("Health check called");
        client = connecting();
        client.query(`
        CREATE TABLE IF NOT EXISTS todos (
            content VARCHAR(200),
            done NUMBER(1)
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
                qcall(`INSERT INTO todos (content, done) VALUES('TODO 1', 0) ON CONFLICT DO NOTHING;`).then(result => {
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


app.post("/todo", jsonParser, (req, res) => {
    if (String(req.body.value).length > 140) {
        console.log("Todo too long! (max 140 char)");
        res.end("Todo too long!");
    } else {
        console.log(req.body.value, "to be added");
        qcall(`INSERT INTO todos (content, done) VALUES(` + `'` + req.body.value + `', 0` + `) ON CONFLICT DO NOTHING;`).then(result => {
            if (result) {
                console.log("Added")
            }
        });
        res.end("Added");
    }
})

app.put("/todos/*", (req, res) => {
    var id = req.url.slice(7);
    console.log("put id:", id);
    qcall(`UPDATE todos SET done = 1 WHERE content=` + id).then( result => {
        if (result) {
            console.log("result = true: UPDATE ok");
            res.status(200);
            res.send("UPDATE OK");
        } else {
            console.log("result = false: UPDATE not ok");
            res.status(500);
            res.send("UPDATE not OK");
        }
    });

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})