window.onload = function() {
    document.getElementById("signoutBtn").addEventListener("click", signoutUser);
    document.getElementById("showRemoveBtn").addEventListener("click", showRemoveBtn);
    document.getElementById("removeBtn").addEventListener("click", removeUser);
    document.getElementById("addTaskBtn").addEventListener("click", addTask);
    requestData();
    requestTasks();
    if (sessionStorage.hist == null) {
        getHistoryML();
    }
    else{
        console.log(sessionStorage.hist);
        displayHistory(sessionStorage.hist);
    }
};

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
    sessionStorage.removeItem('hist');
    getHistoryML();
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
            //formatTasks(json);
            //call for vivek's alternative display
            alternative(json);
            //interval that updates timer.
            setInterval(updateTimer.bind(null,json),5000);
        }
    };

    // sends request to server
    let URL = "http://localhost:3000/get_task"
    xhttp.open("GET",URL,true);
    xhttp.setRequestHeader("Content-Type",
    "application/json;charset=UTF-8");
    xhttp.send();
}

//produces output that can be used in the timer
function produceTimer(dueDate){
    //return - [distance,days,hours,minutes,seconds]
    var dueTime = dueDate.getTime();
    var nowTime = new Date().getTime();

    //check if the due date < curr Date
    var distance = dueTime - nowTime;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    return [distance,days,hours,minutes];
}

