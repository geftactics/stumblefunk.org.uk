<?php

error_reporting(E_ERROR | E_PARSE);

session_start();

if ($_SERVER[PHP_SELF] != '/index.php' && $_SERVER[PHP_SELF] != '/index_do.php') {
  if (!isset($_SESSION['user'])) {
    header("Location: /");
    exit();
  }
}

require  'Medoo.php';
use Medoo\Medoo;

$database = new Medoo([
    'database_type' => 'mysql',
    'database_name' => getenv('DB_NAME'),
    'server' => getenv('DB_HOST'),
    'username' => getenv('DB_USER'),
    'password' => getenv('DB_PASS'),
]);


?>
