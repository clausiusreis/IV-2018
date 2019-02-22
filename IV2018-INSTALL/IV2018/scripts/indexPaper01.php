<?php
    include_once("../includes/frameSmarty.class.php");
    include_once("../classes/soundscape.class.php");    

    $soundscape = new soundscape();
    
    $action = "";
    $soundscapedb = "";
    if (isset($_REQUEST['action'])) {
        $action = $_REQUEST['action'];
        $soundscapedb = $_REQUEST['soundscapedb'];
    };
    
    if ($action == "upload") {
        if ($soundscapedb != "") {

            $max_size = 1024*20000;
            $extensions = array('png', 'wav', 'flac');
            $dir = '../../FILES/NMF';
            $count = 0;

            if (!is_dir("$dir/")) {
                mkdir("$dir", 0755, true);
            }
            
            foreach ( $_FILES['files']['name'] as $i => $name ) {
                // if file not uploaded then skip it
                if ( !is_uploaded_file($_FILES['files']['tmp_name'][$i]) ) {
                    continue;
                }

                // skip large files
                if ( $_FILES['files']['size'][$i] >= $max_size ) {
                    continue;
                }

                // skip unprotected files
                if( !in_array(pathinfo($name, PATHINFO_EXTENSION), $extensions) ) {
                    continue;
                }

                // now we can move uploaded files
                if (!is_dir("$dir/$soundscapedb/")) {
                    mkdir("$dir/$soundscapedb/", 0755, true);
                }
                
                if( move_uploaded_file($_FILES["files"]["tmp_name"][$i], "$dir/$soundscapedb/" . $name) ) {
                    $count++;
                }                
            }

            if ($count > 0) {                
                $soundscape->extractNMF(1024, 10, 1.0, 0.0, "$dir/$soundscapedb");
                
                $soundscape->extractSpectrograms(0, 'hot', 2048, "$dir/$soundscapedb", 10000, 50, 'linear');
                $soundscape->extractSpectrograms(0, 'hot', 2048, "$dir/$soundscapedb/NMF", 10000, 50, 'linear');
                
                $soundscape->extractFeatures("$dir/$soundscapedb", "$soundscapedb");
                $soundscape->extractFeatures("$dir/$soundscapedb/NMF", "$soundscapedb");
            }
        } else {
            $smarty->assign("warning", "PLEASE ADD THE SOUNDSCAPE DB NAME");
        }
    }

    $soundscapedblist = [];
    $fileslist = [];    
    $directories = glob('../../FILES/NMF' . '/*', GLOB_ONLYDIR);    
    $i = 0;
    foreach ($directories as $dir) {
        $soundscapedblist[$i]['ID'] = $i;
        $soundscapedblist[$i]['name'] = basename($dir);        
        $files = glob("../../FILES/NMF/".basename($dir)."/*.{wav}", GLOB_BRACE);
        $j = 0;
        foreach ($files as $file) {
            $fileslist[$i][$j]['name'] = basename($file);
            $j++;
        }
        
        $i++;
    }
    $smarty->assign('soundscapedblist', $soundscapedblist);

    $smarty->assign('fileslist', $fileslist);
    
    $smarty->display('indexPaper01.tpl');    
?>