<?php
  /* login.php
   * Handles login requests.
   */

  if($_SERVER['REQUEST_METHOD']!="POST"){
    http_response_code(400);
    exit(0);
  }

  $param_list = json_decode(file_get_contents("php://input"), true);
  if(!isset($param_list['email']) || !isset($param_list['password'])){
    http_response_code(400);
    exit(0);
  }

  //Use SHA1 hashing for password when implementing login and new user
  $email = $param_list['email'];
  $password = $param_list['password'];

  putenv("ORACLE_HOME=/oraclient");
  $dbuser = "a0110781";
  $dbpassword = "Nana7Nana";
  $dbinfo = "(DESCRIPTION = (ADDRESS_LIST = (
      ADDRESS = (PROTOCOL = TCP)(HOST = sid3.comp.nus.edu.sg)(PORT = 1521))
    )(CONNECT_DATA = (SERVICE_NAME = sid3.comp.nus.edu.sg)))";

  //Connect to database
  $dbh = oci_connect($dbuser, $dbpassword, $dbinfo);
  if(!$dbh){
    http_response_code(503);
    exit(1);
  }

  $query = "SELECT * FROM Accounts WHERE email=:email AND password=:password";
  $stmt = oci_parse($dbh, $query);
  oci_bind_by_name($stmt, ":email", $email);
  oci_bind_by_name($stmt, ":password", $password);
  oci_execute($stmt);

  if($row = oci_fetch_assoc($stmt)){
    session_start();
    $_SESSION['email'] = $row['EMAIL'];
    $_SESSION['username'] = $row['USERNAME'];
    $_SESSION['admin'] = $row['ADMIN'];
    echo $_SESSION['email'];
  } else
    echo 0;

  oci_free_statement($stmt);

  oci_close($dbh);
?>
