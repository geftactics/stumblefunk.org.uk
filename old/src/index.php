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
  <link rel="stylesheet" href="inc/index.css">
</head>
<body>

    <div class="container">
      <form class="form-signin" action="index_do.php" method="POST">
        <div style="text-align:center"><img src="img/SF-small.png" alt="Stumblefunk"></div>
        <br/><br/>

<?php
if ($_GET[e]==1)
  echo "        <h5 class='form-signin-heading' style='color:#ff6a58'>Invalid access code</h5>";
elseif ($_GET[e]==2)
  echo "        <h5 class='form-signin-heading' style='color:#ff6a58'>Accreditation has now closed</h5>";
else
  echo "        <h5 class='form-signin-heading text-white'>Please sign in</h5>";

?>
        <label for="guid" class="sr-only">Email address</label>
        <input type="password" name="guid" id="guid" class="form-control" placeholder="Access code" required autofocus><br/>
        <button class="btn btn-lg btn-secondary btn-block" type="submit">Sign in</button>
      </form>
    </div>

</body>
</html>
