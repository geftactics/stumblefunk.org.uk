<?php include("inc/header.php") ?>

<div class="container">
  <h2>Group Management</h2>
  <p><a href="add_group_do.php" class="btn btn-sm btn-outline-dark"><i class="fa fa-plus"></i> Add New Group</a></p>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Collective</th>
        <th>Adults</th>
        <th>Kids</th>
        <th>Vehicles</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
<?php

$groups = $database->select("groups", [
    "guid",
    "group_name",
    "adults",
    "kids",
    "vehicles"
], [
    "ORDER" => ["group_name"]
]);

foreach($groups as $g)
{
    $adults = $database->count("tickets", [
        "guid" => $g[guid],
        "ticket_type" => "a"
    ]);
    $kids = $database->count("tickets", [
        "guid" => $g[guid],
        "ticket_type" => "k"
    ]);
    $vehicles = $database->count("tickets", [
        "guid" => $g[guid],
        "ticket_type" => "v"
    ]);

    echo "      <tr>";
    echo "        <td>" . $g["group_name"] . "</td>";

    if ($adults == $g["adults"]) $pillColor = "badge-success";
    elseif ($adults == 0) $pillColor = "badge-secondary";
    else $pillColor = "badge-primary";
    echo "        <td><span class=\"badge badge-pill $pillColor\">$adults / " . $g["adults"] . "</span></td>";

    if ($kids == $g["kids"]) $pillColor = "badge-success";
    elseif ($kids == 0) $pillColor = "badge-secondary";
    else $pillColor = "badge-primary";
    echo "        <td><span class=\"badge badge-pill $pillColor\">$kids / " . $g["kids"] . "</span></td>";

    if ($vehicles == $g["vehicles"]) $pillColor = "badge-success";
    elseif ($vehicles == 0) $pillColor = "badge-secondary";
    else $pillColor = "badge-primary";
    echo "        <td><span class=\"badge badge-pill $pillColor\">$vehicles / " . $g["vehicles"] . "</span></td>";

    echo "        <td><a href=\"edit_group.php?guid=" . $g["guid"] . "\" class=\"btn btn-sm btn-outline-dark\"><i class=\"fa fa-edit\"></i> Edit</a>";
    echo "        <a href=\"delete_group_do.php?guid=" . $g["guid"] . "\" class=\"btn btn-sm btn-outline-dark\"  onclick=\"return confirm('This will remove the group and any tickets that have been created by the group! Are you sure?')\"><i class=\"fa fa-trash\"></i> Delete</a>";
    echo "        <a href=\"group_login_do.php?guid=" . $g["guid"] . "\" class=\"btn btn-sm btn-outline-dark\"><i class=\"fa fa-user\"></i> Login</a></td>";
    echo "      </tr>";
}
?>


    </tbody>
  </table>
</div>

<?php include("inc/footer.php") ?>

