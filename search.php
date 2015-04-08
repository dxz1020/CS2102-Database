<?php
  /* search.php
   * This script handles request to search for digital store content.
   */

  putenv("ORACLE_HOME=/oraclient");
  $dbuser = "a0110781";		//Change to your own account
  $dbpassword = "Nana7Nana";	//Change to appropriate password
  $dbinfo = "(DESCRIPTION = (ADDRESS_LIST = (
      ADDRESS = (PROTOCOL = TCP)(HOST = sid3.comp.nus.edu.sg)(PORT = 1521))
    )(CONNECT_DATA = (SERVICE_NAME = sid3.comp.nus.edu.sg)))";

  //Connect to database
  $dbh = oci_connect($dbuser, $dbpassword, $dbinfo);
  if(!$dbh){
    http_response_code(503);
    exit(1);
  }

  $param_array = array(); //The array of conditionals for query statement
  if(isset($_GET['title']))
    array_push($param_array, "title LIKE '%".$_GET['title']."%'");
  if(isset($_GET['category']))
    array_push($param_array, "category='".$_GET['category']."'");
  if(isset($_GET['genre']))
    array_push($param_array, "genre='".$_GET['genre']."'");
  if(isset($_GET['device']))
    array_push($param_array, "device='".$_GET['device']."'");
  $param_count = count($param_array);

  $query = "SELECT I.item_id, I.title, I.category, I.genre, I.device, I.release_date, I.price, I.rent_price, CASE WHEN L.likes IS NULL THEN 0 ELSE L.likes END AS likes FROM Item I LEFT JOIN (SELECT item, COUNT(*) AS likes FROM Likes GROUP BY item) L ON L.item=I.item_id";

  if($param_count>0){ //Complete the query with search filters
    $query.=" WHERE ".$param_array[0];
    for($i=1; $i<$param_count; $i++)
      $query.=" AND ".$param_array[$i];
  }

  if(isset($_GET['sortby'])){ //Adds ordering element to the search query
    $query.=" ORDER BY ".$_GET['sortby'];
    if($_GET['sortby']=="likes")
      $query.=" DESC";
  } else
    $query.=" ORDER BY likes DESC, category, genre, device, title";

  $stmt = oci_parse($dbh, $query);
  oci_execute($stmt);

  $res = array();
  while($row = oci_fetch_assoc($stmt))
    array_push($res, $row);
  
  oci_free_statement($stmt);

  echo json_encode($res);

  //Closes the database connection
  oci_close($dbh);
?>
