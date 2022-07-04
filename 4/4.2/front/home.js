async function postTodo() {
    event.preventDefault();
    var inputStr = String(this.inputItem.value);
    fetch('posttodo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({value: inputStr})
    }).then(getTodos());
}

async function getTodos() {
    event.preventDefault();
    fetch('/gettodos', {
        method: 'GET',
        mode: 'no-cors'
    }).then(response => response.json())
    .then(data => {
        var todosArray = String(data.body).slice(1,-1).split(",");
        var list = document.getElementById("list");
        list.innerHTML = "";
        todosArray.forEach( function (item, index) {
            var listItem = document.createElement("li");
            listItem.innerText = item.slice(1, -1);
            list.appendChild(listItem);
        });
    });
}