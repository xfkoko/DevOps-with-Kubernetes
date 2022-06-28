const express = require('express');
const app = express();
var path = require('path');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});

var cors = require('cors')
app.use(express.json());
app.use(cors());
app.use(express.static(path.join("./")));

const port = 3001;

const { Client } = require('pg');

const passw = process.env.POSTGRES_PASSWORD.toString()

const client = new Client({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    database: process.env.DBDB,
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
    console.log(query);
    try {
        await client.query(query);
        return true;
    } catch (e) {
        console.log(e.stack);
        return false;
    }
}

execute(`
    CREATE TABLE IF NOT EXISTS todos (
        content VARCHAR(200)
    );`).then(result => {
    if (result) {
        console.log("Table created!")
        qcall(`INSERT INTO todos (content) VALUES('TODO 1') ON CONFLICT DO NOTHING;`).then(result => {
            if (result) {
                console.log("DB Initialized")
            }
        });
    }
});

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

app.post("/todo", jsonParser, (req, res) => {
    if (String(req.body.value).length > 140) {
        console.log("Todo too long! (max 140 char)");
        res.end("Todo too long!");
    } else {
        console.log(req.body.value, "to be added");
        qcall(`INSERT INTO todos (content) VALUES(` + `'` + req.body.value + `'` + `) ON CONFLICT DO NOTHING;`).then(result => {
            if (result) {
                console.log("Added")
            }
        });
        res.end("Added");
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})