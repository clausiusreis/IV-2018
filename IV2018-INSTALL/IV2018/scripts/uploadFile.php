<?php
session_start ();

$output_dir = $_SESSION ['outputdir'];

if (isset ( $_FILES ["uploadFilesDB"] )) {
	$ret = array ();
	
	$error = $_FILES ["uploadFilesDB"] ["error"];
	{
		
		if (! is_array ( $_FILES ["uploadFilesDB"] ['name'] )) // single file
{
			$fileName = $_FILES ["uploadFilesDB"] ["name"];
			move_uploaded_file ( $_FILES ["uploadFilesDB"] ["tmp_name"], $output_dir . $_FILES ["uploadFilesDB"] ["name"] );
			echo "<br> Filename: " . $fileName;
			
			$ret [$fileName] = $output_dir . $fileName;
		} else {
			$fileCount = count ( $_FILES ["uploadFilesDB"] ['name'] );
			for($i = 0; $i < $fileCount; $i ++) {
				$fileName = $_FILES ["uploadFilesDB"] ["name"] [$i];
				$ret [$fileName] = $output_dir . $fileName;
				move_uploaded_file ( $_FILES ["uploadFilesDB"] ["tmp_name"] [$i], $output_dir . $fileName );
			}
		}
	}
	echo json_encode ( $ret );
}

?>
