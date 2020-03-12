window.onload = function() {
	document.getElementById("createAcct").addEventListener("click", createAccount);
	document.getElementById("loginBtn").addEventListener("click",loginUser);
}

function loginUser(){
	const loginErrors = document.getElementById('loginErrors');
	loginErrors.style.display = "none";
	const ul_init = document.createElement("ul");

	while (loginErrors.hasChildNodes()) {
		loginErrors.removeChild(loginErrors.firstChild)
	}

	loginErrors.appendChild(ul_init);


	const email = document.getElementById("email");
	const pass = document.getElementById("password");

	if (email.value && pass.value){
		const final_url = "http://localhost:3000/check_user?email="+email.value+"&password="+pass.value;
		$.ajax({
			url: final_url,
			type: 'GET',
			success: function(resp,msg){
				console.log("new user data successfully received server");
				//console.log(JSON.stringify(resp));
				if (resp[0]){
					//NOTE: We cannot simply render same page for every user. So we will have a server GET endpoint called /main, which will redirect to custom pages for different users.
					//NOTE (cont): So this client redirect is temporary. We will ultimately make a GET request to /main, which will render appropriate HTML code.
					window.location.href = "http://localhost:3000/"
					console.log(resp);
				}
				else{
					loginErrors.style.display = "block";
					const li_init = document.createElement("li");
					li_init.appendChild(document.createTextNode("User not found or password doesn't match"));
					ul_init.appendChild(li_init);
					ul_init.appendChild(li_init);
				}
			},
			error: function(jqXHR,status,err){
				console.log(status);
				console.log(err);
				loginErrors.style.display = "block";
				const li_init = document.createElement("li");
				li_init.appendChild(document.createTextNode("Error getting the request"));
				ul_init.appendChild(li_init);
			}
		});
	}

	else{
		//missing values
		loginErrors.style.display = "block";
		const li_init = document.createElement("li");
		li_init.appendChild(document.createTextNode("Missing email or password field."));
		ul_init.appendChild(li_init);
	}
}

function createAccount(event) {
    const fname = document.getElementById("fNameCA");
    const lname = document.getElementById("lNameCA");
    const email = document.getElementById("emailCA");
    const password = document.getElementById("passwordCA");
    const passwordConfirm = document.getElementById("passwordConfirmCA");

    checkInformation(fname, lname, email, password, passwordConfirm);
}

function checkInformation(fname, lname, email, password, passwordConfirm) {
	fnameGood = true;
	lnameGood = true;
	emailGood = true;
	passwordGood = true;
	passwordConfirmGood = true;

    var formErrors = document.getElementById("formErrors");
    formErrors.style.display = "none";

    while (formErrors.hasChildNodes()) {
		formErrors.removeChild(formErrors.firstChild)
	}
	
	newUl = document.createElement("ul");
	formErrors.appendChild(newUl);

    if (fname.value.length < 1) {
		fnameGood = false;
		newLi = document.createElement("li");
		newLi.appendChild(document.createTextNode("Missing first name."));
		newUl.appendChild(newLi);
    }
    
    if (lname.value.length < 1) {
		lnameGood = false;
		newLi = document.createElement("li");
		newLi.appendChild(document.createTextNode("Missing last name."));
		newUl.appendChild(newLi);
	}

	var re = RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$");

	if (re.test(email.value) == false) {
		emailGood = false;
		newLi = document.createElement("li");
		newLi.appendChild(document.createTextNode("Invalid or missing email address."));
		newUl.appendChild(newLi);
	}

	if (password.value.length < 5) {
		passwordGood = false;
		newLi = document.createElement("li");
		newLi.appendChild(document.createTextNode("Password must be at least 6 characters."));
		newUl.appendChild(newLi);
	}


	if (password.value != passwordConfirm.value) {
		passwordGood = false;
		passwordConfirmGood = false;
		newLi = document.createElement("li");
		
		newLi.appendChild(document.createTextNode("Password and confirmation password don't match."));
		newUl.appendChild(newLi);
    }
    
    if ((fnameGood == false) || (lnameGood == false) || (emailGood == false) || (passwordGood == false) || (passwordConfirmGood == false)) {
		formErrors.style.display = "block";
	}

    //database post request
	if ((fnameGood == true) && (lnameGood == true) && (emailGood == true) && (passwordGood == true) && (passwordConfirmGood == true)) {
		var send_data = {};
		send_data.first_name = fname.value;
		send_data.last_name = lname.value;
		send_data.email = email.value;
		send_data.password = password.value;

		$.ajax({
			url: 'http://localhost:3000/post_db',
			type: 'POST',
			data: send_data,
			success: function(msg){
				console.log("new user data successfully sent to server. Please log in using your new credentials.");
				console.log(JSON.stringify(send_data));

				// logins in user if account created
				document.getElementById("email").value = email.value;
				document.getElementById("password").value = password.value;
				loginUser();
			},
			error: function(jqXHR,status,err){
				console.log(status);
				console.log(err);
				formErrors.style.display = "block";
				newLi = document.createElement("li");
				newLi.appendChild(document.createTextNode("Email already exists."));
				newUl.appendChild(newLi);

			}
		});
	}
}
