/* main.js
 * The main Javascript file for admin website.
 */

 $(function() {
  getItems();
  getAccounts();
  getPurchaseHistory();
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
    url: "../admin.php",
    data: {
      type : "accounts"
    }
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
    '<th scope="row">' + arr[i].USERNAME + '</th>' + //username
    "<td>" + arr[i].EMAIL + "</td>" + //email
    "<td>" + arr[i].ADMIN + "</td>" + //accounttype
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].EMAIL + ')">Modify</button></td>' + //email
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].EMAIL + ')">Drop</button></td>' + //email
    "</tr>"
  }

  return string;
}

function getPurchaseHistory() {

  $.ajax({
    method: "GET",
    url: "../admin.php",
    data: {
      type: "transactions"
    }
  })
  .done(function(data) {
    console.log( "Displayed Rent History"); 
    var list = JSON.parse(data);
    console.log(list);
    $('.listPurchaseHistory').html(renderPurchaseHistoryTable(list[0])); //list[0] for purchase
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
    '<th scope="row">' + arr[i].CUSTOMER + '</th>' + //customer
    "<td>" + arr[i].ITEM + "</td>" + //item
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
    url: "../admin.php",
    data: {
      type: "transactions"
    }
  })
  .done(function(data) {
    console.log( "Displayed Rent History"); 
    var list = JSON.parse(data);
    console.log(list);
    $('.listRentHistory').html(renderRentHistoryTable(list[1])); //list[1] for rent
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
    '<th scope="row">' + arr[i].CUSTOMER + '</th>' + //customer
    "<td>" + arr[i].ITEM + "</td>" + //item
    "<td>" + arr[i].BORROW_DATE + "</td>" + //borrowed
    "<td>" + arr[i].DUE_DATE + "</td>" + //due
    "<td>" + arr[i].RETURN_DATE + "</td>" + //returned
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].ITEM_ + ')">Modify</button></td>' +
    '<td><button class= "btn btn-default btn-sm" onclick="sayA(' + arr[i].ITEM + ')">Drop</button></td>' +
    "</tr>"
  }

  return string;
}
