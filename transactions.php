<?php
  //transactions.php
  //Handles buy/rent/transaction history queries.
  //Only accept POST requests with action parameter specified
  //For buy/rent requests, item id must be specified.
  //Duplicate buy/rent transactions are not allowed.

  putenv("ORACLE_HOME=/oraclient");
  $dbuser = "a0114906";		//Change to your own account
  $dbpassword = "crse1420";	//Change to appropriate password
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
    $purchase_date = date("Y-m-d");

    $dbh = connectToDatabase();
    
    //Checks if user has already purchased this item.
    $query = "SELECT * FROM Purchase WHERE customer=:email AND item=:itemid";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":email", $_SESSION['email']);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_execute($stmt);
    if($row = oci_fetch_assoc($stmt)){ //If user already purchased item
      oci_free_statement($stmt);
      closeConnection($dbh);
      return;
    }
    oci_free_statement($stmt);

    //Actual query
    $query = "INSERT INTO Purchase VALUES(:email, :itemid, to_date(:pdate, 'yyyy-mm-dd'))";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":email", $_SESSION['email']);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_bind_by_name($stmt, ":pdate", $purchase_date);
    oci_execute($stmt);
    oci_free_statement($stmt);
    closeConnection($dbh);
  }

  function processRent(){
    if($_SERVER['REQUEST_METHOD']!='POST' ||
	$_SERVER['CONTENT_TYPE']!='application/json'){
      http_response_code(400);
      return;
    }

    $params = json_decode(file_get_contents('php://input'), true);
    if(!isset($params['itemid'])){
      http_response_code(500);
      return;
    }

    //Preparing other required data.
    $rent_date = date("Y-m-d");
    $expiry_date = date("Y-m-d", strtotime("+2 weeks", strtotime($rent_date)));
    $query = "INSERT INTO Rent VALUES(:customer, :itemid, to_date(:rentdate, 'yyyy-mm-dd'), to_date(:expdate, 'yyyy-mm-dd'), NULL)";

    //The actual insertion.
    $dbh = connectToDatabase();
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":customer", $_SESSION['email']);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_bind_by_name($stmt, ":rentdate", $rent_date);
    oci_bind_by_name($stmt, ":expdate", $expiry_date);
    oci_execute($stmt);
    oci_free_statement($stmt);
    closeConnection($dbh);
  }

  function getTransactionHistory(){
    if($_SERVER['REQUEST_METHOD']!='GET' ||
	$_SERVER['CONTENT_TYPE']!='application/json'){
      http_response_code(400);
      return;
    }

    $query1 = "SELECT item, purchase_date FROM Purchase where customer=:email";
    $query2 = "SELECT item, borrow_date, due_date FROM Rent where customer=:email";
    $dbh = connectToDatabase();
    $res = array();
    $purchase_array = array();
    $rent_array = array();

    //Gets list of purchases.
    $stmt = oci_parse($dbh, $query1);
    oci_bind_by_name($stmt, ":email", $_SESSION['email']);
    oci_execute($stmt);
    while($row = oci_fetch_assoc($stmt)){
       array_push($purchase_array, $row);
    }
    oci_free_statement($stmt);

    //Gets list of rent.
    $stmt = oci_parse($dbh, $query2);
    oci_bind_by_name($stmt, ":email", $_SESSION['email']);
    oci_execute($stmt);
    while($row = oci_fetch_assoc($stmt)){
      array_push($rent_array, $row);
    }
    oci_free_statement($stmt);
    closeConnection($dbh);
    array_push($res, $purchase_array);
    array_push($res, $rent_array);
    echo json_encode($res);
  }

  function processLike(){
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

    //Checks if the entry to be inserted already exists.
    $query = "SELECT * FROM Likes WHERE customer=:email AND item=:itemid";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":email", $_SESSION['email']);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_execute($stmt);
    if($row = oci_fetch_assoc($stmt)){ //If the entry exists, return.
      oci_free_statement($stmt);
      closeConnection($dbh);
      echo -1;
      return;
    }
    oci_free_statement($stmt); //Free resources.

    $query = "INSERT INTO Likes VALUES(:email, :itemid)"; //Actual query
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":email", $_SESSION['email']);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_execute($stmt);
    oci_free_statement($stmt);
    closeConnection($dbh);
  }

  function processUnlike(){
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
    $query = "DELETE FROM Likes WHERE customer=:email AND item=:itemid";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":email", $_SESSION['email']);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_execute($stmt);
    oci_free_statement($stmt);
    closeConnection($dbh);
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

  date_default_timezone_set('Asia/Singapore');

  switch($_GET['type']){
    case 'buy': processPurchase(); break;
    case 'rent': processRent(); break;
    case 'history': getTransactionHistory(); break;
    case 'like': processLike(); break;
    case 'unlike': processUnlike(); break;
    default: http_response_code(400); break;
  }
?>
