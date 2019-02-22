/*#############################################################################################################################################
* ### Define histogram graph ################################################################################################################## 
* #############################################################################################################################################*/
function BarchartRGB(){
    // Parameters
    var $el = d3.select("body")
    var margin = {top: 0, right: 0, bottom: 0, left: 0};
    var width = 190 - margin.left - margin.right;
    var height = 60 - margin.top - margin.bottom;
    //var R, G, B, textR, textG, textB;
    var data;
    var names;
    
    // Intern variables
    var svg, x, xN, y;
    var xAxis;
    var barWidth = 15.5;
    var formatNumber = d3.format(".2f");
    
    
    var object = {};

	/*########################################################################################################################################
	* ### Method for render/refresh graph #################################################################################################### 
	* ########################################################################################################################################*/
	object.render = function(){
		
		if(!svg){ //### RENDER FIRST TIME ###		

			x = d3.scaleLinear()
		    	.domain([0, 255])
		        .range([0, width - 28]);

			xN = d3.scaleLinear()
				.domain([0, 1])
				.range([0, width - 28]);
			
			normValues = d3.scaleLinear()
		    	.domain([0, 255])
		        .range([0, 1]);
			
			//xAxis = d3.svg.axis().scale(xN).orient('bottom').ticks(5);
			xAxis = d3.axisBottom(xN).ticks(5);
			
			svg = $el.append("svg")
				.attr("class", "chart")
				.attr("width", width)
				.attr("height", height+30)
				.append("g")
				.attr("transform", "translate(15,15)");

			// Start with white color
			svg.append('g')
				.selectAll("rect")
				.data([255,255,255])
				.enter().append("rect")
					.attr("y", function(d, i) { return i * barWidth; })
					.attr("width", x)
					.style('fill', "#bdbdbd")
					.attr("height", barWidth-2);

			// Draw the bars
			svg.append('g').selectAll("rect")
				.data([data[0]])
				.enter().append("rect")
					.attr("y", 0 * barWidth)
					.attr("width", x)
					.style('fill', "red")
					.attr("height", barWidth-2);

			svg.append('g').selectAll("rect")
				.data([data[1]])
				.enter().append("rect")
					.attr("y", 1 * barWidth)
					.attr("width", x)
					.style('fill', "green")
					.attr("height", barWidth-2);
			
			svg.append('g').selectAll("rect")
				.data([data[2]])
				.enter().append("rect")
					.attr("y", 2 * barWidth)
					.attr("width", x)
					.style('fill', "blue")
					.attr("height", barWidth-2);
			
			// Write the feature names on bars
			svg.selectAll("text")
				.data(names)
				.enter().append("text")
					.attr("x", 5)
					.attr("y", function(d, i) { return (i * barWidth) + 7; })
					.attr("dy", ".35em") // vertical-align: middle
					.attr("text-anchor", "start") // text-align: right
					.style("fill", "white")
					.style("font-weight", "bold")
					.style("opacity", .85)
			      .text(function(d) { return d });

			// Write the feature values on bars
			svg.selectAll("textValues")
				.data([normValues(data[0]), normValues(data[1]), normValues(data[2])])
				.enter().append("text")
					.attr("x", width-35)
					.attr("y", function(d, i) { return (i * barWidth) + 7; })
					.attr("dy", ".35em") // vertical-align: middle
					.attr("text-anchor", "end") // text-align: right
					.style("fill", "white")
					.style("font-weight", "bold")
					.style("opacity", .85)
			      .text(function(d) { return formatNumber(d); });
			
			// Add the axis
			svg.append('g')
				.attr("class", "axis")
				.attr("transform", "translate(0," + (height-5) + ")")
		        .call(xAxis);
			
			// Apply styles
			svg.selectAll('.bar rect')
				.style('shape-rendering', 'crispEdges');
		
			svg.selectAll('.bar text')
				.style('fill', '#999999');
		
			svg.selectAll('.axis path, .axis line')
				.style('fill', 'none')
				.style('stroke', 'gray')
				.style('stroke-width', '1px')
				.style('shape-rendering', 'crispEdges');

	    }else{ //### REFRESH DATA ###	    	
	    	
			// Remove previous data
			svg.selectAll("g").data([]).exit().remove();
			svg.selectAll("text").data([]).exit().remove();
			
			// rect background
			svg.append('g')
				.selectAll("rect")
				.data([255,255,255])
				.enter().append("rect")
					.attr("y", function(d, i) { return i * barWidth; })
					.attr("width", x)
					.style('fill', "#bdbdbd")
					.attr("height", barWidth-2);

			// Draw the bars
			svg.append('g').selectAll("rect")
				.data([data[0]])
				.enter().append("rect")
					.attr("y", 0 * barWidth)
					.attr("width", x)
					.style('fill', "red")
					.attr("height", barWidth-2);

			svg.append('g').selectAll("rect")
				.data([data[1]])
				.enter().append("rect")
					.attr("y", 1 * barWidth)
					.attr("width", x)
					.style('fill', "green")
					.attr("height", barWidth-2);
			
			svg.append('g').selectAll("rect")
				.data([data[2]])
				.enter().append("rect")
					.attr("y", 2 * barWidth)
					.attr("width", x)
					.style('fill', "blue")
					.attr("height", barWidth-2);
			
			// Write the feature names on bars
			svg.selectAll("text")
				.data(names)
				.enter().append("text")
					.attr("x", 5)
					.attr("y", function(d, i) { return (i * barWidth) + 7; })
					.attr("dy", ".35em") // vertical-align: middle
					.attr("text-anchor", "start") // text-align: right
					.style("fill", "white")
					.style("font-weight", "bold")
					.style("opacity", .85)
			      .text(function(d) { return d });

			// Write the feature values on bars
			svg.selectAll("textValues")
				.data([normValues(data[0]), normValues(data[1]), normValues(data[2])])
				.enter().append("text")
					.attr("x", width-35)
					.attr("y", function(d, i) { return (i * barWidth) + 7; })
					.attr("dy", ".35em") // vertical-align: middle
					.attr("text-anchor", "end") // text-align: right
					.style("fill", "white")
					.style("font-weight", "bold")
					.style("opacity", .85)
			      .text(function(d) { return formatNumber(d); });
			
			// Add the axis
			svg.append('g')
				.attr("class", "axis")
				.attr("transform", "translate(0," + (height-5) + ")")
		        .call(xAxis);
			
			// Apply styles
			svg.selectAll('.bar rect')
				.style('shape-rendering', 'crispEdges');
			
			svg.selectAll('.bar text')
				.style('fill', '#999999');
		
			svg.selectAll('.axis path, .axis line')
				.style('fill', 'none')
				.style('stroke', 'gray')
				.style('stroke-width', '1px')
				.style('shape-rendering', 'crispEdges');
	    }

		return object;
	};

	//Getter and setter methods
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
		
	object.R = function(value){
		if (!arguments.length) return R;
		R = value;
		return object;
	};
	
	object.G = function(value){
		if (!arguments.length) return G;
		G = value;
		return object;
	};

	object.B = function(value){
		if (!arguments.length) return B;
		B = value;
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
	
	object.data = function(value){
		if (!arguments.length) return data;
		data = value;
		return object;
	};
	
	object.names = function(value){
		if (!arguments.length) return names;
		names = value;
		return object;
	};
	
	return object;
};