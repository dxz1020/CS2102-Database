<?php
  /* admin.php
   * Handles admin-exclusive requests.
   */

  putenv("ORACLE_HOME=/oraclient");
  $dbuser = "a0111217";		//Change to your own account
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
    $query = "INSERT INTO Item VALUES(:itemid, :title, :category, :genre, :device, to_date(:rdate, 'yyyy-mm-dd'), :price, :rent_price, 0)";
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
    $query1 = "DELETE FROM Purchase WHERE item = (:itemid)";
    $stmt1 = oci_parse($dbh, $query1);
    oci_bind_by_name($stmt1, ":itemid", $params['itemid']);
    oci_free_statement($stmt1);

    $query2 = "DELETE FROM Likes WHERE item = (:itemid)";
    $stmt2 = oci_parse($dbh, $query2);
    oci_bind_by_name($stmt2, ":itemid", $params['itemid']);
    oci_free_statement($stmt2);

     $query3 = "DELETE FROM Rent WHERE item = (:itemid)";
    $stmt = oci_parse($dbh, $query3);
    oci_bind_by_name($stmt3, ":itemid", $params['itemid']);
    oci_free_statement($stmt3);

    $query4 = "DELETE FROM Item WHERE item_id = (:itemid)";
    $stmt = oci_parse($dbh, $query4);
    oci_bind_by_name($stmt4, ":itemid", $params['itemid']);
    oci_execute($stmt4);
    oci_free_statement($stmt4);

    closeConnection($dbh);

  }

  session_start();

  if(!isset($_SESSION['email']) || !isset($_SESSION['username']) ||
	!isset($_SESSION['admin']) || $_SESSION['admin']!='Y'){
    http_response_code(403);
    exit(0);
  }

  date_default_timezone_set('Asia/Singapore');

  switch($_GET['type']){
    case 'add': addItem(); break;
    case 'deleteItem': deleteItem(); break;
    default: http_response_code(400); break;
  }
?>
