window.onload = function() {
    document.getElementById("signoutBtn").addEventListener("click", signoutUser);
    document.getElementById("showRemoveBtn").addEventListener("click", showRemoveBtn);
    document.getElementById("removeBtn").addEventListener("click", removeUser);
    document.getElementById("addTaskBtn").addEventListener("click", addTask)
    requestData();
}

function addTask() {
    var task = document.getElementById("task").value;
    var dueDate = document.getElementById("dueDate").value
    var priority = document.getElementById("priority").value;
    var taskErrors = document.getElementById("taskErrors");
    taskErrors.innerHTML = "";

    var taskErrors = document.getElementById("taskErrors");
    if (task.length < 1) {
        taskErrors.innerHTML = "Enter a task or your account will be deleted";
    }

    dueDate = dueDate.replace("T", " ")
    dueDate += ":00";

    priority = parseInt(priority);

    var send_data = {};
    send_data.task = task;
    send_data.dueDate = dueDate;
    send_data.priority = priority;

    $.ajax({
        url: 'http://localhost:3000/add_task',
        type: 'POST',
        data: send_data,
        success: function(msg){
            console.log(JSON.stringify(send_data));
            window.location.href = "http://localhost:3000/";
        },
        error: function(jqXHR,status,err){
            console.log(status);
            console.log(err);
        }
    });
}

function signoutUser(event) {
    $.ajax({
        url: 'http://localhost:3000/signout',
        type: 'GET',
        success: function(resp,msg){
            console.log("user successfully logged out");
            window.location.href = "http://localhost:3000/";
        },
        error: function(jqXHR,status,err){
            console.log(status);
            console.log(err);
        }
    });
}

function requestData() {
    let xhttp = new XMLHttpRequest();

    // ran when server sends response
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            let json = JSON.parse(xhttp.responseText);
            let userInfo = json[0];
            console.log(userInfo);
            formatUserInfo(userInfo);
        }
    };

    // sends request to server
    let URL = "http://localhost:3000/get_user_info"
    xhttp.open("GET",URL,true);
    xhttp.setRequestHeader("Content-Type",
    "application/json;charset=UTF-8");
    xhttp.send();
}

function formatUserInfo(userInfo) {
    text = document.getElementById("userInfo");
    text.innerHTML = "Welcome, " + userInfo.first_name;
}

function showRemoveBtn(event) {
    document.getElementById("removeUser").style.display = "block";
}

function removeUser(event) {
    var send_data = {};
    send_data.email = document.getElementById("email").value;
    console.log(send_data.email)

    $.ajax({
        url: 'http://localhost:3000/remove_db',
        type: 'POST',
        data: send_data,
        success: function(msg){
            console.log(JSON.stringify(send_data));
            window.location.href = "http://localhost:3000/";
        },
        error: function(jqXHR,status,err){
            document.getElementById("removalError").innerHTML = "That is not your email";
            console.log(status);
            console.log(err);
        }
    });
}