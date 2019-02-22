<?php

session_start();

$dbname = $_REQUEST['dbname'];

$output_dir = "../../FILES/FET";

if (!is_dir("$output_dir/")) {
    mkdir("$output_dir", 0755, true);
}

if (!is_dir("$output_dir/$dbname")) {
    mkdir("$output_dir/$dbname", 0755, true);
}

$output_dir = "$output_dir/$dbname/";

$_SESSION['outputdir'] = $output_dir;

?>