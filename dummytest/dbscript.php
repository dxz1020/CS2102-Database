<?php
  //$msg = $_GET['message'];
  //echo $msg;

  $dbuser = "a0110781";
  $dbpasswd = "Nana7Nana";
  $dbinfo = "(DESCRIPTION=(ADDRESS_LIST=
    (ADDRESS=(PROTOCOL=TCP)(HOST=sid3.comp.nus.edu.sg)(PORT=1521))
    )(CONNECT_DATA=(SERVICE_NAME=sid3.comp.nus.edu.sg)))";

  putenv('ORACLE_HOME=/oraclient');
  $dbh = ocilogon($dbuser, $dbpasswd, $dbinfo);

  $query = "SELECT modulecode FROM Modules";
  $stmt = oci_parse($dbh, $query);
  oci_execute($stmt, OCI_DEFAULT);

  $res = "";
  while($row = oci_fetch_array($stmt)){
    $res.=$row[0]."<br>";
  }

  oci_free_statement($stmt);

  echo $res;

  oci_close($dbh);
?>
