window.onload = function() {
    document.getElementById("signoutBtn").addEventListener("click", signoutUser);
    document.getElementById("showRemoveBtn").addEventListener("click", showRemoveBtn);
    document.getElementById("removeBtn").addEventListener("click", removeUser);
    document.getElementById("addTaskBtn").addEventListener("click", addTask);
    document.getElementById("saveChanges").addEventListener("click", updateTask);       //Listener for modal 'Save Changes' button

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
    
    //Check info returns true if task is not empty and due date was entered and has not passed
    //taskErrors is the id for add task error field
    if (checkInfo(task, dueDate, "taskErrors") === true) {          

        console.log(dueDate)
        dueDate = dueDate.replace("T", " ")
        dueDate += ":00";
        console.log(dueDate)

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
}

//Takes task name, due date, and the id of the error field
function checkInfo(taskName, dueDate, errFieldID) {
    taskNameGood = true;
    dueDateGood = true;

    //Locates error field
    var errList = document.getElementById(errFieldID);
    errList.style.display = "none";

    //Remove any pre-existing errors
    while (errList.hasChildNodes()) {
		errList.removeChild(errList.firstChild)
	}
	
	newUl = document.createElement("ul");
	errList.appendChild(newUl);

    //Error: Task was not entered
    if (taskName.length < 1) {
        taskNameGood = false;
        newLi = document.createElement("li");
		newLi.appendChild(document.createTextNode("Task field left empty"));
        newUl.appendChild(newLi);
    }
    
    var inputDate = new Date(dueDate)
    var today = new Date();

    //Error: Due date was not entered
    if (dueDate === "") {
        dueDateGood = false;
        newLi = document.createElement("li");
		newLi.appendChild(document.createTextNode("Due date invalid"));
        newUl.appendChild(newLi);
    }

    //Error: Due date has passed
    if (inputDate.getTime() < today.getTime()) {
        dueDateGood = false;
        newLi = document.createElement("li");
		newLi.appendChild(document.createTextNode("Due date has passed"));
        newUl.appendChild(newLi);
    }

    //If everything is good, return true
    //Else, make the error list visible and return false
    if ((taskNameGood == true) && (dueDateGood == true)) {
        return true;
    } else {
        errList.style.display = "block";
        return false;
    }
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
            
            //Checkbox
            //Note: name attr hold entire JSON structure for parsing in later functions
            if (td_count==0){
                var id_val = "check_input"+i;                               
                dc.innerHTML = "<input type='checkbox' id='"+ id_val +"' name='"+ JSON.stringify(taskJson[i]) +"'>";
            }

            //Task name
            else if(td_count==1){
                dc.innerHTML = taskJson[i].task;
            }
            
            //Priority
            else if(td_count==2){
                num = taskJson[i].priority;
                if (num === 1) {
                    dc.innerHTML = '<b style="color:#17a2b7">!!!</b>';
                }
                else if (num === 2) {
                    dc.innerHTML = '<b style="color:#17a2b7">!!</b>';
                }
                else {
                    dc.innerHTML = '<b style="color:#17a2b7">!</b>';
                }
                //dc.innerHTML = taskJson[i].priority;
            }
            
            //Formats date as: MM-DD-YYYY
            else if(td_count==3){
                date = new Date(taskJson[i].due_date);
                formatDate = (date.getMonth()+1) + '-' + date.getDate() + "-" + date.getFullYear();
                dc.innerHTML = formatDate;
                //var date_time_list = taskJson[i].due_date.split("T");     //Vivek: this is old, just left in case you want it
                //dc.innerHTML = date_time_list[0];
            }

            //Formats time
            else if(td_count==4){
                var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
                var am_pm = date.getHours() >= 12 ? "PM" : "AM";
                hours = hours < 10 ? "0" + hours : hours;
                var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                formatTime = hours + ":" + minutes + ":" + seconds + " " + am_pm;
                dc.innerHTML = formatTime;
                //var date_time_list1 = taskJson[i].due_date.split("T");    //Also old
                //dc.innerHTML = date_time_list1[1];
            }

            //Timer
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
    //Complete! form submission button
    //Triggers alternativeValidation() function
    var completeBtn = document.createElement('input');
    completeBtn.innerHTML = '<input id="completeBtn" class="btn btn-outline-info" type="submit" value="Complete!">'

    while(completeBtn.firstChild) {
        taskDiv.appendChild(completeBtn.firstChild);
    }

    //Edit button
    //Makes modal appear. Only here because it makes sense for the complete and edit buttons to be side by side
    var editBtn = document.createElement('button');
    editBtn.innerHTML = '<button type="button" id="modalBtn" style="margin-left:5px" class="btn btn-outline-info" data-toggle="modal" data-target="#myModal">Edit</button>'

    while(editBtn.firstChild) {
        taskDiv.appendChild(editBtn.firstChild);
    }
    
    //Needed so Edit button doesn't trigger form validation func 
    $form = $('#modalBtn');

    $form.click('submit', function(event){              
        event.preventDefault();
        modalHander()
    });
    
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
        if (produce[1]>=3){
            document.getElementById(timer_id).style.color = "green";
        }
        else if (produce[1]<3 && produce[1]>=1){
            document.getElementById(timer_id).style.color = "orange";
        }
        else if (produce[1] < 1){
            document.getElementById(timer_id).style.color = "red";
        }

    }
}

