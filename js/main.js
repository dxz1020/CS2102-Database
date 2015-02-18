/* main.js
 * The main Javascript file for the website.
 */

function getHomePageContents() {
  console.log("Testing AJAX...");  //Remove this line in actual implementation.
  var request = new XMLHttpRequest();
  request.open("GET", "/main.php", true);
  request.onreadystatechange = function() {
    if(request.readyState==4 && request.status==200) {
      document.getElementById("home_content").innerHTML = request.response;
      console.log(request.response); //Testing response
    }
  }
  request.send();
}
