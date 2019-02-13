<?php

include("config.php");

// Get total tickets already used
$count = $database->count("tickets", [
    "guid" => $_SESSION[user],
    "ticket_type" => "v"
]);

// get group data
$g = $database->get("groups", [
    "guid",
    "group_name",
    "adults",
    "kids",
    "vehicles"
], [
    "guid" => $_SESSION[user]
]);



if ($count < $g[vehicles]) {

  // Add record
  $database->insert("tickets", [
      "first_name" => ucfirst($_POST[first_name]),
      "last_name" => ucfirst($_POST[last_name]),
      "mobile" => $_POST[mobile],
      "email" => $_POST[email],
      "vehicle_pass" => $_POST[vehicle_pass],
      "vehicle_reg" => strtoupper($_POST[vehicle_reg]),
      "ticket_type" => "v",
      "last_action" => date("Y-m-d H:i:s"),
      "guid" => $_SESSION[user]
  ]);

  // Update activity timer
  $database->update("groups", [
      "last_action" => date("Y-m-d H:i:s"),
  ], [
      "guid" => $_SESSION[user]
  ]);

}

// Back to main screen
header("Location:tickets.php?g=$_SESSION[user]");

?>

