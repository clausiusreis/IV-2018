<?php

$ID = "";
if (isset($_REQUEST['ID'])) {
    $ID = $_REQUEST['ID'];
    
    $directories = glob('../../FILES/NMF' . '/*', GLOB_ONLYDIR);
    $dir = basename($directories[$ID]);

    $files = glob("../../FILES/NMF/".$dir."/*.{wav}", GLOB_BRACE);

    $j = 0;
    foreach ($files as $file) {
        $value = basename($file);
        echo("<option value='$value'>$value</option>");
    }

};

?>