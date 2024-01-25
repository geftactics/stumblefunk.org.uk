<?php

include("inc/header.php");

$g = $database->get("groups", [
    "guid",
    "group_name",
    "adults",
    "kids",
    "vehicles"
], [
    "guid" => $_GET[guid]
]);

?>

<div class="container">
  <h2>Edit Group</h2>
  <p>Access Code: <span class="badge badge-secondary"><?= $_GET[guid] ?></span></p>
  <form action="edit_group_do.php" class="card-header alert-dark" method="POST">
    <div class="form-group">
      <label for="exampleInputEmail1">Group Name</label>
      <input class="form-control" type="text" name="group_name" value="<?= $g[group_name] ?>" id="example-text-input" required>
      <input type="hidden" name="guid" value="<?= $g[guid] ?>">
    </div>
    <div class="form-group row">
      <div class="form-group col-4">
        <label for="example-text-input" class="col-form-label">Adults</label>
        <select class="form-control" name="adults">
<?php
$count = $database->count("tickets", [
    "guid" => $_GET[guid],
    "ticket_type" => "a"
]);

for ($x = $count; $x <= 15; $x++)
  if ($g[adults]==$x)
    echo "<option value='$x' selected>$x</option>";
  else
    echo "<option value='$x'>$x</option>";

?>
        </select>
      </div>
      <div class="form-group col-4">
        <label for="example-text-input" class="col-form-label">Kids</label>
        <select class="form-control" name="kids">
<?php
$count = $database->count("tickets", [
    "guid" => $_GET[guid],
    "ticket_type" => "k"
]);

for ($x = $count; $x <= 15; $x++)
  if ($g[kids]==$x)
    echo "<option value='$x' selected>$x</option>";
  else
    echo "<option value='$x'>$x</option>";

?>
        </select>
      </div>
      <div class="form-group col-4">
        <label for="example-text-input" class="col-form-label">Vehicles</label>
        <select class="form-control" name="vehicles">
<?php
$count = $database->count("tickets", [
    "guid" => $_GET[guid],
    "ticket_type" => "v"
]);

for ($x = $count; $x <= 15; $x++)
  if ($g[vehicles]==$x)
    echo "<option value='$x' selected>$x</option>";
  else
    echo "<option value='$x'>$x</option>";

?>
        </select>
      </div>
    </div>
    <div class="form-group row">
      <div class="form-group col-6">
        <a href="groups.php" class="btn btn-sm btn-outline-dark"><i class="fa fa-mail-reply"></i> Back</a>
      </div>
      <div class="form-group col-6 text-right">
        <button type="submit" class="btn btn-sm btn-outline-dark"><i class="fa fa-edit"></i> Save</button>
      </div>
    </div>
  </form>

</div>


<?php include("inc/footer.php") ?>

