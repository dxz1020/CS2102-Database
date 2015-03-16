<?php
  /* logout.php
   * Handles logout requests.
   */

  if(session_status()==PHP_SESSION_ACTIVE){
    echo "Logging out...";
    unset($_SESSION['email']);
    unset($_SESSION['username']);
    unset($_SESSION['admin']);
    session_destroy();
  }
  header("Location: http://cs2102-i.comp.nus.edu.sg/~a0110781/");
?>
