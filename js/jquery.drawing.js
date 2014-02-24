// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var drawing = "drawing",
				defaults = {
				objects : []
		};

		// The actual plugin constructor
		function Drawing ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = drawing;
				this.init();
		}

		Drawing.prototype = {
				objects : [],
				init: function () {
						this.addNewButtonLogic();
						this.addOpenButtonLogic();
						//console.log("drawing plugin init method");
				},
				 /**
				*  Draw user created objects on svg element
				*  @param svg - svg root element
			    */
				drawIntro : function (svg){
					for (var i = 0; i < objects.length; i++) {
						var obj = objects[i];
						switch(obj.type){
							case "circle":
								svg.circle(obj.x1+100, obj.y1+100, obj.radius, {fill : obj.color});
							break;
							case "line":
								svg.line(obj.x1+100,obj.y1+100,obj.x2+100,obj.y2+100, {stroke : obj.color});
							break;
							default:
							break;
						}
					};
				},

					/**HTML5 CANVAS*/
				/**
				* Draw a circle to a specific canvas context
				*/
				drawCircle : function (object, ctx) {
				    ctx.beginPath();
				    ctx.arc(object.x1, object.y1, object.radius, 0, Math.PI * 2);
				    ctx.fillStyle = object.color;
				    ctx.fill();
				},
				
				/**
				* Draw a line to a specific canvas context
				*/
				drawLine : function (object, ctx) {
				    ctx.beginPath();
				    ctx.moveTo(object.x1, object.y1);
				    ctx.lineTo(object.x2, object.y2);
				    ctx.strokeStyle = object.color;
				    ctx.stroke();
				},

				/**
				*	Draws all objects on a canvas context
				*/
				previewCanvas : function (ctx) {
					for (var i = 0; i < objects.length; i++) {
						var obj = objects[i];
						switch(obj.type){
							case "circle":
								drawCircle(obj, ctx);
							break;
							case "line":
								drawLine(obj, ctx);
							break;
							default:
							break;
						}
					};
				},
			    /**
				*  Format serialized form to compatible object
			    */
				getDTO : function (formObject){
					var dto = {};		
					for (var i = 0; i < formObject.length; i++) {
							var data = formObject[i];
							var name = formObject[i].name;
							var value = formObject[i].value;
							dto[name] = value;
					};
					return dto;
				},
			    /**
				*  Iframe hack for ajax to download file
			    */
				sendRequestIframe : function (url){
			        var iframe;
			        iframe = document.getElementById("download-container");
			        if (iframe === null)
			        {
			            iframe = document.createElement('iframe');  
			            iframe.id = "download-container";
			            iframe.style.visibility = 'hidden';
			            document.body.appendChild(iframe);
			        }
			        iframe.src = url;   
			    },
			    /**
				*  Temporary form submit hack to send data and support file download
			    */
			    sendDataForm : function (data){
					//create temporary form to send data
					var form = $("<form></form>",{
						method:"POST",
						id:"tempForm",
						action:"draw/save.php",
						target : "_blank"
						//action:"javascript:;"
					});
					
					var hiddenInput = $("<input></input", {
						name : "objects",
						type : "hidden",
						value : jQuery.param(data),
					});

					$(form).append(hiddenInput);
					$("body").append(form);
					$(form).submit();
					$(form).remove();
			    },
			    /**
				*  Format serialized shape object to {type,x1,y1,x2,y2,radius,color}
			    */
				getShapeDTO : function (formObject, type){
					var dto = {};
					dto['type'] = type;
					switch(type){
						case "circle":
							dto['x1'] = parseInt(formObject[0].value);
							dto['y1'] = parseInt(formObject[1].value);
							dto['x2'] = '';
							dto['y2'] = '';
							dto['radius'] = parseInt(formObject[2].value);
							dto['color'] = formObject[3].value;
						break;
						case "line":
							dto['x1'] = parseInt(formObject[0].value);
							dto['y1'] = parseInt(formObject[1].value);
							dto['x2'] = parseInt(formObject[2].value);
							dto['y2'] = parseInt(formObject[3].value);
							dto['radius'] = '';
							dto['color'] = formObject[4].value;
						break;
					}
					return dto;
				},

				addNewButtonLogic : function() {
					var $newButton = $('#new-shape');
					var $openButton = $('#open-shape');
					$newButton.on('click', function(e){		
						var drawing = {};
						//hide main buttons
						$newButton.hide();
						$openButton.hide();

						var mainForm = _.template($("script.new-form").html());
						$("#drawing-form").html(mainForm);
						var $drawingForm = $("#new-drawing-form");
						var $shapeForm = $("#new-shape-form");


						$drawingForm .find("button.cancel").on('click',function(){			
							$newButton.show();
							$openButton.show();
							$drawingForm.remove();
							$shapeForm.remove();
							objects = [];
						});

						$drawingForm .find("button.preview").on('click',function(){
							drawing = getDTO($("#new-drawing-form").serializeArray());
							var width = drawing.width?drawing.width:500;
							var height = drawing.height?drawing.height:500;
							$("body").append('<div id="preview-drawing"></div>');
							
							var $prevDrawing = $("#preview-drawing");
							$prevDrawing.dialog({
								modal: true,
								width: width,
								height: height,
								buttons: {
							        Close: function() {
							          $( this ).dialog( "close" );
							          $prevDrawing.remove();
							        }
						      	}
							});

							/*create svg
								$prevDrawing.svg({
								onLoad: drawIntro, 
								width: width, 
								height: height
							});*/
							$prevDrawing.append('<canvas id="drawingCanvas" width="'+width+'" height="'+height+'"></canvas>');
							var context = $('#drawingCanvas').get(0).getContext('2d');
							previewCanvas(context);
						});	

						$drawingForm .find("button.save").on('click',function(e){			
							if($drawingForm[0].checkValidity()){//use HTML5 validation
								//prevent submit for new-drawing form whitout processing the data first
								e.preventDefault();
								drawing = getDTO($("#new-drawing-form").serializeArray());
								drawing['objects'] = objects;
								delete drawing.objectSelector;

								sendDataForm(drawing);
							}			
						});			

						$drawingForm.find("select.objectSelector").change(function(e){						
							$("#new-shape-form").remove();
							var shape = $(this).val();
							//generate form for new shape
							switch(shape){
								case "circle":
									var circleForm = _.template($("script.circle-form-template").html());
									$drawingForm.append(circleForm);
								break;
								case "line":
									var lineForm = _.template($("script.line-form-template").html());
									$drawingForm.append(lineForm);
								break;
								default:
								break;
							}
							var $shapeFormView = $("#new-shape-form");
							$shapeFormView.find("button.addObject").on('click', function(e){	
								if($shapeFormView[0].checkValidity()){
									e.preventDefault();
									var dto = getShapeDTO($shapeFormView.serializeArray(), shape);				
									objects.push(dto);
									$drawingForm.find("select.objects").append('<option value="'+dto.type+'">'+dto.type+'</option>');
								}						
							});	
						});			
					});
				},

				addOpenButtonLogic : function() {
					var $newButton = $('#new-shape');
					var $openButton = $('#open-shape');
					$openButton.on('click', function(e){
						$newButton.hide();
						$openButton.hide();
						var mainForm = _.template($("script.open-form").html());
						$("#drawing-form").html(mainForm);
						var $openForm = $("#open-drawing-form");

						$openForm .find("button.cancel").on('click',function(){
							$newButton.show();
							$openButton.show();
							$openForm.remove();
						});	
					});
				}
		};

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ drawing ] = function ( options ) {
				this.each(function() {
						if ( !$.data( this, "plugin_" + drawing ) ) {
								$.data( this, "plugin_" + drawing, new Drawing( this, options ) );
						}
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );