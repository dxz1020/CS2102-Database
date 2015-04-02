<?php
  /* admin.php
   * Handles admin-exclusive requests.
   */

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

  function addItem(){
  	if($_SERVER['REQUEST_METHOD']!='POST'){
      http_response_code(400);
      return;
    }

    $params = json_decode(file_get_contents('php://input'), true);
    if(!isset($params['itemid'])){
      http_response_code(400);
      return;
    }
    $release_date = date("Y-m-d");

    $query = "SELECT * FROM Item WHERE item=:itemid AND title=:title AND category = :category AND genre = :genre AND device = :device AND to_date(:rdate, 'yyyy-mm-dd') AND price = :price AND rent = :rent_price AND likes = :likes";
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_bind_by_name($stmt, ":title", $params['title']);
    oci_bind_by_name($stmt, ":category", $params['category']);
    oci_bind_by_name($stmt, ":genre", $params['device']);
    oci_bind_by_name($stmt, ":device", $params['device']);
    oci_bind_by_name($stmt, ":rdate" , $release_date);
    oci_bind_by_name($stmt, ":price", $params['price']);
    oci_bind_by_name($stmt, ":rent_price", $params['rent']);
    oci_bind_by_name($stmt, ":likes", $params['likes']);
    oci_execute($stmt);
    if($row = oci_fetch_assoc($stmt)){ //If item already exist in database
      oci_free_statement($stmt);
      closeConnection($dbh);
      return;
    }

    //Actual Insertion
    $query = "INSERT INTO Item VALUES(:itemid, :title, :category, :genre, :device, to_date(:rdate, 'yyyy-mm-dd'), :price, :rent_price, :likes");
    $stmt = oci_parse($dbh, $query);
    oci_bind_by_name($stmt, ":itemid", $params['itemid']);
    oci_bind_by_name($stmt, ":title", $params['title']);
    oci_bind_by_name($stmt, ":category", $params['category']);
    oci_bind_by_name($stmt, ":genre", $params['device']);
    oci_bind_by_name($stmt, ":device", $params['device']);
    oci_bind_by_name($stmt, ":rdate" , $release_date);
    oci_bind_by_name($stmt, ":price", $params['price']);
    oci_bind_by_name($stmt, ":rent_price", $params['rent']);
    oci_bind_by_name($stmt, ":likes", $params['likes']);
    oci_execute($stmt);
    oci_free_statement($stmt);
    closeConnection($dbh);
  }


  //Closes the database connection
  oci_close($dbh);
?>
