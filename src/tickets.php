<?php

include("inc/header.php");

$g = $database->get("groups", [
    "guid",
    "group_name",
    "adults",
    "kids",
    "vehicles"
], [
    "guid" => $_SESSION[user]
]);

$adults = $database->select("tickets", [
    "id",
    "first_name",
    "last_name"
], [
    "ticket_type" => "a",
    "guid" => $_SESSION[user],
    "ORDER" => ["first_name"]
]);

$kids = $database->select("tickets", [
    "id",
    "first_name",
    "last_name"
], [
    "ticket_type" => "k",
    "guid" => $_SESSION[user],
    "ORDER" => ["first_name"]
]);

$vehicles = $database->select("tickets", [
    "id",
    "vehicle_reg"
], [
    "ticket_type" => "v",
    "guid" => $_SESSION[user],
    "ORDER" => ["vehicle_reg"]
]);

?>

<div class="container">
  <h2><?= $g[group_name]?> - Ticket Management</h2>
  <p>Hi there! We've allocated you some tickets, please assign them to people so the we can get you on the correct guest lists...</p>


<div class="row">
  <div class="col-md-4">
    <div class="card bg-light border-info" style="margin-bottom:20px">
      <div class="card-header bg-info text-white"><i class="fa fa-2x fa-drivers-license-o" style="vertical-align: sub; margin-right:8px"></i> Adults (<?= sizeof($adults) ?> of <?= $g[adults] ?>)</div>
      <div class="card-body" style="min-height: 100px">
        <p class="card-text">
<?php
foreach($adults as $a)
  echo "&bull; $a[first_name] $a[last_name] <a href='remove_ticket.php?id=$a[id]' title='Remove'><small><i class='fa fa-window-close'></i></small></a><br/>";
if (sizeof($adults) < $g[adults] )
  echo "        <br/><a href='add_adult.php' class='btn btn-sm btn-outline-dark'><i class='fa fa-plus'></i> Add</a>";
?>
        </p>
      </div>
    </div>
  </div>
  <br>
  <div class="col-md-4">
    <div class="card bg-light border-info" style="margin-bottom:20px">
      <div class="card-header bg-info text-white"><i class="fa fa-2x fa-child" style="vertical-align: sub; margin-right:8px"></i> Kids (<?= sizeof($kids) ?> of <?= $g[kids] ?>)</div>
      <div class="card-body" style="min-height: 100px">
        <p class="card-text">
<?php
foreach($kids as $k)
  echo "&bull; $k[first_name] $k[last_name] <a href='remove_ticket.php?id=$k[id]' title='Remove'><small><i class='fa fa-window-close'></i></small></a><br/>";
if (sizeof($kids) < $g[kids] )
  echo "        <br/><a href='add_kids.php' class='btn btn-sm btn-outline-dark'><i class='fa fa-plus'></i> Add</a>";
?>
        </p>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card bg-light border-info" style="margin-bottom:20px">
      <div class="card-header bg-info text-white"><i class="fa fa-2x fa-car" style="vertical-align: sub; margin-right:8px"></i> Vehicles (<?= sizeof($vehicles) ?> of <?= $g[vehicles] ?>)</div>
      <div class="card-body" style="min-height: 100px">
        <p class="card-text">
<?php

foreach($vehicles as $v)
  echo "&bull; <big><span class='badge badge-warning'>$v[vehicle_reg]</span></big> <a href='remove_ticket.php?id=$v[id]' title='Remove'><small><i class='fa fa-window-close'></i></small></a><br/>";
if (sizeof($vehicles) < $g[vehicles] )
  echo "        <br/><a href='add_vehicle.php' class='btn btn-sm btn-outline-dark'><i class='fa fa-plus'></i> Add</a>";
?>
        </p>
      </div>
    </div>
  </div>
</div>



</div>

<?php include("inc/footer.php") ?>

