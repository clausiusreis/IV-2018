/*#############################################################################################################################################
* ### Define histogram graph ################################################################################################################## 
* #############################################################################################################################################*/
function histogram(){
	// Parameters
	var $el = d3.select("body")
	var margin = {top: 20, right: 30, bottom: 30, left: 35};
    var width = 1000 - margin.left - margin.right;
    var height = 200 - margin.top - margin.bottom;
    var data;
    var bins = 20;
    var minColor = "steelblue";
    var maxColor = "steelblue";
    
    // Internal variables
    var svg, x, y;
    var formatCount = d3.format(",.0f");
    var bins, bar, max, min;
    var yMax, yMin, colorScale;
    var xAxis;
    
    var histogram;
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
			
			// set the ranges
			var x = d3.scaleLinear()
			          	.domain([min,max])
			          	.rangeRound([0, width]);
			var y = d3.scaleLinear()
						.range([height, 0]);
			
			// set the parameters for the histogram
			histogram = d3.histogram()
			    .value(function(d) { return d; })
			    .domain(x.domain())
			    .thresholds(x.ticks(bins));
			
			svg = $el.append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", 
			          "translate(" + margin.left + "," + margin.top + ")");

			// group the data for the bars
			dataHist = histogram(data);
			
			// Max and min values of the histogram count.
			yMax = d3.max(dataHist, function(d){return d.length});
			yMax = yMax*1.4;
			yMin = d3.min(dataHist, function(d){return d.length});
			colorScale = d3.scaleLinear()
				.domain([yMin, yMax])
				.range([d3.rgb(minColor).darker(), d3.rgb(maxColor).brighter()]);			
			
			// Scale the range of the data in the y domain
			y.domain([0, d3.max(dataHist, function(d) { return d.length; })]);
			
			// append the bar rectangles to the svg element
			svg.selectAll("rect")
			    .data(dataHist)
			  .enter().append("rect")
			    .attr("class", "bar")
			    .attr("x", 1)
			    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
			    .attr("width", function(d) {
			    		var aux = x(d.x1) - x(d.x0) -.7;
			    		if (aux < 0) { aux = 0 };
			    		return aux; 
			    	})
			    .attr("height", function(d) { return height - y(d.length); })
			    .attr("fill", function(d) { return colorScale(d.length) });
			
			svg.selectAll("text")
			    .data(dataHist)
			  .enter().append("text")
			  	.attr("dy", ".75em")			  	
			    .attr("y", function(d) { return y(d.length) - 11; })
			    .attr("x", function(d) { return x(d.x0) + (x(d.x1)-x(d.x0))/2; })
				.attr("text-anchor", "middle")
				.text(function(d) { return formatCount(d.length); });
						    
			
			// add the x Axis
			svg.append("g")
			    .attr("transform", "translate(0," + height + ")")
			    .call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
			    .call(d3.axisLeft(y).ticks(bins/4));
			

	    }else{ 
    	    //### REFRESH DATA ###	    	
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