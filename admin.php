<?php
  /* admin.php
   * Handles admin-exclusive requests.
   */

  putenv("ORACLE_HOME=/oraclient");
  $dbuser = "a0110781";   //Change to your own account
  $dbpassword = "Nana7Nana";  //Change to appropriate password
  $dbinfo = "(DESCRIPTION = (ADDRESS_LIST = (
      ADDRESS = (PROTOCOL = TCP)(HOST = sid3.comp.nus.edu.sg)(PORT = 1521))
    )(CONNECT_DATA = (SERVICE_NAME = sid3.comp.nus.edu.sg)))";

  function connectToDatabase(){
    global $dbuser, $dbpassword, $dbinfo;
    $dbh = oci_connect($dbuser, $dbpassword, $dbinfo);
    if(!$dbh){
      http_response_code(503);
      exit(1);
    }
    return $dbh;
  }

  function closeConnection($dbh){
    oci_close($dbh);
  }

  function addItem(){
    if($_SERVER['REQUEST_METHOD']!='POST' ||
       $_SERVER['CONTENT_TYPE']!='application/json'){
        http_response_code(400);
        return;
    }

    $params = json_decode(file_get_contents('php://input'), true);
    if(!isset($params['itemid']) || !isset($params['title']) ||
       !isset($params['category']) || !isset($params['genre']) ||
       !isset($params['device']) || !isset($params['rdate']) ||
       !isset($params['price']) || !isset($params['rent'])){
          http_response_code(400);
          return;
    }

    //There is a chance that some old content may be put up.
    //$release_date = date("Y-m-d");

    $dbh = connectToDatabase();

    //Actual Insertion
    $query = "INSERT INTO Item VALUES(:itemid, :title, :category, :genre, :device, to_date(:rdate, 'yyyy-mm-dd'), :price, :rent_price)";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_bind_by_name($stmt, ":title", $params['title']);
    oci_bind_by_name($stmt, ":category", $params['category']);
    oci_bind_by_name($stmt, ":genre", $params['genre']);
    oci_bind_by_name($stmt, ":device", $params['device']);
    oci_bind_by_name($stmt, ":rdate" , $params['rdate']);
    oci_bind_by_name($stmt, ":price", $params['price']);
    oci_bind_by_name($stmt, ":rent_price", $params['rent']);
    oci_execute($stmt);
    oci_free_statement($stmt);
    closeConnection($dbh);
  }

  function deleteItem(){
    if($_SERVER['REQUEST_METHOD']!='POST' ||
       $_SERVER['CONTENT_TYPE']!='application/json'){
        http_response_code(400);
        return;
    }
 
    $params = json_decode(file_get_contents('php://input'), true);
    if(!isset($params['itemid'])){
      http_response_code(400);
      return;
    } 

    $dbh = connectToDatabase();

    // Actual deletion
    $query = "DELETE FROM Item WHERE item_id=:itemid";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_execute($stmt);
    oci_free_statement($stmt);

    closeConnection($dbh);

  }

  function addAccount(){
    if($_SERVER['REQUEST_METHOD']!='POST' ||
       $_SERVER['CONTENT_TYPE']!='application/json'){
        http_response_code(400);
        return;
    }

    $params = json_decode(file_get_contents("php://input"), true);
    if(!isset($params['email']) || !isset($params['username']) ||
       !isset($params['password']) || !isset($params['admin'])){
          http_response_code(400);
    }

    $dbh = connectToDatabase();
    $query = "SELECT * FROM Accounts WHERE email=:email";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":email", $params['email']);
    oci_execute($stmt);
    if($row = oci_fetch_row($stmt)){
      oci_free_statement($stmt);
      closeConnection($dbh);
      //echo "This email address is in use by another user.";
      echo "0";
      return;
    }
    oci_free_statement($stmt);

    $query = "INSERT INTO Accounts VALUES(:email, :username, :password, :admin)";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":email", $params['email']);
    oci_bind_by_name($stmt, ":username", $params['username']);
    oci_bind_by_name($stmt, ":password", $params['password']);
    oci_bind_by_name($stmt, ":admin", $params['admin']);
    oci_execute($stmt);
    closeConnection($dbh);
    echo "1";
  }

  function deleteAccount(){
    if($_SERVER['REQUEST_METHOD']!='POST' ||
  $_SERVER['CONTENT_TYPE']!='application/json'){
      http_response_code(400);
      return;
    }

    $params = json_decode(file_get_contents('php://input'), true);
    if(!isset($params['email'])){
      http_response_code(400);
      return;
    }

    $dbh = connectToDatabase();

    // Actual deletion
    $query = "DELETE FROM Accounts WHERE email=:email";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":email", $params['email']);
    oci_execute($stmt);
    oci_free_statement($stmt);

    closeConnection($dbh);
  } 

  function listTransactions(){
    if($_SERVER['REQUEST_METHOD']!='GET'){
      http_response_code(400);
      return;
    }

    $res = array();
    $purchase_array = array();
    $rent_array = array();

    $dbh = connectToDatabase();

    //Get list of purchases
    $query = "SELECT * FROM Purchase GROUP BY customer, item, purchase_date ORDER BY purchase_date DESC";
    $stmt = oci_parse($dbh, $query);
    oci_execute($stmt);
    while($row = oci_fetch_assoc($stmt)) array_push($purchase_array, $row);
    oci_free_statement($stmt);

    //Get list of rent transactions
    $query = "SELECT * FROM Rent GROUP BY customer, item, borrow_date, due_date, return_date ORDER BY borrow_date DESC";
    $stmt = oci_parse($dbh, $query);
    oci_execute($stmt);
    while($row = oci_fetch_assoc($stmt)) array_push($rent_array, $row);
    oci_free_statement($stmt);
    closeConnection($dbh);

    //Assemble the response message and send
    array_push($res, $purchase_array);
    array_push($res, $rent_array);
    echo json_encode($res);
  }

  function listAccounts(){
    if($_SERVER['REQUEST_METHOD']!='GET'){
      http_response_code(400);
      return;
    }

    $res = array();
    $acc_array = array();

    $dbh = connectToDatabase();

    //Get list of accounts
    $query = "SELECT email, username, admin FROM Accounts ORDER BY admin, username DESC";
    $stmt = oci_parse($dbh, $query);
    oci_execute($stmt);
    while($row = oci_fetch_assoc($stmt)) array_push($acc_array, $row);
    oci_free_statement($stmt);

    closeConnection($dbh);

    //Assemble the response message and send
    echo json_encode($acc_array);
  }

  session_start();

  if(!isset($_SESSION['email']) || !isset($_SESSION['username']) ||
  !isset($_SESSION['admin']) || $_SESSION['admin']!='Y'){
    http_response_code(403);
    exit(0);
  }

  date_default_timezone_set('Asia/Singapore');

  switch($_GET['type']){
    case 'additem': addItem(); break;
    case 'deleteitem': deleteItem(); break;
    case 'addaccount': addAccount(); break;
    case 'deleteaccount': deleteAccount();break;
    case 'accounts' : listAccounts(); break;
    case 'transactions': listTransactions();
    default: http_response_code(400); break;
  }
?>