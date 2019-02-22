<?php

include_once("../classes/CSVImporter.class.php");


$ID = "";
if (isset($_REQUEST['ID'])) {
    $ID = $_REQUEST['ID'];
    
    $importer = new CSVImporter("../../FILES/NMF/".$ID."/Extraction/".$ID.".csv",true); 
    $header = $importer->getHeader();
    
    $pos = 0;
    foreach ($header as $feat) {
        if ($pos >= 4) {
            echo("<option value='$feat'>$feat</option>");            
        }
        $pos++;
    }

};

?>