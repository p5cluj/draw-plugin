<?php
include 'csv.php';

/**
* 
*/
class csvToSvg extends CSV
{
	private $svgElems;
	private $svgBody;

	function __construct()
	{
			
	}

	public function generateSvgElement (){
		$postData = array();
		ini_set('auto_detect_line_endings',TRUE);
				$handle = fopen($_FILES["file"]["tmp_name"],'r');
				 while ( ($data = fgetcsv($handle) ) !== FALSE ) {
					$postData[] = $data;	
				}
		ini_set('auto_detect_line_endings',FALSE);
		 foreach ($postData as $key) {
                switch ($key[0]) {
                    case 'circle':
                        $this->svgElems .= '<circle cx="'.$key[1].'" cy="'.$key[2].'" r="'.$key[5].'" stroke="green" stroke-width="4" fill="'.$key[6].'" />';
                        break;

                        case 'line':
                        $this->svgElems .= '<line x1="'.$key[1].'" y1="'.$key[2].'" x2="'.$key[3].'" y2="'.$key[4].'" style="stroke:'.$key[6].';stroke-width:2" />';
                            
                        break;
                    
                    
                }
            }
	}

	public function generateSvgContainer (){

		return '<svg width="'.$this->_Width.'" height="'.$this->_Height.'">';
		
	}

	public function generateSvg (){
		$this->svgOutput 	= $this->generateSvgContainer();
		$this->svgOutput 	.= $this->svgElems;
		$this->svgOutput 	.= "</svg>";
	}

	public function getSvg()
	{
		return $this->svgOutput;
	}

}