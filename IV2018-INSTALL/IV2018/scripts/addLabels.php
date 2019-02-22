<?php
   
    $action = "";
    if (isset($_REQUEST['action'])) {
        $action = $_REQUEST['action'];
    };

    if ($action == "add") {
        $dbname = $_REQUEST['dbName1'];
        $dirname = $_REQUEST['dirName1'];
        $filename = $_REQUEST['fname1'];
        $labelsOriginal = explode(",", $_REQUEST['labels1']);
        $labelName = $labelsOriginal[0];
        $labelSamples = array_slice($labelsOriginal, 1);
                
        //Get the filenames to label a specific file
        $fnameList = "";
        $row = 0;
        if (($handle = fopen("$dirname/featureDataOriginal.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
                $fnameList[$row] = $data[0];                
                $row += 1;
            }
            fclose($handle);
        }
                
        $newData = "";
        $currentID = -1;
        $row = 0;
        $labelID = 0;
        if (($handle = fopen("$dirname/originalLabelsInput.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
                if ($currentID != $fnameList[$row]){
                    $currentID = $fnameList[$row];
                    $labelID = 0;
                }
                
                if ( ($filename == $fnameList[$row]) & (in_array($labelID, $labelSamples)) ){
                    $newData[$row] = [1,$labelName];
                } else {                    
                    if ($data[0] != "ID") {
                        $newData[$row] = [0,"none"];
                    } else {
                        $newData[$row] = $data;
                    }
                }                                  
                
                $labelID += 1;
                $row += 1;
            }
            fclose($handle);
        }
        
        $file = fopen("$dirname/originalLabelsInput.csv","w");
        foreach ($newData as $n){
            fputcsv($file,$n);
        }
    }

?>