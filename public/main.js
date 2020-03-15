window.onload = function() {
    document.getElementById("signoutBtn").addEventListener("click", signoutUser);
    document.getElementById("showRemoveBtn").addEventListener("click", showRemoveBtn);
    document.getElementById("removeBtn").addEventListener("click", removeUser);
    document.getElementById("addTaskBtn").addEventListener("click", addTask)
    requestData();
    requestTasks();
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

function requestTasks() {
    let xhttp = new XMLHttpRequest();

    // ran when server sends response
    xhttp.onreadystatechange = function() {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            let json = JSON.parse(xhttp.responseText);
            //let userInfo = json[0];
            console.log(json);
            formatTasks(json);
        }
    };

    // sends request to server
    let URL = "http://localhost:3000/get_task"
    xhttp.open("GET",URL,true);
    xhttp.setRequestHeader("Content-Type",
    "application/json;charset=UTF-8");
    xhttp.send();
}


function formatTasks(taskJson) {
    taskDiv = document.getElementById("taskDiv");
    taskDiv.innerHTML = "";

    //Creating header tag
    const h3_init = document.createElement("h3");
    h3_init.appendChild(document.createTextNode("Here's what's on your list:"));
    taskDiv.appendChild(h3_init);

    //br tag
    const br1_init = document.createElement("br");
    taskDiv.appendChild(br1_init);
    
    for (i=0; i<taskJson.length; i++) {
        //Building input tag
        const input_init = document.createElement("input");

        var typeAtt = document.createAttribute("type");
        typeAtt.value = "checkbox";
        input_init.setAttributeNode(typeAtt);

        var inputIdAtt = document.createAttribute("id");
        inputIdAtt.value = "task" + i;
        input_init.setAttributeNode(inputIdAtt);

        var inputNameAtt = document.createAttribute("name");
        inputNameAtt.value = JSON.stringify(taskJson[i].task);
        input_init.setAttributeNode(inputNameAtt);

        /*var class1Att = document.createAttribute("class");
        class1Att.value = "custom-control-input";
        input_init.setAttributeNode(class1Att);*/
        taskDiv.appendChild(input_init);

        //Formatting the date
        date = new Date(taskJson[i].due_date);
        formatDate = (date.getMonth()+1) + '-'+date.getDate() + "-" + date.getFullYear();

        //Formatting the time
        var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        var am_pm = date.getHours() >= 12 ? "PM" : "AM";
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        formatTime = hours + ":" + minutes + ":" + seconds + " " + am_pm;
        
        //Building label tag
        const label_init = document.createElement("label");

        var forAtt = document.createAttribute("for");
        forAtt.value = "task" + i;
        label_init.setAttributeNode(forAtt);

        /*var class2Att = document.createAttribute("class");
        class2Att.value = "custom-control-label";
        label_init.setAttributeNode(class2Att);*/

        label_init.appendChild(document.createTextNode(taskJson[i].task + ", due on " + formatDate + " at " + formatTime ));
        taskDiv.appendChild(label_init);

        //br tag
        const br2_init = document.createElement("br");
        taskDiv.appendChild(br2_init);

    }
    //Building submit button for form
    const but_init = document.createElement("input");
    
    var butIdAtt = document.createAttribute("id");
    butIdAtt.value = "completeBtn";
    but_init.setAttributeNode(butIdAtt);
    
    var butClassAtt = document.createAttribute("class");
    butClassAtt.value = "btn btn-outline-info";
    but_init.setAttributeNode(butClassAtt);
    
    var butTypeAtt = document.createAttribute("type");
    butTypeAtt.value = "submit";
    but_init.setAttributeNode(butTypeAtt);
    
    var butValueAtt = document.createAttribute("value");
    butValueAtt.value = "Complete!";
    but_init.setAttributeNode(butValueAtt);
    taskDiv.appendChild(but_init);
}

function validateForm() {

        $.each($("input:checked"), function(){
            console.log($(this).prop("name"));
            
            let taskName = JSON.parse($(this).prop("name"));

            var send_data = {};
                send_data.task = taskName;

            $.ajax({
                url: 'http://localhost:3000/delete_task',
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

        });
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