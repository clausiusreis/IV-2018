<?php

$ID = "";
if (isset($_REQUEST['ID'])) {
    $ID = $_REQUEST['ID'];
    
    $files1 = glob("../../FILES/FET/$ID/*.{wav,flac}", GLOB_BRACE);
    
    $files2 = glob("../../FILES/FET/$ID/Extraction/AudioFeatures/*.{csv}", GLOB_BRACE);

    $percent = (sizeof($files2)*100)/sizeof($files1);
    echo $percent;

};

?>