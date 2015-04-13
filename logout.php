<?php
  /* logout.php
   * Handles logout requests.
   */

  session_start();
  unset($_SESSION['email']);
  unset($_SESSION['username']);
  unset($_SESSION['admin']);
  session_destroy();
  
  header("Location: http://cs2102-i.comp.nus.edu.sg/~a0114906/");
?>
