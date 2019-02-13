<?php include("inc/header.php") ?>

<div class="container">
  <h2>List of tickets</h2>
  <input class="form-control" id="myInput" type="text" placeholder="Search..."><br/>
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Collective</th>
        <th>Name</th>
        <th>Type</th>
        <th>Email</th>
        <th>Mobile</th>
      </tr>
    </thead>
    <tbody id="myTable">
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
  $tickets = $database->select("tickets", [
      "guid",
      "first_name",
      "last_name",
      "ticket_type",
      "mobile",
      "email"
  ], [
      "guid" => $g[guid],
      "ORDER" => ["first_name"]
  ]);

  foreach($tickets as $t)
  {
    if ($t[ticket_type]=='a') $type='Adult';
    if ($t[ticket_type]=='k') $type='Child';
    if ($t[ticket_type]=='v') continue;
    echo "      <tr>";
    echo "        <td>$g[group_name]</td>";
    echo "        <td>$t[first_name] $t[last_name]</td>";
    echo "        <td>$type</td>";
    echo "        <td>$t[email]</td>";
    echo "        <td>$t[mobile]</td>";
    echo "      </tr>";
  }
}
?>


    </tbody>
  </table>
</div>

<script>
$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
</script>

<?php include("inc/footer.php") ?>

