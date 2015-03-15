<?php
  /* search.php
   * This script handles request to search for digital store content.
   */

  putenv("ORACLE_HOME=/oraclient");
  $dbuser = "a0110781";
  $dbpassword = "Nana7Nana";
  $dbinfo = "(DESCRIPTION = (ADDRESS_LIST = (
      ADDRESS = (PROTOCOL = TCP)(HOST = sid3.comp.nus.edu.sg)(PORT = 1521))
    )(CONNECT_DATA = (SERVICE_NAME = sid3.comp.nus.edu.sg)))";

  $dbh = oci_connect($dbuser, $dbpassword, $dbinfo);
  if(!$dbh){
    http_response_code(503);
    exit(1);
  }

  oci_close($dbh);
  echo $_GET['message'];
?>
