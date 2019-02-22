<?php
    // Feature Extraction Tool (WEB)

    include_once("../includes/frameSmarty.class.php");
    include_once("../classes/soundscape.class.php");
    
    $soundscape = new soundscape();
    
    $action = "";
    $soundscapedb = "";
    if (isset($_REQUEST['action'])) {
        $action = $_REQUEST['action'];
        $soundscapedb = $_REQUEST['soundscapedb'];
    };
    
    $smarty->display('indexFET1.tpl');
?>