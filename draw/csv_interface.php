<?php
interface csvInterface {
	
	public function moveFirst ($file);
	public function moveLast($file);
	public function moveNext ($file);
	public function movePrev ($file);
	public function getRow ($file,$rowNumber);
	public function deleteRow ($file,$rowNo);
	public function appendRow ($row);
	public function getCsv ($file);
	public function getCsvName ();
	public function setCsvName ($name);
}