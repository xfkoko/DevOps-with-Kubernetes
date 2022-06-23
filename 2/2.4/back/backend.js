const express = require('express');
const app = express();
var path = require('path');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
const dir = path.join("./");
app.use(express.static(dir));
var cors = require('cors')
app.use(cors())

const port = 3001;

var todoList = {
  todos: ["TODO 1", "TODO 2", "TODO 3"]
};

app.get('/', (req, res) => {
  res.end("Backend");
})

app.get('/back', (req, res) => {
  res.end("Backend!!");
})

app.get('/todos', (req, res) => {
    res.send(todoList.todos);
})

app.post("/todo", jsonParser, (req, res) => {
  console.log(req.body.value, "to be added");
  todoList.todos.push(req.body.value);
  res.end("Added");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})