function modalHander() {
    
    var rows = document.getElementsByTagName('tr');
    onlyOne = false;

    for(var i=0;i<rows.length;i++) {
        var checkbox=rows[i].getElementsByTagName("input");  

        //For every input tag found in the tr, 
        for (j=0; j < checkbox.length; j++) {

            if (checkbox[j].checked) {

                if (onlyOne === true) {
                    console.log("Can only edit one task at a time");
                    break;
                }

                //Otherwise, the first checkbox has been found
                onlyOne = true;

                if (checkbox[j].checked) {
                    fullTask = JSON.parse(checkbox[j].name);
                    
                    //Preset text value to task name
                    document.getElementById("modalTask").value = fullTask.task;
                    
                    //Preset date to due_date
                    //Need to reformat date from YYYY-MM-DDTHH:MM:SS.000Z to YYYY-MM-DDTHH:MM
                    //Keep in mind, dates are stored according to UTC time (so 4 hours ahead)
                    date = new Date(fullTask.due_date);
                    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
                    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
                    hours = hours < 10 ? "0" + hours : hours;
                    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                    formatTime = hours + ":" + minutes;
                    
                    sp = fullTask.due_date.split("T");
                    formatDate = sp[0] + "T" + formatTime;
                    document.getElementById("modalDueDate").value = formatDate;
                    
                    document.getElementById("modalPriority").selectedIndex = fullTask.priority - 1;
                    
                }
            }
        }
    }

}

//Click handler for modal Save Changes button
//Sends request to server to update changes user makes
function updateTask() {
    //Fields user changed
    var taskText = document.getElementById("modalTask").value;
    var dueDate = document.getElementById("modalDueDate").value
    var priority = document.getElementById("modalPriority").value;

    //Uses same checkInfo func as addTask
    //When true, request will be sent
    if (checkInfo(taskText, dueDate, "modalErrors") === true) {
    
        dueDate = dueDate.replace("T", " ")
        dueDate += ":00";

        priority = parseInt(priority);

        //Gets a list of every tr in main.html
        var rows = document.getElementsByTagName('tr');
        
        //We're only allowing one task to be edited at a time
        onlyOne = false;

        //For every tr found, look for input tags
        for(var i=0;i<rows.length;i++) {
            var checkbox=rows[i].getElementsByTagName("input");  

            //For every input tag found in a tr, find which are checked
            for (j=0; j < checkbox.length; j++) {
                
                //For a checked box,
                if (checkbox[j].checked) {

                    //If a checked box has already been found, break. We're only allowing one to be edited at a time
                    if (onlyOne === true) {
                        console.log("Can only edit one task at a time");
                        break;
                    }

                    //Otherwise, the first checkbox has been found
                    onlyOne = true;

                    //Remember: when the checkbox input tags are created, the full JSON obj is store in the name attr
                    task = JSON.parse(checkbox[j].name);
                    console.log("Editing " + task.task);

                    //Data to be sent
                    //Includes all old info (parsed from JSON obj) and new stuff from modal fields
                    var send_data = {};
                        send_data.oldTask = task.task;
                        send_data.oldDueDate = task.due_date;
                        send_data.oldPriority = task.priority;
                        send_data.newtask = taskText;
                        send_data.newDueDate = dueDate;
                        send_data.newPriority = priority;
                        console.log(send_data);

                    $.ajax({
                        url: 'http://localhost:3000/edit_task',
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
}    

//Rename?
//Validations form, aka completion of task
function alternativeValidation() {
    //Find every tr tag in main.html
    var rows = document.getElementsByTagName('tr');
    
    //For every tr tag, look for input tags
    for(var i=0;i<rows.length;i++) {
        var checkbox=rows[i].getElementsByTagName("input");  

        //For every input tag found in the tr, 
        for (j=0; j < checkbox.length; j++) {

            //If checkbox is checked, remove the task from the list
            if (checkbox[j].checked) {
                taskName = JSON.parse(checkbox[j].name);
                console.log("Remove " + taskName.task);

                //Data to be sent
                //Only the task name is needed
                var send_data = {};
                    send_data.task = taskName.task;

                //POST request to /delete_task endpoint
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
                //location.reload();
                //console.log(sessionStorage.hist);
                displayHistory(sessionStorage.hist);
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
    var display_list = document.createElement("ul");
    //var header_row = display_table.insertRow(0);

    //populate the first row
    //var cell1 = header_row.insertCell(0);
    //var cell2 = header_row.insertCell(1);
    //var cell3 = header_row.insertCell(2);

    //cell1.innerHTML = "<b>Recommended Task</b>";
    //cell2.innerHTML = "<b>Base Task</b>";
    //cell3.innerHTML = "<b>Similarity (%)</b>";

    //display top 10 similar tasks
    var i = 0;
    var row = 1;
    var td_count;
    var data_row,dc;
    while(i<10){
        /*
        td_count = 0;
        //data_row = display_table.insertRow(row);
        while(td_count<3){
            //dc = data_row.insertCell(td_count);
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
        */
        const listItem = document.createElement('li');
        listItem.innerHTML = histArray[i].recommended_task;
        display_list.append(listItem);
        i++;
        row++;
    }
    historyDiv.appendChild(display_list);
}


