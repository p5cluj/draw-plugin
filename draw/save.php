<?php
include 'csv.php';


$output = array();
parse_str($_POST['objects'], $output);


//$json = '{"title":"mydraw","width":"350","height":"400","objects":[{"type":"circle","x1":50,"y1":50,"x2":"","y2":"","radius":15,"color":"#000000"}]}';
//$a = new CSV($json);
CSV::loadFromFile($output);
?>
