<?php
  //transactions.php
  //Handles buy/rent/transaction history queries.
  //Only accept POST requests with action parameter specified
  //For buy/rent requests, item id must be specified.
  //Duplicate buy/rent transactions are not allowed.

  putenv("ORACLE_HOME=/oraclient");
  $dbuser = "a0110781";		//Change to your own account
  $dbpassword = "Nana7Nana";	//Change to appropriate password
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

  function processPurchase(){
    if($_SERVER['REQUEST_METHOD']!='POST'){
      http_response_code(400);
      return;
    }
    $dbh = connectToDatabase();
    closeConnection($dbh);
    echo 'Purchased';
  }

  function processRent(){
    $dbh = connectToDatabase();
    closeConnection($dbh);
    echo 'Rented';
  }

  function getTransactionHistory(){
    $dbh = connectToDatabase();
    closeConnection($dbh);
    echo 'Transaction history retrieved';
  }

  function processLike(){
    if($_SERVER['REQUEST_METHOD']!='POST'){
      http_response_code(400);
      return;
    }

    $params = json_decode(file_get_contents('php://input'), true);
    if(!isset($params['itemid'])){
      http_response_code(400);
      return;
    }

    $dbh = connectToDatabase();
    $query = "INSERT INTO Likes VALUES(:email, :itemid)";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":email", $_SESSION['email']);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_execute($stmt);
    echo 'Like added.';
    oci_free_statement($stmt);
    closeConnection($dbh);
  }

  function processUnlike(){
    $dbh = conenctToDatabase();
    closeConnection($dbh);
    echo 'Unliked item';
  }

  session_start();

  //Forbid access if user is not logged in properly.
  if(!isset($_SESSION['email']) || !isset($_SESSION['username']) ||
	!isset($_SESSION['admin'])){
    http_response_code(403);
    exit(0);
  }

  //Checks for invalid API calls
  if(!isset($_GET['type'])){
    http_response_code(400);
    exit(0);
  }

  switch($_GET['type']){
    case 'buy': processPurchase(); break;
    case 'rent': processRent(); break;
    case 'history': getTransactionHistory(); break;
    case 'like': processLike(); break;
    case 'unlike': processUnlike(); break;
    default: http_response_code(400); break;
  }
?>
