<?php

$ID = "";
if (isset($_REQUEST['dbname'])) {
    $dbname = $_REQUEST['dbname'];
    
    $files = glob("../../FILES/FET/".$dbname."/*.{flac,wav,mp3}", GLOB_BRACE);

    $j = 0;
    foreach ($files as $file) {
        $value = basename($file);
        echo("<option value='$value'>$value</option>");
    }

};

?>