/* Javascript file for dummy page to test functionalities.
 * Author: Qua Zi Xian
 */

//Gets the list of modules
function getModules(){
  var url = "dbscript.php";
  url+="?message=Hello World";
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onreadystatechange = function(){
    if(request.readyState==4 && request.status==200){
      console.log(request.responseText);
      document.getElementById("output").innerHTML = request.responseText;
    }
  };
  request.send();
}

function login(){
  var data = {
    "email": "zx@email.com",
    "password": "password"
  };

  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(request.readyState==4){
      console.log(request.status);
      if(request.status==200){
	console.log(request.responseText);
      } else if(request.status==400){
	console.log(request.responseText);
      } else {
	console.log("Something went wrong.");
      }
    }
  };
  request.open("POST", "../login", true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
}

function logout(){
  window.location = "http://cs2102-i.comp.nus.edu.sg/~a0110781/logout";
}

function buy(){
  var data = {
    "itemid": "1"
  };
  var url = "../transactions/buy"
  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(request.readyState==4 && request.status==200){
      console.log("Buy successful");
      document.getElementById('output').innerHTML = request.responseText;
    } else if(request.status==4) {
      console.log("Transaction error");
    }
  };
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
}

function like(){
  var data = {
    "itemid": "5"
  };
  var url = "../transactions/like";
  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(request.readyState==4){
      if(request.status==200)
	document.getElementById('output').innerHTML = request.responseText;
      else console.log(request.status);
    }
  };
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
}

function unlike(){
  var data = {
    "itemid": "5"
  };
  var url = "../transactions/unlike";
  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(request.readyState==4){
      if(request.status==200)
	document.getElementById('output').innerHTML = request.responseText;
      else console.log(request.status);
    }
  };
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
}

function addContent(){
  var data = {
    "itemid": "3000",
    "title": "Farm Heroes Saga",
    "category": "Games",
    "genre": "None",
    "device": "Android",
    "rdate": "2014-03-01",
    "price": "0",
    "rent": "0"
  };
  var url = "../admin/add";
  var request = new XMLHttpRequest();
  request.onreadystatechange = function(){
    if(request.readyState==4){
      if(request.status==200){
	document.getElementById('output').innerHTML = "Item added";
	console.log(request.responseText);
      } else console.log(request.status);
    }
  };
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
}
