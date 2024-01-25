<?php

include("config.php");

$database->delete("tickets", [
    "guid" => $_GET[guid]
]);

$database->delete("groups", [
    "guid" => $_GET[guid]
]);

header("Location: groups.php");

?>

