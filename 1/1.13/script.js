window.onload = function() {
    document.getElementById('form1').onsubmit = function() {
        console.log("!!!");
        var list = document.getElementById(this.getAttribute('data-list')); // only needed if more than one form or list
        var listItem = document.createElement("li");
        var inputItem = this.inputItem;
        listItem.innerText = inputItem.value;
        list.appendChild(listItem);
        inputItem.select();
        inputItem.focus();
        return false; // stop submission
    }
    document.getElementById("inputItem").focus();
  }