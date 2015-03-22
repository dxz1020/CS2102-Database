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

  if(!isset($_GET['type'])) http_response_code(400);

  switch($_GET['type']){
    case 'buy': processPurchase(); break;
    case 'rent': processRent(); break;
    case 'history': getTransactionHistory(); break;
    default: http_response_code(400); break;
  }
?>
