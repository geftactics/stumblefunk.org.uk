<?php

include("config.php");

$database->insert("groups", [
    "kids" => "0",
    "adults" => "0",
    "vehicles" => "0",
    "guid" => uniqid()
]);

$id = $database->id();

$g = $database->get("groups", [
    "guid"
    ], [
    "id" => $id
]);

header("Location: edit_group.php?guid=$g[guid]");

?>

