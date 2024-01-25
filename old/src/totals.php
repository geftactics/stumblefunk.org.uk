<?php

include("inc/header.php");

$adults_used = $database->count("tickets", [
    "ticket_type" => "a"
]);
$kids_used = $database->count("tickets", [
    "ticket_type" => "k"
]);
$vehicles_used = $database->count("tickets", [
    "ticket_type" => "v"
]);

$groups = $database->select("groups", [
    "adults",
    "kids",
    "vehicles"
]);


$adults_max = 0;
$kids_max = 0;
$vehicles_max = 0;

foreach($groups as $g)
{
  $adults_max += $g[adults];
  $kids_max += $g[kids];
  $vehicles_max += $g[vehicles];
}

?>

<div class="container">
<h2>Ticket totals</h2>
<br/>
<div class="row">
  <div class="col-sm-4">
    <div class="card">
      <div class="card-header">Adults</div>
      <div class="card-body">
        <p class="card-text"><h1 class="text-muted"><?= $adults_used ?> of <?= $adults_max ?></h1></p>
      </div>
    </div>
  </div>
  <div class="col-sm-4">
    <div class="card">
      <div class="card-header">Kids</div>
      <div class="card-body">
        <p class="card-text"><h1 class="text-muted"><?= $kids_used ?> of <?= $kids_max ?></h1></p>
      </div>
    </div>
  </div>
  <div class="col-sm-4">
    <div class="card">
      <div class="card-header">Vehicles</div>
      <div class="card-body">
        <p class="card-text"><h1 class="text-muted"><?= $vehicles_used ?> of <?= $vehicles_max ?></h1></p>
      </div>
    </div>
  </div>
</div>
</div>

<?php include("inc/footer.php") ?>

