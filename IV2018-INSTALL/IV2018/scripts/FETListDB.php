<?php
   
$directories = glob('../../FILES/FET' . '/*', GLOB_ONLYDIR);

foreach ($directories as $dir) {
    $bndir = basename($dir);
    echo("<option value='$bndir'>$bndir</option>");
}

?>