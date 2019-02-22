/*#############################################################################################################################################
* ### Define histogram graph ################################################################################################################## 
* #############################################################################################################################################*/
function histogram(){
	// Parameters
	var $el = d3.select("body")
	var margin = {top: 20, right: 30, bottom: 30, left: 30};
    var width = 1000 - margin.left - margin.right;
    var height = 200 - margin.top - margin.bottom;
    var data; //Dados de entrada...
    var bins = 20;
    var minColor = "steelblue";
    var maxColor = "steelblue";
    
    // Intern variables
    var svg, x, y;
    var formatCount = d3.format(",.0f");
    var bins, bar, max, min;
    var yMax, yMin, colorScale;
    var xAxis;
    
    var dataHist;

    var object = {};

	/*########################################################################################################################################
	* ### Method for render/refresh graph #################################################################################################### 
	* ########################################################################################################################################*/
	object.render = function(){
		
		if(!svg){ //### RENDER FIRST TIME ###		
			
			//Max and min values of the data for the scale
			max = d3.max(data);
			min = d3.min(data);
			
			//Definition of scale X
			x = d3.scale.linear()
		    	.domain([min, max])
		    	.range([0, width]);

			// Generate a histogram using twenty uniformly-spaced bins.
			dataHist = d3.layout.histogram()
			    .bins(x.ticks(bins))
			    (data);

			// Max and min values of the histogram count.
			yMax = d3.max(dataHist, function(d){return d.length});
			yMin = d3.min(dataHist, function(d){return d.length});
			colorScale = d3.scale.linear()
				.domain([yMin, yMax])
				.range([d3.rgb(minColor).darker(), d3.rgb(maxColor).brighter()]);

			y = d3.scale.linear()
				.domain([0, yMax])
				.range([height, 0]);

			xAxis = d3.svg.axis().scale(x).orient("bottom");			
			yAxis = d3.svg.axis().scale(y).orient("left");
					
			//Append the SVG on the target DIV
			svg = $el.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			bar = svg.selectAll(".bar")
		    	.data(dataHist)
		    	.enter().append("g")
		    		.attr("class", "bar")
		    		.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

			bar.append("rect")
		    	.attr("x", 1)
		    	.attr("width", (x(dataHist[0].dx) - x(0)) - 1)
		    	.attr("height", function(d) { return height - y(d.y); })
		    	.attr("fill", function(d) { return colorScale(d.y) });

			bar.append("text")
				.attr("dy", ".75em")
				.attr("y", -12)
				.attr("x", (x(dataHist[0].dx) - x(0)) / 2)
				.attr("text-anchor", "middle")
				.text(function(d) { return formatCount(d.y); });
			
			// Add X axis
			svg.append("g")
		    	.attr("class", "x axis")
		    	.attr("transform", "translate(0," + height + ")")
		    	.call(xAxis);
			
			// Add Y axis
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
			
			// Apply styles
			svg.selectAll('.bar rect')
				.style({'shape-rendering': 'crispEdges'});
			
			svg.selectAll('.bar text')
				.style({'fill': '#999999'});
		
			svg.selectAll('.axis path, .axis line')
				.style({'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'});			

	    }else{ //### REFRESH DATA ###
	    	//object.data(data);

			//Max and min values of the data for the scale
			max = d3.max(data);
			min = d3.min(data);
			
			//Definition of scale X
			x = d3.scale.linear()
		    	.domain([min, max])
		    	.range([0, width]);
	    	
	    	// var values = d3.range(1000).map(d3.random.normal(20, 5));
    	  	dataHist = d3.layout.histogram()
    	  		.bins(x.ticks(bins))
    	  		(data);
    	  	
    	  	// Reset y domain using new data
    	  	yMax = d3.max(dataHist, function(d){return d.length});
    	  	yMin = d3.min(dataHist, function(d){return d.length});
    	  	y.domain([0, yMax]);
    	  			
    	  	xAxis = d3.svg.axis().scale(x).orient("bottom");
			yAxis = d3.svg.axis().scale(y).orient("left");
    	  			
			svg.selectAll("g.x.axis")
		  		.transition()
		  		.duration(300)
	        	.call(xAxis);
			
			svg.selectAll("g.y.axis")
    	  		.transition()
    	  		.duration(300)
	        	.call(yAxis);
			
    	  	colorScale = d3.scale.linear()
    	  		.domain([yMin, yMax])
    	  		.range([d3.rgb(minColor).darker(), d3.rgb(maxColor).brighter()]);

    	  	bar = svg.selectAll(".bar").data(dataHist);

    	  	// Remove object with data (!!! Important !!!)
    	  	bar.exit().remove();

    	  	bar.transition()
    	  		.duration(300)
    	  		.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    	  	bar.select("rect")
    	  		.transition()
    	  		.duration(300)
    	  		.attr("width", (x(dataHist[0].dx) - x(0)) - 1)
    	  		.attr("height", function(d) { return height - y(d.y); })
	  			.attr("fill", function(d) { return colorScale(d.y) });

    	  	bar.select("text")
    	  		.transition()
    	  		.duration(300)
    	  		.text(function(d) { return formatCount(d.y); });
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
	
	object.bins = function(value){
		if (!arguments.length) return bins;
		bins = value;
		return object;
	};
	
	object.minColor = function(value){
		if (!arguments.length) return minColor;
		minColor = value;
		return object;
	};
	
	object.maxColor = function(value){
		if (!arguments.length) return maxColor;
		maxColor = value;
		return object;
	};
		
	return object;
};