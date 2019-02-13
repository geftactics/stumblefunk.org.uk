<?php

include("config.php");

// Remove record
$database->delete("tickets", [
    "guid" => $_SESSION[user],
    "id" => $_GET[id]
]);

// Update activity timer
 $database->update("groups", [
    "last_action" => date("Y-m-d H:i:s"),
], [
    "guid" => $_SESSION[user]
]);

// Back to main screen
header("Location: tickets.php");

?>

