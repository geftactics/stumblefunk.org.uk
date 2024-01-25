<?php

	include("config.php");

	$filename = "stumblefunk-accreditation-" . date("d-m-Y") . ".sql.gz";

	header("Content-Type: application/x-gzip");
	header('Content-Disposition: attachment; filename="' . $filename . '"' );

	$cmd = "mysqldump -h " . getenv('DB_HOST') . " -u " . getenv('DB_USER') . " --password=" . getenv('DB_PASS') . " " . getenv('DB_NAME') . " | gzip --best";

	passthru($cmd);

	exit(0);

?>
