<?php

include("config.php");

$_SESSION[user] = "";
session_unset();
session_destroy();

header("Location: /");

?>

