<?php
  /* login.php
   * Handles login requests.
   */
  define('BASEURL', 'http://cs2102-i.comp.nus.edu.sg/~a0110781/');

  if($_SERVER['REQUEST_METHOD']!="POST" ||
	$_SERVER['CONTENT_TYPE']!='application/json'){
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
  $dbuser = "a0110781";		//Your own account
  $dbpassword = "Nana7Nana";	//Change to appropriate password
  $dbinfo = "(DESCRIPTION = (ADDRESS_LIST = (
      ADDRESS = (PROTOCOL = TCP)(HOST = sid3.comp.nus.edu.sg)(PORT = 1521))
    )(CONNECT_DATA = (SERVICE_NAME = sid3.comp.nus.edu.sg)))";

  //Connect to database
  $dbh = oci_connect($dbuser, $dbpassword, $dbinfo);
  if(!$dbh){
    http_response_code(503);
    exit(0);
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
    if($_SESSION['admin']!='Y') header('Location: '.BASEURL);
    else header('Location: '.BASEURL.'adminPages/index.html');
  } else
    echo 0;

  oci_free_statement($stmt);
  oci_close($dbh);
?>
