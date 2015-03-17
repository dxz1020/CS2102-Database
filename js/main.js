/* main.js
 * The main Javascript file for the website.
 */

function getHomePageContents() {
  console.log("Testing AJAX...");  //Remove this line in actual implementation.
  var request = new XMLHttpRequest();
  request.open("GET", "/main.php", true);
  request.onreadystatechange = function() {
    if(request.readyState==4 && request.status==200) {
      document.getElementById("home_content").innerHTML = "<button type='button'>"+request.response+"</button>";
      console.log(request.response); //Testing response
    }
  }
  request.send();
}

/* 4 main functions to retrieve the 4 main categories */
function getApp() {
  $.ajax({
    method: "GET",
    url: "search.php",
    data: { category: 'App'
          }
  })
  .done(function(msg) {
    var listOfApps = JSON.parse(msg);
    checkArr(listOfApps);       
  })
  .fail(function(msg) {
    console.log("failed"); 
  });
}


function getMovie() {
  $.ajax({
    method: "GET",
    url: "search.php",
    data: { category: "Movie"
          }
  })
.done(function(msg) {
    var listOfMovie = JSON.parse(msg);
    checkArr(listOfMovie);       
  })
  .fail(function(msg) {
    console.log("failed"); 
  });
}

function getTV() {
  $.ajax({
    method: "GET",
    url: "search.php",
    data: { category: "TV"
          }
  })
.done(function(msg) {
    var listOfTV = JSON.parse(msg);
    checkArr(listOfTV);       
  })
  .fail(function(msg) {
    console.log("failed"); 
  });
}

function getGame() {
  $.ajax({
    method: "GET",
    url: "search.php",
    data: { category: "Game"
          }
  })
.done(function(msg) {
    var listOfGame = JSON.parse(msg);
    checkArr(listOfGame);       
  })
  .fail(function(msg) {
    console.log("failed "); 
  });
}

/* End of 4 main functions */

function checkArr(arr){
 for(var i = 0 ; i < arr.length ; i++) 
  console.log(arr[i]);
}

/*
SORTING FUNCTIONS
function getGameSort(param) {
  $.ajax({
    method: "GET",
    url: "search.php",
    data: { Category: "Game",
            Sort: "Rating"
          }
  })
  .done(function( msg ) {
    console.log( "Data Saved: " + msg ); 
  })
  .fail(function(msg) {
    console.log("failed "); 
  });
}


function login(){
    //get variables
    $.ajax({
    method: "POST",
    url: "login.php",
    data: { email: name,
            password: pw
          }
  })
  .done(function( msg ) {
    console.log( "Login successful " + msg ); 
  })
  .fail(function(msg) {
    console.log("failed "); 
  });
}
*/