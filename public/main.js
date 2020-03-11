window.onload = function() {
    document.getElementById("signoutBtn").addEventListener("click", signoutUser)
}

function signoutUser(event) {
    $.ajax({
        url: 'http://localhost:3000/signout',
        type: 'GET',
        success: function(resp,msg){
            console.log("user successfully logged out");
            window.location.href = "http://localhost:3000/"
        },
        error: function(jqXHR,status,err){
            console.log(status);
            console.log(err);
        }
    });
}