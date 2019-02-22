<?php

$ID = "";
if (isset($_REQUEST['ID'])) {
    $ID = $_REQUEST['ID'];
    
    $files = glob("../../FILES/NMF/".$ID."/Extraction/*_none_*.{csv}", GLOB_BRACE);

    $j = 0;
    foreach ($files as $file) {
        $value = basename($file);
        echo("<option value=\"$value\">$value</option>");
    }

};

?>