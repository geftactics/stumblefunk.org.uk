<?php

include("config.php");

$_SESSION[user] = $_GET[guid];
header("Location: tickets.php");

?>

