<?php

    include_once("../includes/frameSmarty.class.php");
    
    //Remove every analysis dir older than a day
    $directories = glob('../../FILES/analysis' . '/*', GLOB_ONLYDIR);
    $now = time();
    foreach ($directories as $dir) {
        $ft = filemtime($dir);
        if ($now - filemtime($dir) >= (60 * 60 * 24)) { // 1 day old
            array_map('unlink', glob("$dir/*.*"));
            rmdir($dir);
        }
    }
    
    $action = "";
    if (isset($_REQUEST['action'])) {
        $action = $_REQUEST['action'];        
    };
    
    if ($action == "upload") {
        $filename_data = $_REQUEST['dblist'];
        $filename_label = $_REQUEST['labels'];
        $numberOfClusters = 2; // Number of clusters (2->4 clusters, 3->5 clusters)
        $orderMethod = 6; // Ordering method
        $clusterOn = 1; // Cluster using the distance matrix (0) or Correlation Matrix (1)
        
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            $infoEmJSON = shell_exec("C:/Users/claus/Miniconda2/python.exe D:/Wamp64/www/DOUTORADO/DOUTORADO_Resultados/scripts/Python/radvizMatrix1.py ../../FILES/FET/$filename_data/Extraction/features_norm.csv $numberOfClusters $orderMethod $clusterOn $filename_label $filename_data");
        } else {
            $infoEmJSON = shell_exec("python ./Python/radvizMatrix1.py ../../FILES/FET/$filename_data/Extraction/features_norm.csv $numberOfClusters $orderMethod $clusterOn $filename_label $filename_data");
        }
       
        $smarty->assign('json', $infoEmJSON);
        $smarty->assign('status', $action);

    } else if ($action == 'change') {
        $dbName = $_REQUEST['dbName'];
        $dirName = $_REQUEST['dirName'];        

        $numberOfClusters = $_REQUEST['numberOfClusters']; // Number of clusters (2->4 clusters, 3->5 clusters)
        $orderMethod = $_REQUEST['orderMethod']; // Ordering method
        $clusterOn = $_REQUEST['clusterOn']; // Cluster using the distance matrix (0) or Correlation Matrix (1)
        $filenameAsLabel = (int)$_REQUEST['filenameAsLabel']; // If True remake the labels to match filename
            
        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {        
            $infoEmJSON = shell_exec("C:/Users/claus/Miniconda2/python.exe D:/Wamp64/www/DOUTORADO/DOUTORADO_Resultados/scripts/Python/radvizMatrix2.py $dirName $numberOfClusters $orderMethod $clusterOn $dbName $filenameAsLabel");
        } else {            
            $infoEmJSON = shell_exec("python ./Python/radvizMatrix2.py $dirName $numberOfClusters $orderMethod $clusterOn $dbName $filenameAsLabel");
        }
        
        $smarty->assign('json', $infoEmJSON);
        $smarty->assign('status', $action);
    }

    //List all database diretories (Even ones without extracted data)
    $num = 0;
    $soundscapedblist = [];
    $directories = glob('../../FILES/FET' . '/*', GLOB_ONLYDIR);
    foreach ($directories as $dir) {        
        $soundscapedblist[$num]['ID'] = basename($dir);        
        $soundscapedblist[$num]['name'] = basename($dir);
        $num++;
    }
    $smarty->assign('soundscapedblist', $soundscapedblist);    
    
    $smarty->assign('status', $action);  
    $smarty->display('indexFSDC.tpl');
?>