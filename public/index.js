function createAccount() {
    var fname = document.getElementById("fnameCA")
    var lname = document.getElementById("lnameCA")
    var email = document.getElementById("emailCA")
    var password = document.getElementById("passwordCA")
    var passwordConfirm = document.getElementById("passwordConfirmCA")

    checkInformation(fname, lname, email, password, passwordConfirm)
}

function checkInformation(fname, lname, email, password, passwordConfirm) {
    var formErrors = document.getElementById("formErrors");
    formErrors.style.display = "none";

    while (formErrors.hasChildNodes()) {
		formErrors.removeChild(formErrors.firstChild)
	}

	newUl = document.createElement("ul");
	formErrors.appendChild(newUl);

    if (fName.value.length < 1) {
		fullNameGood = false;
		newLi = document.createElement("li");
		newLi.appendChild(document.createTextNode("Missing first name."));
		newUl.appendChild(newLi);
    }
    
    if (lName.value.length < 1) {
		fullNameGood = false;
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
    
    if ((fName == false) || (lname == false) || (emailGood == false) || (passwordGood == false) || (passwordConfirmGood == false)) {
		formErrors.style.display = "block";
	}
}