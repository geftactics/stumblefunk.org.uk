<?php

include("config.php");

$database->update("groups", [
    "group_name" => $_POST[group_name],
    "kids" => $_POST[kids],
    "adults" => $_POST[adults],
    "vehicles" => $_POST[vehicles],
], [
    "guid" => $_POST[guid]
]);

header("Location:groups.php");

?>

