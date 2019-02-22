<?php
   
    $action = "";
    if (isset($_REQUEST['action'])) {
        $action = $_REQUEST['action'];
    };    

    if ($action == "add") {
        $dbname = $_REQUEST['dbName2'];
        $dirname = $_REQUEST['dirName2'];
        $filename = $_REQUEST['fname2'];
        $feature = $_REQUEST['feature2'];
        $threshold = $_REQUEST['threshold2'];
        $tcond = $_REQUEST['tcond2'];
       
        $label = $feature."_".$tcond."_".number_format($threshold, 4, '.', '');
        
        //Get the current labels
        $currentLabels = "";
        $row = 0;
        $maxID = -1;
        $noneID = 0;
        if (($handle = fopen("$dirname/originalLabelsInput.csv", "r")) !== FALSE) {
            while(!feof($handle)) {
            
                $data = fgetcsv($handle, 0, ",");
                
                print_r($data[0]+" "$data[1]);

                $currentLabels[$row][0] = $data[0];
                $currentLabels[$row][1] = $data[1];
                $row += 1;
                if ($data[0] > $maxID){
                    $maxID = $data[0];
                }
                
                if ($data[1] == 'none'){
                    $noneID = $data[0];
                }
            }
            fclose($handle);
        }
        $maxID = $maxID + 1;             

        $newData = "";
         echo "<br>";
         echo "<br>";
        $currentID = "";
        $row = 0;
        $featureID = -1;
        if (($handle = fopen("../../FILES/FET/$dbname/Extraction/features_norm.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {

                if ($featureID == -1) {
                    for ($i=0; $i< count($data); $i++) {
                        if ($data[$i] == $feature) {
                            $featureID = $i;
                            break;
                        }
                    }
                }

                if (($currentID != $data[0]) & ($row > 0)){
                    $currentID += 1;
                }
                
                if ($row > 0) {
                    $featureValue = $data[$featureID];
                    if ($tcond == "Over"){
                        if ($featureValue >= $threshold) {
                            $newData[$row] = [$maxID,$label];
                        } else {
                            if ($currentLabels[$row][1] == 'none' | $currentLabels[$row][1] == $data[0])  {
                                $newData[$row] = [$noneID,"none"];
                            } else {
                                $newData[$row] = [$currentLabels[$row][0],$currentLabels[$row][1]];
                            }
                        }
                    } else {
                        if ($featureValue <= $threshold) {
                            $newData[$row] = [$maxID,$label];
                        } else {
                            if ($currentLabels[$row][1] == 'none' | $currentLabels[$row][1] == $data[0]) {
                                $newData[$row] = [$noneID,"none"];
                            } else {
                                $newData[$row] = [$currentLabels[$row][0],$currentLabels[$row][1]];
                            }
                        }
                    }
                }                                  
                
                $row += 1;
            }
            fclose($handle);


            $file = fopen("$dirname/originalLabelsInput.csv","w");
            fputcsv($file,["ID","description"]);
            foreach ($newData as $n){
                fputcsv($file,$n);
            }
            
        }

    }

?>