//alternative display method with timer for tasks
function alternative(taskJson){
    //var taskDiv = document.getElementById("alternative_tasks");
    var taskDiv = document.getElementById("taskDiv");

    const h3_tag = document.createElement("h3");
    h3_tag.appendChild(document.createTextNode("Here's what's on your list:"));
    taskDiv.appendChild(h3_tag);

    const br1_init = document.createElement("br");
    taskDiv.appendChild(br1_init);
    const br2_init = document.createElement("br");
    taskDiv.appendChild(br2_init);

    const display_table = document.createElement("table");
    const header_row = display_table.insertRow(0);

    const cell1 = header_row.insertCell(0); //completed check_box
    const cell2 = header_row.insertCell(1); //task
    const cell3 = header_row.insertCell(2); //priority
    const cell4 = header_row.insertCell(3); //due_date
    const cell5 = header_row.insertCell(4); //time
    const cell6 = header_row.insertCell(5); //timer

    cell1.innerHTML = "<b>Completed</b>";
    cell2.innerHTML = "<b>Task</b>";
    cell3.innerHTML = "<b>Priority</b>";
    cell4.innerHTML = "<b>Due Date</b>";
    cell5.innerHTML = "<b>Due Time</b>";
    cell6.innerHTML = "<b>Timer</b>";

    var row = 1;
    var td_count;
    var data_row,dc;
    for (i=0;i<taskJson.length;i++){
        td_count = 0;
        data_row = display_table.insertRow(row);
        while(td_count<6){
            dc = data_row.insertCell(td_count);
            if (td_count==0){
                var id_val = "check_input"+i;                               //id is check_input instead of task
                dc.innerHTML = "<input type='checkbox' id='"+ id_val +"' name='"+ taskJson[i].task +"'>";
            }
            else if(td_count==1){
                dc.innerHTML = taskJson[i].task;
            }
            else if(td_count==2){
                dc.innerHTML = taskJson[i].priority;
            }
            else if(td_count==3){
                date = new Date(taskJson[i].due_date);
                formatDate = (date.getMonth()+1) + '-' + date.getDate() + "-" + date.getFullYear();
                dc.innerHTML = formatDate;
                //var date_time_list = taskJson[i].due_date.split("T");
                //dc.innerHTML = date_time_list[0];
            }
            else if(td_count==4){
                var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
                var am_pm = date.getHours() >= 12 ? "PM" : "AM";
                hours = hours < 10 ? "0" + hours : hours;
                var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                formatTime = hours + ":" + minutes + ":" + seconds + " " + am_pm;
                dc.innerHTML = formatTime;
                //var date_time_list1 = taskJson[i].due_date.split("T");
                //dc.innerHTML = date_time_list1[1];
            }
            else if(td_count==5){
                var timer_id = "timer"+i;
                console.log(timer_id);
                dc.innerHTML = "<p id='"+timer_id+"'>";
            }
            td_count++;
        }
        row++;
        taskDiv.appendChild(display_table);
        taskDiv.appendChild(br1_init);
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

//function to call for timer activation every second
function updateTimer(taskJson){
    var expired = [];
    for (i=0;i<taskJson.length;i++){
        //ignore if the task has expired
        if (expired.includes(i)){
            continue;
        }

        const dueDate = new Date(taskJson[i].due_date);
        var produce = produceTimer(dueDate);
        var timer_id = "timer"+i;

        //if expired
        if (produce[0] < 0){
            expired.push(i);
            document.getElementById(timer_id).innerHTML = "Overdue";
            document.getElementById(timer_id).style.color = "red";
            continue;
        }
        document.getElementById(timer_id).innerHTML = produce[1].toString() + "d " + produce[2].toString() + "h "+ produce[3].toString() + "m";
        if (produce[1]>3){
            document.getElementById(timer_id).style.color = "green";
        }
        else if (produce[1]<3 && produce[1]>1){
            document.getElementById(timer_id).style.color = "orange";
        }
        else if (produce[1] < 1){
            document.getElementById(timer_id).style.color = "red";
        }
    }
}

function formatTasks(taskJson) {
    /*taskDiv = document.getElementById("taskDiv");
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
        input_init.setAttributeNode(inputNameAtt);  //inputNameAtt.value = JSON.stringify(taskJson[i]);

        //var class1Att = document.createAttribute("class");
        //class1Att.value = "custom-control-input";
        //input_init.setAttributeNode(class1Att);
        taskDiv.appendChild(input_init);

        //Formatting the date
        date = new Date(taskJson[i].due_date);

        formatDate = (date.getMonth()+1) + '-' + date.getDate() + "-" + date.getFullYear();


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

        //var class2Att = document.createAttribute("class");
        //class2Att.value = "custom-control-label";
        //label_init.setAttributeNode(class2Att);

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
*/
}

function alternativeValidation() {
    var rows = document.getElementsByTagName('tr');
    
    for(var i=0;i<rows.length;i++) {
        var checkbox=rows[i].getElementsByTagName("input");  

        for (j=0; j < checkbox.length; j++) {

            if (checkbox[j].checked) {
                taskName = checkbox[j].name;
                console.log("Remove " + taskName);

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
            }
        }

    }
}

function validateForm() {

        $.each($("input:checked"), function(){
            console.log($(this).prop("name"));
            console.log("here");
            
            let taskName = JSON.parse($(this).prop("name"));

            var send_data = {};
                send_data.task = taskName;  //.task;

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
    console.log(send_data.email);

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

//a function that triggers machine learning algorithm in the backend only when cache is empty or a new task is added.
async function getHistoryML(){
    await $.ajax({
        url: 'http://localhost:3000/get_custom_recommendations',
        type: 'GET',
        success: async function(resp,msg){
            await resp;
            sessionStorage.setItem("hist",JSON.stringify(resp));
            if (sessionStorage.hist){
                location.reload();
                //console.log(sessionStorage.hist);
            }

        },
        error: function(jqXHR,status,err){
            console.log(status);
            console.log(err);
        }
    });
}

//a function that displays the history
function displayHistory(histObject){
    //sort data by maximum and displaying top 10
    const histArray = JSON.parse(histObject);
    console.log(histArray);
    histArray.sort(function(a,b){
        return b.similarity-a.similarity;
    });
    var historyDiv = document.getElementById("history_div");
    historyDiv.style.visibility = "visible";
    var display_table = document.createElement("TABLE");
    var header_row = display_table.insertRow(0);

    //populate the first row
    var cell1 = header_row.insertCell(0);
    var cell2 = header_row.insertCell(1);
    var cell3 = header_row.insertCell(2);

    cell1.innerHTML = "<b>Recommended Task</b>";
    cell2.innerHTML = "<b>Base Task</b>";
    cell3.innerHTML = "<b>Similarity (%)</b>";

    //display top 10 similar tasks
    var i = 0;
    var row = 1;
    var td_count;
    var data_row,dc;
    while(i<10){
        td_count = 0;
        data_row = display_table.insertRow(row);
        while(td_count<3){
            dc = data_row.insertCell(td_count);
            if (td_count == 0){
                //recommended
                dc.innerHTML = histArray[i].recommended_task;
            }
            else if (td_count == 1){
                //user task
                dc.innerHTML = histArray[i].user_task;
            }
            else if (td_count == 2){
                //similarity
                dc.innerHTML = histArray[i].similarity;
            }
            td_count++;
            continue;
        }
        i++;
        row++;
    }
    historyDiv.appendChild(display_table);
}


