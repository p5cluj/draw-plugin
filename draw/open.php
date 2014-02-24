<?php
include "csvToSvg.php";
$_svgDraw = new csvToSvg();
if(isset($_REQUEST['submit']) && $_REQUEST['submit']=='submit'){
	if ( isset($_FILES["file"])) {

            //if there was an error uploading the file
        if ($_FILES["file"]["error"] > 0) {
            echo "Return Code: " . $_FILES["file"]["error"] . "<br />";

        }
        else {
            $_svgDraw->getCsvName();
            $_svgDraw->generateSvgElement();
            $_svgDraw->generateSvg();
            echo $_svgDraw->getSvg();          
        }
     } else {
             echo "No file selected <br />";
     }
}
