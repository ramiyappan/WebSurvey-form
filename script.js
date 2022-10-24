/*    George Mason University           -->
<!---------------------------------------->
<!--  Author     : Ramaswamy Iyappan    -->
<!--  G#         : G01348097            -->
<!--  Course     :  SWE-642             -->
<!--  Homework   :  2                    */

// Tabs using Jquery.
$(document).ready(
    $(function() {
        $( "#tabs" ).tabs();
    })
);

//Function to delete a cookie
function wrongPerson() {
    document.cookie = "username=;" + " expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.reload();
}

//Function to greet user with stored cookies
function cookie() {
    var now = new Date();
    var hour = now.getHours();

    var greet_id = document.getElementById("greet");
    var message = '<b>Good ';
    if (hour < 12)
        message += 'Morning ';
    else if (hour < 18)
        message += 'Afternoon ';
    else
        message += 'Evening ';

    let user = getCookie("username");
    if (user!="")
    {
        message += user + "! Welcome again to the Survey Page !..</b><br>";
    }
    else {
        user = prompt("New user? Please enter your name","");
        if (user != "" && user != null) {
            setCookie("username", user);
            message += user + "! Welcome to CS Department Survey !..</b><br>";
        }
    }

    message += "<h4 style='margin-top: 0'>Click " + "<a href = 'javascript:wrongPerson()'>here</a> " +
        " if you are not " + user + ".</h4>";
    greet_id.innerHTML = message;
}

//Function to check document.cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++)
    {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1); }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length); }
    }
    return "";
}

//Function to store & set expiration for a cookie
function setCookie(cname, cval) {
    const d = new Date();
    d.setTime(d.getTime() + (30*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cval + ";" + expires + ";path=/";
}

//Function to calculate average and maximum for given 10 numbers
function calc(data) {
    var dataErrorNode = document.getElementById("data-error");
    dataErrorNode.innerHTML = "";
    document.getElementById("average").innerHTML = "";
    document.getElementById("maximum").innerHTML = "";
    data = data.replace(/(^[,\s]+)|([,\s]+$)/g, '');
    data = data.split(',');
    if (data.length !== 10) {
        dataErrorNode.innerHTML = "Enter 10 numbers";
        return false;
    }
    var count = 0;
    var sum = 0;
    var avg = 0;
    var max = 0;
    for (var x of data) {
        if (x === "") {
            dataErrorNode.innerHTML = "Enter 10 numbers";
            return false;
        }
        x = x - '0';
        if (x < 1 || x > 100) {
            dataErrorNode.innerHTML = "Enter numbers in the range [1-100].";
            return false;
        }
        else {
            count++;
            sum += x;
            if (x > max) {
                max = x;
            }
        }
    }
    avg = sum / count;
    document.getElementById("average").innerHTML = avg;
    document.getElementById("maximum").innerHTML = max;
}

//Function to validate the fields -> Name, Address, Email, Checkboxes, and Radio buttons.
function validateForm(event) {

    var alphabet = /^[A-Za-z]+$/;
    var alphabetNumeric = /^[A-Za-z0-9]+$/;
    var likesCount = 2;
    var interestCount = 1;
    var email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    var errorMessage = "";
    if (!document.getElementById("username").value.match(alphabet)) {
        errorMessage += "Name consists of only Alphabets. \n";
        document.getElementById("username").value = "";
    }
    if (!document.getElementById("address").value.match(alphabetNumeric)) {
        errorMessage += "Street Address can include only appropriate numeric, alphabet or alphanumeric characters. \n";
        document.getElementById("address").value = "";
    }
    if (!document.getElementById("email").value.match(email)) {
        errorMessage += "The email id you entered is not valid. \n";
        document.getElementById("email").value = "";
    }
    var likes = document.getElementsByName("likes");
    var count = 0;
    for (var i = 0; i < likes.length; i++) {
        if (likes[i].checked) {
            count++;
        }
    }
    if (count < likesCount) {
        errorMessage += "Choose atleast 2 things you like about GMU. \n";
    }

    var interest = document.getElementsByName("source");
    count = 0;
    for (var i = 0; i < interest.length; i++) {
        if (interest[i].checked) {
            count++;
        }
    }
    if (count !== interestCount) {
        errorMessage += "You must choose an option of how you came to know about Mason. \n";
    }

//JQuery UI Dialog box
    $( "#dialog" ).dialog({
        autoOpen: false,
        modal: true,
        width: 400,
        title: "Notification Alert!",
        buttons: [
            {
                text: "Ok",
                click: function() {
                    $( this ).dialog( "close" );
                }
            },
            {
                text: "Cancel",
                click: function() {
                    $( this ).dialog( "close" );
                }
            }
        ]
    });

    // Stores rest and clears fields with error.
    if (errorMessage !== "")
    {
        $("#dialog").html(errorMessage);
        $( "#dialog" ).dialog("open");
        event.preventDefault();
    }

    // Success case followed by resetting the form.
    else
    {
        $("#dialog").html("Feedback Submitted!");
        $( "#dialog" ).dialog("open");
        event.preventDefault();
        $( function() {
            $("#city").html("");
            $("#state").html("");
            $("#ziperror").html("");
            $("#average").html("");
            $("#maximum").html("");
            $("#data-error").html("");

            $("#reset").click();
        });
    }

}

// Function to check zipcode -> create request and assign event handler.
function validateZip(zip) {
    try {
        var asyncRequest = new XMLHttpRequest();
        asyncRequest.onreadystatechange = function () {
            callBack(zip, asyncRequest);
        };
        asyncRequest.open("GET", "zipcodes.json", true);
        asyncRequest.withCredentials = true;
        asyncRequest.send();
    }
    catch (exception) {
        alert("Request failed.");
    }
}

// Event handler that checks if request was success and gets corresponding city and state.
function callBack(zip, asyncRequest) {
    document.getElementById("zipcode").innerHTML = "Checking zip...";
    document.getElementById('city').innerHTML = "";
    document.getElementById('state').innerHTML = "";
    if (asyncRequest.readyState == 4) {
        if (asyncRequest.status == 200 || asyncRequest.status == 304) {
            var data = JSON.parse(asyncRequest.responseText);
            result = isValid(zip, data)
            if (result.valid) {
                document.getElementById('ziperror').innerHTML = '';
                document.getElementById('city').innerHTML = result.city;
                document.getElementById('state').innerHTML = result.state;
            } else {
                document.getElementById("ziperror").innerHTML="Invalid Zip Code.";
            }
        }
    }
}

// Function that checks if zipcode is present in the JSON file.
function isValid(zip, data) {
    var zipcodes = data.zipcodes;
    for (var element of zipcodes) {
        if(element.zip === zip) {
            return {
                valid: true,
                city: element.city,
                state: element.state
            };
        }
    }
    return {
        valid: false
    };
}
