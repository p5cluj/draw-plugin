<?php
require_once 'csv_interface.php';
class CSV implements csvInterface
{
		
	CONST DELIMITER_COL = ",";
	CONST DELIMITER_ROW = "\n";

	protected $_Csv = array();
	protected $_CursorPosition = 0;
	protected $_Title = "";
	protected $_Width = 0;
	protected $_Height = 0;

	function __construct($strCsv)
	{
		$this->postData($strCsv);		
	}

	public static function loadFromFile ( $path ){
		new CSV($path);
	}

	public function postData($dataValues)
	{
		$title = implode(explode(' ', $dataValues['title']),'^');
		$csvName = $title."_".$dataValues['width']."_x_".$dataValues['height'];
		
		$csvFile = fopen('php://memory', 'w');
		foreach ($dataValues['objects'] as $key =>$values) {
			fputcsv($csvFile, $values, CSV::DELIMITER_COL, CSV::DELIMITER_ROW);
		}
		
		fseek($csvFile, 0);
		header('Content-Type: application/csv');
		header('Content-Disposition: attachment; filename='.$csvName.'.csv;');
		fpassthru($csvFile);
	}

	public function moveFirst ($filename){
		$file = fopen($filename,"r");
		fgets($file);
		fseek($file,0);
		$this->_CursorPosition = ftell($file);
	}

	public function moveLast($filename){
		$file = fopen($filename,"r");
		fgets($file);
		fseek($file, -1, SEEK_END);
		$this->_CursorPosition = ftell($file);
	}

	public function moveNext ($filename){

	}

	public function movePrev ($filename){
		$file = fopen($filename,"r");
		fgets($file);
		rewind($file);
		$this->_CursorPosition = ftell($file);
	}

	public function getRow ($csvfile,$rowNumber){
		$handle = fopen($csvfile,'r');
		while ( ($data = fgetcsv($handle) ) !== FALSE ) {
					$postData[] = $data;	
				}
			$index = $rowNumber-1;
		return $postData[$index];
	}

	public function deleteRow ($filename,$rowToDelete){
		
		if (($handle = fopen($filename, "r")) !== FALSE) {
		    while (($csvdata = fgetcsv($handle, 0, ",")) !== FALSE) {      
			   $data[] = $csvdata;
		    }
		    fclose($handle);
			unset($data[$rowToDelete]);
		}
		$file = fopen($filename, 'w');
		foreach ($data as $fields) {
		    fputcsv($file, $fields);
		}
		fclose($file);
	}

	public function appendRow ($row){

	}

	public function getCsv ($filename){

	}

	public function getCsvName (){
		$filename = explode('.', $_FILES["file"]['name']);
        $_file = explode('_', $filename[0]);
        $this->_Title 	= $_file[0];
        $this->_Width 	= $_file[1];
        $this->_Height 	= $_file[3];
	}

	public function setCsvName ($name){
		$this->csvName = $name;
	}

}