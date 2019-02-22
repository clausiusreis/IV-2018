/*#############################################################################################################################################
* ### Define line graph ####################################################################################################################### 
* #############################################################################################################################################*/
function linechart(){
	// Default settings
	var $el = d3.select("body")
	var width = 960;
	var height = 500;
	var color = "steelblue";
	var margin = {top: 10, right: 50, bottom: 30, left: 50};
	var data = [];	
	var transitionTime = 200;
	var currentSampleStart = -1;
	var currentSampleEnd = -1;
	var mean = -1;
	
	var svg, x, y, yy, xAxis, yAxis, line, line1, lineMean;
	var object = {};        

	var interpolatorOptions = ["StepAfter", "MonotoneX"];
	
	/*########################################################################################################################################
	* ### Method for render/refresh graph #################################################################################################### 
	* ########################################################################################################################################*/
	object.render = function(){
		if(!svg){ //### RENDER FIRST TIME ###
			
			//Definition of scales 
			x = d3.scaleLinear().range([0, width]);
			y = d3.scaleLinear().range([height, 0]);
			yy = d3.scaleLinear()
				.range(d3.extent(data, function(d) { return d.y; }))
				.domain([height, 0]);
				
			//Definition of the axis object
			xAxis = d3.axisBottom().scale(x);
			yAxis = d3.axisLeft().scale(y).ticks(6);

			//Definition of a line object
			line = d3.line()
				.x(function(d) { return x(d.x); })
				.y(function(d) { return y(d.y); })
                .curve(d3.curveStepAfter);		
						
            //Mean line
			if (mean == -1) {
	            meanValue = d3.mean(data, function(d) { return +d.y });
	            console.log("meanValue 1:", meanValue);
	            lineMean = d3.line()
					.x(function(d) { return x(d.x); })
					.y(function(d) { return y(meanValue); });
			} else {            
	            lineMean = d3.line()
					.x(function(d) { return x(d.x); })
					.y(function(d) { return mean; });
			}

			//Append the SVG on the target DIV
			svg = $el.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
				.style("cursor", "pointer")
				.on("click", function(d,i){
					var mouse = d3.mouse(this);
					object.mean(yy(mouse[1])).render();
				});
	
			svg.append("rect")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", width)
				.attr("height", height)
				.attr("fill", "white")
				.on("click", function(d,i){
					var mouse = d3.mouse(this);
					object.mean(yy(mouse[1])).render();
				});

			//Set the extension of the axis values
			x.domain(d3.extent(data, function(d) { return d.x; }));
           y.domain([0,1]);

            //Draw the lines
			svg.append("path")
				.datum(data)
				.attr("class", "line")				
				.attr("d", line)
	            .style("stroke", color)
	            .style("fill", "none")
	            .style("stroke-width", "1px");
            
	        //Add the mean line
            svg.append("path")
				.datum(data)
				.attr("class", "line-mean")				
				.attr("d", lineMean)
                .style("stroke", "green")
                .style("fill", "none")
                .style("stroke-width", "2px")
                .style("opacity", ".5");
                        
			//Add X axis
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			//Add Y axis
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis);
			
			//Add Axis Text
			svg.append("text")
			    .attr("x", width/2-22)
			    .attr("y", height+25)
			    .attr("dy", ".28em")
			    .text("Time (s)");
			
			// Change the axis style (Chubby font problem)
			svg.selectAll('.axis line, .axis path')
				.style("stroke", "gray")
                .style("fill", "none")
                .style("stroke-width", "1.5px")
                .style("shape-rendering", "crispEdges");                

	    }else{ //### REFRESH DATA ###
	    	//Set the new data	    	
	    	object.data(data);
	    	
	    	//Set the extension of the axis values
	    	x.domain(d3.extent(data, function(d) { return d.x; }));
	    	y.domain([0,1]);
	    	yy = d3.scaleLinear()
	    		.range([0,1])
				.domain([height, 0]);

	    	//Define the transition time for the X axis
	    	svg.select("g.y")
	        	.transition()
	        	.duration(transitionTime)
	        	.call(yAxis);
	
	    	//Define the transition time for the Y axis
	    	svg.select("g.x")
	        	.transition()
	        	.duration(transitionTime)
	        	.call(xAxis);
	
	    	//Draw the lines
	    	svg.selectAll("path.line")
	    		.datum(data)
	    		.transition()
	    		.duration(transitionTime)
	    		.attr("d", line);
	    	
            //Mean line
	    	if (mean == -1) {
		    	meanValue = d3.mean(data, function(d) { return +d.y });
		    	object.mean(meanValue);		    	
	            svg.selectAll("path.line-mean")
		    		.datum(data)
		    		.transition()
		    		.duration(transitionTime)
		    		.attr("d", lineMean);
	    	} else {
	    		lineMean = d3.line()
					.x(function(d) { return x(d.x); })
					.y(function(d) { return y(mean); });
	    		svg.selectAll("path.line-mean")
		    		.datum(data)
		    		.transition()
		    		.duration(transitionTime)
		    		.attr("d", lineMean);
	    	}
	    	
	    	console.log("meanValue:", meanValue);
	    	console.log("mean:", mean);
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

	object.height = function(value){
		if (!arguments.length) return height;
		height = value;
		return object;
	};

	object.color = function(value){
		if (!arguments.length) return color;
		color = value;
		return object;
	};
	
	object.x = function(value){
		if (!arguments.length) return x;
		x = value;
		return object;
	}

	object.transitionTime = function(value){
		if (!arguments.length) return transitionTime;
		transitionTime = value;
		return object;
	}
	
	object.currentSampleStart = function(value){
		if (!arguments.length) return currentSampleStart;
		currentSampleStart = value;
		return object;
	}
	
	object.currentSampleEnd = function(value){
		if (!arguments.length) return currentSampleEnd;
		currentSampleEnd = value;
		return object;
	}
	
	object.mean = function(value){
		if (!arguments.length) return mean;
		mean = value;
		return object;
	}
	
	return object;
};