/* ajaxExample.js
 * Example code on how to use AJAX in Javascript.
 * jQuery has different syntax so you might want to Google around for it.
 * Author: Qua Zi Xian
 */

function sendGetRequest(){
  var url = "search.php";

  //Attach any GET parameters here
  url+="?category=game";

  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if(req.readyState==4 && req.status==200){
      console.log(req.responseText); //To be deleted
      //Update the appropriate HTML object with response data
    }
  };
  req.open("GET", url, true);
  req.send();
}

//Simulates attempt to login using AJAX
function sendPostRequest(){
  var url = "login.php";
  var email = "email@email.com";
  var password = "password";
  var data = {};
  data.email = email;
  data.password = password;

  var req = new XMLHttpRequest();
  req.onreadystatechange = function(){
    if(req.readyState==4){
      //How to determine if login is successful depends on communication protocol being used
      if(req.status==200){
	//proceed to redirect to logged in home page
	console.log("Success");
	console.log(req.responseText);
      } else{
	//Login failed
	console.log("Login failed");
      }
    }
  };
  req.open("POST", url, true);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(data));
}
