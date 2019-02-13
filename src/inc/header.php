<?php include("config.php"); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Stumblefunk</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
</head>
<body>

<nav class="navbar navbar-expand-sm bg-dark navbar-dark">
  <!-- Brand/logo -->
  <a class="navbar-brand" href="#">
    <img src="img/SF-small.png" alt="logo" styled="width:40px;">
  </a>

  <ul class="navbar-nav ml-auto">
<?php
  if ($_SESSION[user]=='manage') {
?>
    <li class="nav-item">
      <a class="nav-link" href="groups.php">Groups</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="totals.php">Totals</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="list_tickets.php">Tickets List</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="list_vehicles.php">Vehicle List</a>
    </li>
<?php } ?>
    <li class="nav-item">
      <a class="nav-link" href="logout.php">Logout</a>
    </li>
  </ul>

</nav>

<p>

