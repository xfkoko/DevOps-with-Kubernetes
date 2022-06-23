const geturl = "http://localhost:8081/todos"
const posturl = "http://localhost:8081/todo"

function postTodo() {
    event.preventDefault();
    var inputStr = this.inputItem.value;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function() {
        getTodos();
    }
    xmlHttp.open("POST", posturl);
    xmlHttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xmlHttp.send(JSON.stringify({"value": inputStr}));
    getTodos();
}

function getTodos() {
    event.preventDefault();
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == XMLHttpRequest.DONE) {
            var todos = xmlHttp.responseText.slice(1, -1);
            var todosArray = todos.split(',');
            var list = document.getElementById("list");
            list.innerHTML = "";
            todosArray.forEach( function (item, index) {
                var listItem = document.createElement("li");
                listItem.innerText = item.slice(1, -1);
                list.appendChild(listItem);
            });
        }
    }
    xmlHttp.open("GET", geturl, true);
    xmlHttp.send("");
}