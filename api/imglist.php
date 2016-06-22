<?php
	$dir = "../img/" ;

    static $imgnamelist;

	if( is_dir( $dir ) && $handle = opendir( $dir ) ) {
		while( ($file = readdir($handle)) !== false ) {
			if( filetype( $path = $dir . $file ) == "file" ) {
                $imgnamelist[] = "./img/".$file;
            }
        }
    }

    echo json_encode($imgnamelist);
?>