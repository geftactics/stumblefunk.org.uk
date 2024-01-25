<?php

include("inc/header.php");

$g = $database->get("groups", [
    "guid",
    "group_name",
    "adults",
    "kids",
    "vehicles"
], [
    "guid" => $_GET[g]
]);

?>

<div class="container">

  <h2>Adult Ticket</h2>
  <div class="alert alert-info" role="alert">
    When arriving on site, ID will be required in order to obtain your ticket - So please ensure that names are entered and spelt correctly!
  </div>

  <form action="add_adult_do.php" class="card-header alert-dark" method="POST">

    <div class="form-group row">
      <div class="form-group col-md-6 col-xs-12">
        <label for="first_name">First Name</label>
        <input class="form-control" type="text" name="first_name" id="first_name" required>
      </div>
      <div class="form-group col-md-6 col-xs-12">
        <label for="last_name">Last Name</label>
        <input class="form-control" type="text" name="last_name" id="last_name" required>
      </div>
    </div>

    <div class="form-group row">
      <div class="form-group col-md-6 col-xs-12">
        <label for="mobile">Mobile Phone</label>
        <input class="form-control" type="tel" name="mobile" id="mobile" pattern="[0-9]{11}" title="UK mobile number, no spaces" required>
      </div>
      <div class="form-group col-md-6 col-xs-12">
        <label for="email">Email Address</label>
        <input class="form-control" type="email" name="email" id="email" required>
      </div>
    </div>

    <div class="form-group row">
      <div class="form-group col-6">
        <a href="tickets.php" class="btn btn-sm btn-outline-dark"><i class="fa fa-mail-reply"></i> Back</a>
      </div>
      <div class="form-group col-6 text-right">
        <button type="submit" class="btn btn-sm btn-outline-dark"><i class="fa fa-edit"></i> Save</button>
      </div>
    </div>
  </form>

</div>


<?php include("inc/footer.php") ?>

