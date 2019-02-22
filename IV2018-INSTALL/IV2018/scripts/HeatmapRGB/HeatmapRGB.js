/*#############################################################################################################################################
* ### Define heatmap graph ################################################################################################################## 
* #############################################################################################################################################*/
function HeatmapRGB(){
	// Parameters
	var $el = d3.select("body");
	var margin = {top: 20, right: 5, bottom: 5, left: 80};
    var width = 0
    var data;
    var drawR = true;
    var drawG = true;
    var drawB = true;
    var textR = '';
    var textG = '';
    var textB = '';    

    var $el1, $el2, $el3;
    
	// Format variables
	var formatDate = d3.timeFormat("%Y-%b-%d");
	var formatTime = d3.timeFormat("%H:%M");
	var parseTime = d3.timeParse("%H:%M");

    // Intern variables
    var svg, x, y;
    var xAxis, yAxis;
    var nestedDates;
    var nestedTimes;
    var dateArray;
    var rows, cols;
    var row_heigth, col_width;
    var heigth, widthDiv;
    var barchart1;
    
    // Function to dimension the data into the screen space
	function cell_dim(total, cells) { 
		return Math.floor(total/cells) 
	}

	function addDiv(divname, divtarget, width, heigth, floatPos, yControl, backColor="none") {
		//Adiciono a barra de rolagem lateral
		yControlText='';
		if (yControl){
			divtarget.append(divname)
			.style('width', width)
			.style('height', heigth)
			.style('overflow-y', 'scroll')
			.style('background-color', backColor)
			.style('float', floatPos)
			.style('position', 'relative')
			.style('top', '0px')
			.style('left', '0px');
		} else {
			divtarget.append(divname)
			.style('width', width)
			.style('height', heigth)
			.style('background-color', backColor)
			.style('float', floatPos)
			.style('position', 'relative')
			.style('top', '0px')
			.style('left', '0px');			
		}
	}
	
	//ColorDiv (Color picker) 
	function readValue(){
		return $('hm2').minicolors('rgbObject');
	};

	// ColorDiv (Color picker) 
	function inputValue(val){
		$('hm2').minicolors('value', val);
	};
	
    var object = {};
    
	/*########################################################################################################################################
	* ### Method for render/refresh graph #################################################################################################### 
	* ########################################################################################################################################*/
	object.render = function(){
		
		if(!svg){ //### RENDER FIRST TIME ###		
			
			nestedDates = d3.nest().key(function(d) { return d.date; }).entries(data);
			nestedTimes = d3.nest().key(function(d) { return d.time; }).entries(data);
			
			dateArray = d3.scaleTime()
				.domain( d3.extent(data, function(d) { return d.date; }) )
				.ticks(24);
  
			rows = nestedDates.length; // Days on CSV file (Including GAP)
			cols = nestedTimes.length; // Times on CSV file (Including GAP)
  
			// width and height of the heatmap
			if (width == 0){
				var autowidth = $el.node();
				widthDiv = autowidth.getBoundingClientRect().width - 220;
			}
			width = widthDiv - 105;
			heigth = (width/cols) * rows;
			
			// Width and height of each collumn and line
			row_heigth = cell_dim(heigth, rows);
			col_width = cell_dim(width, cols);

			// Add the necessary Divs
			addDiv("hm1", $el, widthDiv+"px", "255px", "left", true, "none");
			addDiv("hm2", $el, "198px", "1px", "left", false, "none");
			addDiv("hm3", $el, "198px", "80px", "left", false, "none");			
			$el1 = d3.select("hm1");
			$el2 = d3.select("hm2");
			$el3 = d3.select("hm3");
			
			barchart1 = BarchartRGB()
				.$el($el3)
				.width(190)
				.height(52.5)
				.data([255, 255, 255])
				.names([textR, textG, textB])
				.render();
			
			// Data scale			
			x = d3.scaleTime()
				.domain( [parseTime('00:00'), parseTime('23:59')] )
				.range([0, width - col_width]),
			y = d3.scaleTime()
            	.domain( d3.extent(data, function(d) { return d.date; }) )
            	.range([0, heigth - row_heigth]);

			corR = d3.scaleLog()
            	.domain( d3.extent(data, function(d) { return d.valueR; }) )
            	.range([0, 255]);
			corG = d3.scaleLog()
            	.domain( d3.extent(data, function(d) { if (d.valueG < 0) {console.log(d.valueG)}; return d.valueG; }) )
            	.range([0, 255]);
			corB = d3.scaleLog()
            	.domain( d3.extent(data, function(d) { return d.valueB; }) )
            	.range([0, 255]);

			corRN = d3.scaleLog()
      			.domain( d3.extent(data, function(d) { return d.valueR; }) )
      			.range([0, 1]);
			corGN = d3.scaleLog()
	        	.domain( d3.extent(data, function(d) { return d.valueG; }) )
	        	.range([0, 1]);
			corBN = d3.scaleLog()
	        	.domain( d3.extent(data, function(d) { return d.valueB; }) )
	        	.range([0, 1]);

			// Append the SVG on the target DIV
			svg = $el1.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", heigth + margin.top + margin.bottom)
				.append("g")
		  	  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//adiciono os tiles
			svg.selectAll(".tile")
				.data(data)
				.enter()
				.append("rect")
				.attr("class", "tile")
				.attr("x", function(d,i) { return x(d.time); })
				.attr("y", function(d,i) { return y(d.date); })
				.attr("width", col_width + 1)
				.attr("height", row_heigth + 1)
				.attr("stroke", "white")
				.attr("stroke-width", "0.5px")
				.style("fill", 
					function(d) {
						if (drawR) { R = corR(d.valueR); } else { R = 0; };
						if (drawG) { G = corG(d.valueG); } else { G = 0; };
						if (drawB) { B = corB(d.valueB); } else { B = 0; };
			          	
			          	return d3.rgb(R, G, B);
			      	}
				)
				.attr("transform", "translate(2,2)")		
				.on("mousemove", 
					function(d){											
						// Change the color on the color circle component						
						R = Math.floor(corR(d.valueR));
						G = Math.floor(corG(d.valueG));
						B = Math.floor(corB(d.valueB));
						
						inputValue('rgb('+R+', '+G+', '+B+')');	//Minicolor					
						barchart1.data([R, G, B]).names([textR, textG, textB]).render(); //Barchart
					}
				);

			// ### Create the axis ###
			xAxis = d3.axisTop(x).ticks(24).tickFormat(d3.timeFormat('%H'));//.ticks(24).tickFormat(d3.timeFormat("%H"));
			yAxis = d3.axisLeft(y).ticks(nestedDates.length/2).tickFormat(d3.timeFormat("%Y-%b-%d"));
			
			// Add the X Axis
			svg.append("g")
				.attr("class", "axis")
				.style("font-weight", "bold")
				.attr("transform", "translate("+(col_width/5)*3+",0)")
				.call(xAxis);
			
			// Add the Y Axis
			svg.append("g")
				.attr("class", "axis")
				.style("font-weight", "bold")
				.attr("transform", "translate(0,"+(row_heigth/5)*3+")")
				.call(yAxis);
			
			// ### ColorDiv (Color picker) ####################################################################################
			//Add the color circle to allow user to understand the meaning of heatmap colors
			$('hm2').minicolors({
				control: 'wheel',
				defaultValue: "rgb(255, 255, 255)",
				format: 'rgb',
				inline: 'true',
				letterCase: 'lowercase'
			});
			
			$('hm2').minicolors('value', 'rgb(255, 255, 255)');
			
			// Apply styles
			svg.selectAll('.bar rect')
				.style('shape-rendering', 'crispEdges');
			
			svg.selectAll('.bar text')
				.style('fill', '#999999');
		
			svg.selectAll('.axis path, .axis line')
				.style('fill', 'none')
				.style('stroke', 'gray')
				.style('stroke-width', '2px')
				.style('shape-rendering', 'crispEdges');
			
			svg.selectAll('.chart rect')
				.style('stroke', 'white');

	    }else{ //### REFRESH DATA ###
	    	object.data(data);
	    	
	    	// Remove previous data
			svg.data([]).exit().remove();

			nestedDates = d3.nest().key(function(d) { return d.date; }).entries(data);
			nestedTimes = d3.nest().key(function(d) { return d.time; }).entries(data);
			
			dateArray = d3.scaleTime()
				.domain( d3.extent(data, function(d) { return d.date; }) )
				.ticks(24);
  
			rows = nestedDates.length; // Days on CSV file (Including GAP)
  
			// width and height of the heatmap
			if (width == 0){
				var autowidth = $el.node();
				widthDiv = autowidth.getBoundingClientRect().width - 220;
			}
			width = widthDiv - 105;
			heigth = (width/cols) * rows;
					
			barchart1
				.$el($el3)
				.width(190)
				.height(52.5)
				.data([255, 255, 255])
				.names([textR, textG, textB])
				.render();
			
			// Data scale
			x = d3.scaleTime()
				.domain( [parseTime('00:00'), parseTime('23:59')] )
				.range([0, width - col_width]),
			y = d3.scaleTime()
            	.domain( d3.extent(data, function(d) { return d.date; }) )
            	.range([0, heigth - row_heigth]);

			corR = d3.scaleLog()
            	.domain( d3.extent(data, function(d) { return d.valueR; }) )
            	.range([0, 255]);
			corG = d3.scaleLog()
            	.domain( d3.extent(data, function(d) { return d.valueG; }) )
            	.range([0, 255]);
			corB = d3.scaleLog()
            	.domain( d3.extent(data, function(d) { return d.valueB; }) )
            	.range([0, 255]);

			corRN = d3.scaleLog()
      			.domain( d3.extent(data, function(d) { return d.valueR; }) )
      			.range([0, 1]);
			corGN = d3.scaleLog()
	        	.domain( d3.extent(data, function(d) { return d.valueG; }) )
	        	.range([0, 1]);
			corBN = d3.scaleLog()
	        	.domain( d3.extent(data, function(d) { return d.valueB; }) )
	        	.range([0, 1]);

			// Append the SVG on the target DIV
			svg = $el1.select("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", heigth + margin.top + margin.bottom)
				.append("g")
		  	  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			//adiciono os tiles
			svg.selectAll(".tile")
				.data(data)
				.enter()
				.append("rect")
				.attr("class", "tile")
				.attr("x", function(d,i) { return x(d.time); })
				.attr("y", function(d,i) { return y(d.date); })
				.attr("width", col_width + 1)
				.attr("height", row_heigth + 1)
				.attr("stroke", "white")
				.attr("stroke-width", "0.5px")
				.style("fill", 
					function(d) {
						if (drawR) { R = corR(d.valueR); } else { R = 0; };
						if (drawG) { G = corG(d.valueG); } else { G = 0; };
						if (drawB) { B = corB(d.valueB); } else { B = 0; };
			          	
			          	return d3.rgb(R, G, B);
			      	}
				)
				.attr("transform", "translate(2,2)")		
				.on("mousemove", 
					function(d){												
						// Change the color on the color circle component						
						R = Math.floor(corR(d.valueR));
						G = Math.floor(corG(d.valueG));
						B = Math.floor(corB(d.valueB));
						
						inputValue('rgb('+R+', '+G+', '+B+')');	//Minicolor					
						barchart1.data([R, G, B]).names([textR, textG, textB]).render(); //Barchart
					}
				);

			// ### Create the axis ###
			xAxis = d3.axisTop(x).ticks(24).tickFormat(d3.timeFormat('%H'));//.ticks(24).tickFormat(d3.timeFormat("%H"));
			yAxis = d3.axisLeft(y).ticks(nestedDates.length/2).tickFormat(d3.timeFormat("%Y-%b-%d"));
			
			// Add the X Axis
			svg.append("g")
				.attr("class", "axis")
				.style("font-weight", "bold")
				.attr("transform", "translate("+(col_width/5)*3+",0)")
				.call(xAxis);
			
			// Add the Y Axis
			svg.append("g")
				.attr("class", "axis")
				.style("font-weight", "bold")
				.attr("transform", "translate(0,"+(row_heigth/5)*3+")")
				.call(yAxis);
			
			// ### ColorDiv (Color picker) ####################################################################################
			$('hm2').minicolors({
				control: 'wheel',
				defaultValue: "rgb(255, 255, 255)",
				format: 'rgb',
				inline: 'true',
				letterCase: 'lowercase'
			});
			
			$('hm2').minicolors('value', 'rgb(255, 255, 255)');
			
			// Apply styles
			svg.selectAll('.bar rect')
				.style('shape-rendering', 'crispEdges');
			
			svg.selectAll('.bar text')
				.style('fill', '#999999');
		
			svg.selectAll('.axis path, .axis line')
				.style('fill', 'none')
				.style('stroke', 'gray')
				.style('stroke-width', '2px')
				.style('shape-rendering', 'crispEdges');
			
			svg.selectAll('.chart rect')
				.style('stroke', 'white');

	    }

		return object;
	};
	
	//Getter and setter methods
	object.data = function(value){
		if (!arguments.length) return data;
		data = value;
		return object;
	};

	object.$el = function(value){
		if (!arguments.length) return $el;
		$el = value;
		return object;
	};

	object.width = function(value){
		if (!arguments.length) return width;
		width = value;
		return object;
	};
	
	object.drawR = function(value){
		if (!arguments.length) return drawR;
		drawR = value;
		return object;
	};
	
	object.drawG = function(value){
		if (!arguments.length) return drawG;
		drawG = value;
		return object;
	};
	
	object.drawB = function(value){
		if (!arguments.length) return drawB;
		drawB = value;
		return object;
	};
	
	object.textR = function(value){
		if (!arguments.length) return textR;
		textR = value;
		return object;
	};
	
	object.textG = function(value){
		if (!arguments.length) return textG;
		textG = value;
		return object;
	};
	
	object.textB = function(value){
		if (!arguments.length) return textB;
		textB = value;
		return object;
	};

	return object;
};