<?php

include("config.php");

if ($_POST[guid] == getenv('DB_PASS')) {
  $_SESSION[user] = 'manage';
  header("Location: groups.php");
  exit();
}

// TEMP CLOSE
//header("Location: /?e=2");
//exit();

$count = $database->count("groups", [
    "guid" => $_POST[guid]
]);

if ($count==1) {

  $_SESSION[user] = $_POST[guid];

  $database->update("groups", [
      "last_action" => date("Y-m-d H:i:s"),
  ], [
      "guid" => $_POST[guid]
  ]);

  header("Location:tickets.php");

}

else {
  header("Location: /?e=1");
}

?>

