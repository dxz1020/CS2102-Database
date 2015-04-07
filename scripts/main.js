/* main.js
 * The main Javascript file for admin website.
 */

 $(function() {
  getItems();
  getAccounts();
  //getPurchaseHistory();
  getRentHistory();


  $('#addNewItemForm').submit(function(e){
    var values = $('#addNewItemForm').serializeArray();
    console.log("inside item");
    console.log(values);
    e.preventDefault();
  });

  $('#addNewAccountForm').submit(function(e){
    var values = $(this).serializeArray();
    console.log("inside account");
    console.log(values);
    e.preventDefault();
  });

    $('#addNewPurchaseForm').submit(function(e){
    var values = $(this).serializeArray();
    console.log("inside Purchase");
    console.log(values);
    e.preventDefault();
  });

    $('#addNewRentForm').submit(function(e){
    var values = $(this).serializeArray();
    console.log("inside rent");
    console.log(values);
    e.preventDefault();
  });

    $('#searchForm').submit(function(e){
      var values = $(this).serializeArray();
      console.log("searching...");
      console.log(values);
      e.preventDefault();
  });


});


 function getItems() {
  $.ajax({
    method: "GET",
    url: "../search.php",
    data: {
      sortby: "item_id"
    }
  })
  .done(function(data) {
    console.log( "Displayed"); 
    var list = JSON.parse(data);
    $('.listItems').html(renderItemTable(list));

  })
  .fail(function(msg) {
    console.log("failed "); 
  });
}

function renderItemTable(arr){
  var string ="";

  for(var i=0;i<arr.length;i++){
    string +=
    '<tr>' +
    '<th scope="row">' + arr[i].ITEM_ID + '</th>' +
    "<td>" + arr[i].TITLE + "</td>" +
    "<td>" + arr[i].CATEGORY + "</td>" +
    "<td>" + arr[i].GENRE + "</td>" +
    "<td>" + arr[i].DEVICE + "</td>" +
    "<td>" + arr[i].RELEASE_DATE + "</td>" +
    "<td>" + arr[i].PRICE + "</td>" +
    "<td>" + arr[i].RENT_PRICE + "</td>" +
    "<td>" + arr[i].LIKES + "</td>" +
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].ITEM_ID + ')">Modify</button></td>' +
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].ITEM_ID + ')">Drop</button></td>' +
    "</tr>"
  }

  return string;
}

function sayA(itemid){
  console.log(itemid);
}

function getAccounts() {

  $.ajax({
    method: "GET",
    url: "../search.php"
  })
  .done(function(data) {
    console.log( "Displayed Accounts"); 
    var list = JSON.parse(data);
    $('.listAccounts').html(renderAccountTable(list));
  })
  .fail(function(msg) {
    console.log("failed "); 
  });
}

function renderAccountTable(arr){
  var string ="";

  for(var i=0;i<arr.length;i++){
    string +=
    '<tr>' +
    '<th scope="row">' + arr[i].ITEM_ID + '</th>' + //username
    "<td>" + arr[i].TITLE + "</td>" + //email
    "<td>" + arr[i].CATEGORY + "</td>" + //accounttype
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].ITEM_ID + ')">Modify</button></td>' + //email
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].ITEM_ID + ')">Drop</button></td>' + //email
    "</tr>"
  }

  return string;
}

function getPurchaseHistory() {

  $.ajax({
    method: "GET",
    url: "../transactions/history"
  })
  .done(function(data) {
    console.log( "Displayed Purchase History"); 
    var list = JSON.parse(data);
    $('.listPurchaseHistory').html(renderPurchaseHistoryTable(list));
  })
  .fail(function(msg) {
    console.log("failed "); 
  });
}

function renderPurchaseHistoryTable(arr){
  var string ="";

  for(var i=0;i<arr.length;i++){
    string +=
    '<tr>' +
    '<th scope="row">' + arr[i].ITEM_ID + '</th>' + //customer
    "<td>" + arr[i].TITLE + "</td>" + //item
    "<td>" + arr[i].PURCHASE_DATE + "</td>" + //date
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].ITEM + ')">Modify</button></td>' + //email
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].ITEM + ')">Drop</button></td>' + //email
    "</tr>"
  }

  return string;
}

function getRentHistory() {

  $.ajax({
    method: "GET",
    url: "../search.php"
  })
  .done(function(data) {
    console.log( "Displayed Rent History"); 
    var list = JSON.parse(data);
    $('.listRentHistory').html(renderRentHistoryTable(list));
  })
  .fail(function(msg) {
    console.log("failed "); 
  });
}

function renderRentHistoryTable(arr){
  var string ="";

  for(var i=0;i<arr.length;i++){
    string +=
    '<tr>' +
    '<th scope="row">' + arr[i].ITEM_ID + '</th>' + //customer
    "<td>" + arr[i].TITLE + "</td>" + //item
    "<td>" + arr[i].CATEGORY + "</td>" + //borrowed
    "<td>" + arr[i].GENRE + "</td>" + //due
    "<td>" + arr[i].DEVICE + "</td>" + //returned
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].ITEM_ID + ')">Modify</button></td>' +
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].ITEM_ID + ')">Drop</button></td>' +
    "</tr>"
  }

  return string;
}
