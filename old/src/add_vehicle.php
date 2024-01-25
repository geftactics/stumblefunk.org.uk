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

  <h2>Vehicle Pass</h2>
  <form action="add_vehicle_do.php" class="card-header alert-dark" method="POST">

    <div class="form-group row">
      <div class="form-group col-md-6 col-xs-12">
        <label for="vehicle_reg">Vehicle Registration</label>
        <input class="form-control" type="text" name="vehicle_reg" id="vehicle_reg" pattern="[A-Za-z0-9]{2,7}" title="Vehicle registraion, no spaces" maxlength="7" required>
      </div>
      <div class="form-group col-md-6 col-xs-12">
        <label for="vehicle_pass">Pass Type</label>
        <select class="form-control" name="vehicle_pass">
          <option value="parking" selected>Crew parking</option>
          <option value="camping">Crew camping (Campervans only)</option>
          <option value="onsite">On-Site Access</option>
        </select>
      </div>
    </div>

    <div class="form-group row">
      <div class="form-group col-md-6 col-xs-12">
        <label for="first_name">Drivers First Name</label>
        <input class="form-control" type="text" name="first_name" id="first_name" required>
        <input type="hidden" name="guid" value="<?= $g[guid] ?>">
      </div>
      <div class="form-group col-md-6 col-xs-12">
        <label for="last_name">Drivers Last Name</label>
        <input class="form-control" type="text" name="last_name" id="last_name" required>
      </div>
    </div>

    <div class="form-group row">
      <div class="form-group col-md-6 col-xs-12">
        <label for="mobile">Drivers Mobile Phone</label>
        <input class="form-control" type="tel" name="mobile" id="mobile" pattern="[0-9]{11}" title="UK mobile number, no spaces" required>
      </div>
      <div class="form-group col-md-6 col-xs-12">
        <label for="email">Drivers Email Address</label>
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

