/*#############################################################################################################################################
* ### Define heatmap graph ################################################################################################################## 
* #############################################################################################################################################*/
function Heatmap(){
	// Parameters
	var $el = d3.select("body");
	var margin = {top: 20, right: 5, bottom: 5, left: 80};
    var width = 0
    var data;
    var colorScheme = "interpolateGreys";
    var removeOutliers = false;
    
    var $el1;
    
    // Format variables
    var formatDate = d3.timeFormat("%Y-%b-%d");
    var formatTime = d3.timeFormat("%H:%M");
    var formatFloat = d3.format(".3f");
	
    // Intern variables
    var svg, x, y;
    var xAxis, yAxis;
    var nestedDates;
    var nestedTimes;
    var dateArray;
    var rows, cols;
    var row_heigth, col_width;
    var heigth, widthDiv;
    var ttdiv;
    
    // Function to dimension the data into the screen space
    function cell_dim(total, cells) { 
            return Math.floor(total/cells) 
    }

    function addDiv(divname, divtarget, width, heigth, floatPos, yControl, backColor="none") {
        yControlText='';
        if (yControl){
            divtarget.append(divname);
        } else {
            divtarget.append(divname)
            .style('position', 'relative')
            .style('top', '15px');
        }
    }
	
    var removeOutliersFromData = function(data){
        var l = data.length;

        // Only show data within 3 standard deviations of the mean. 
        // If data is normally distributed 99.7% will fall in this range.
        var sum=0;     // stores sum of elements
        var sumsq = 0; // stores sum of squares
        for(var i=0;i<data.length;++i) {        	
            sum+=data[i].value;
            sumsq+=data[i].value * data[i].value;
        };
        var mean = sum/l; 
        var varience = sumsq / l - mean*mean;
        var sd = Math.sqrt(varience);        
        var data3 = new Array(); // uses for data which is 3 standard deviations from the mean
        for(var i=0;i<data.length;++i) {
            if( (data[i].value < (mean + 3 * sd)) && (data[i].value > (mean - 3 * sd))) {
                data3.push(data[i]);
            } else {
                data3.push({ date: data[i].date, time: data[i].time, value: mean }); 
            };
        };

        return data3;
    };
    
    var object = {};

	/*########################################################################################################################################
	* ### Method for render/refresh graph #################################################################################################### 
	* ########################################################################################################################################*/
	object.render = function(){

            if (removeOutliers) {
                data = removeOutliersFromData(data);
            };
            
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
                    widthDiv = autowidth.getBoundingClientRect().width - 120;
                } else {
                    widthDiv = width;
                }
                width = widthDiv - 105;
                heigth = (width/cols) * rows;

                // Width and height of each collumn and line
                row_heigth = cell_dim(heigth, rows);
                col_width = cell_dim(width, cols);

                // Add the necessary Divs
                addDiv("hm1", $el, widthDiv+"px", heigth +"px", "left", false, "none");
                $el1 = d3.select("hm1");

                // Data scale
                x = d3.scaleTime()
                    .domain( d3.extent(data, function(d) { return d.time; }) )
                    .range([0, width - col_width]),
                y = d3.scaleTime()
                    .domain( d3.extent(data, function(d) { return d.date; }) )
                    .range([0, heigth - row_heigth]);

                if (colorScheme == 'yellowRed') {
                    corScheme = d3.scaleLinear()
                        .domain( d3.extent(data, function(d) { return d.value; }) )
                        .range(['yellow', 'red']);
                    corSchemeBar = d3.scaleLinear()
                        .domain([0,250])
                        .range(['yellow', 'red']);
                } else {
                    corScheme = d3.scaleSequential()
                            .domain( d3.extent(data, function(d) { return d.value; }) )
                            .interpolator(d3[colorScheme]);
                    corSchemeBar = d3.scaleSequential()
                            .domain([0,250])
                            .interpolator(d3[colorScheme]);
                };

                // Append the SVG on the target DIV
                svg = $el1.append("svg")
                        .attr("width", widthDiv + margin.left + margin.right)
                        .attr("height", heigth + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Define the div for the tooltip
                ttdiv = $el1.append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

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
                        .style("fill", function(d) {
                                return corScheme(d.value);
                        })
                        .attr("transform", "translate(2,2)")		
                        .on("mousemove",
                                function(d){						
                                        ttdiv.style("opacity", .85);			
                                        ttdiv.html(
                                                "<strong>Date:</strong> " + formatDate(d.date) + "</br>" +
                                                "<strong>Time:</strong> " + formatTime(d.time) + "</br>" +
                                                "<strong>Value:</strong> " + formatFloat(d.value) + "</br>"
                            )
                            .style("left", (d3.mouse(this)[0]) + "px")
                            .style("top",  (d3.mouse(this)[1]-220) + "px");
                                }
                        )
                        .on("mouseout", 
                                function(){
                                    ttdiv.style("opacity", 0);
                                }
                        );

                // ### Create the axis ###			
                xAxis = d3.axisTop(x).ticks(24).tickFormat(d3.timeFormat('%H'));
                yAxis = d3.axisLeft(y).ticks(nestedDates.length/2).tickFormat(d3.timeFormat("%Y-%b-%d"));

                // Add the X Axis
                svg.append("g")
                        .attr("class", "axis")
                        .style("font-weight", "bold")
                        .attr("transform", "translate(9,0)")
                        .call(xAxis);

                // Add the Y Axis
                svg.append("g")
                        .attr("class", "axis")
                        .style("font-weight", "bold")
                        .attr("transform", "translate(0,9)")
                        .call(yAxis);

                // ### Color bar legend ######################################################                   
                svg.selectAll(".bars")
                    .append("g")
                    .data(d3.range(250), function(d) { return d; })
                    .enter().append("rect")
                        .attr("class", "bars")
                        .attr("x", width+30)
                        .attr("y", function(d, i) { return 250-i; })
                        .attr("height", 1)
                        .attr("width", 20)
                        .style("fill", function(d, i ) { return corSchemeBar(d); })
            
                //TODO: Colocar valors de 0 a 1 na esquerda e min(data) e max(data) na direita
                svg.append("text")
                        .attr("x", width+20)
                        .attr("y", 240)
                        .attr("dy", ".45em") // vertical-align: middle
                        .attr("text-anchor", "start") // text-align: right
                        .style("fill", "black")
                        .style("font-size", 16)
                        .style("font-weight", "bold")                        
                        .text(0);
                
                svg.append("text")
                        .attr("x", width+20)
                        .attr("y", 8)
                        .attr("dy", ".45em") // vertical-align: middle
                        .attr("text-anchor", "start") // text-align: right
                        .style("fill", "black")
                        .style("font-size", 16)
                        .style("font-weight", "bold")                        
                        .text(1);
                      
                // ###########################################################################

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
                
                svg.data([]).exit().remove();

                nestedDates = d3.nest().key(function(d) { return d.date; }).entries(data);
                nestedTimes = d3.nest().key(function(d) { return d.time; }).entries(data);

                dateArray = d3.scaleTime()
                        .domain( d3.extent(data, function(d) { return d.date; }) )
                        .ticks(24);

                rows = nestedDates.length; // Days on CSV file (Including GAP)
                cols = nestedTimes.length; // Times on CSV file (Including GAP)

                // Width and height of each collumn and line
                row_heigth = cell_dim(heigth, rows);
                col_width = cell_dim(width, cols);

                // Data scale
                x = d3.scaleTime()
                    .domain( d3.extent(data, function(d) { return d.time; }) )
                    .range([0, width - col_width]),
                y = d3.scaleTime()
                    .domain( d3.extent(data, function(d) { return d.date; }) )
                    .range([0, heigth - row_heigth]);
                
                if (colorScheme == 'yellowRed') {
                    corScheme = d3.scaleLinear()
                        .domain( d3.extent(data, function(d) { return d.value; }) )
                        .range(['yellow', 'red']);
                    corSchemeBar = d3.scaleLinear()
                        .domain([0,250])
                        .range(['yellow', 'red']);
                } else {
                    corScheme = d3.scaleSequential()
                            .domain( d3.extent(data, function(d) { return d.value; }) )
                            .interpolator(d3[colorScheme]);
                    corSchemeBar = d3.scaleSequential()
                            .domain([0,250])
                            .interpolator(d3[colorScheme]);
                };

                // Append the SVG on the target DIV
                svg = $el1.select("svg")
                        .attr("width", widthDiv + margin.left + margin.right)
                        .attr("height", heigth + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // Define the div for the tooltip
                ttdiv = $el1.select("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

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
                        .style("fill", function(d) {
                                return corScheme(d.value);
                        })
                        .attr("transform", "translate(2,2)")		
                        .on("mousemove",
                                function(d){
                                        ttdiv.style("opacity", .85);			
                                        ttdiv.html(
                                                "<strong>Date:</strong> " + formatDate(d.date) + "</br>" +
                                                "<strong>Time:</strong> " + formatTime(d.time) + "</br>" +
                                                "<strong>Value:</strong> " + formatFloat(d.value) + "</br>"
                            )
                            .style("left", (d3.mouse(this)[0]) + "px")
                            .style("top",  (d3.mouse(this)[1]-220) + "px");
                                }
                        )
                        .on("mouseout", 
                                function(){
                                        ttdiv.style("opacity", 0);
                                }
                        );

                // ### Create the axis ###			
                xAxis = d3.axisTop(x).ticks(24).tickFormat(d3.timeFormat('%H'));
                yAxis = d3.axisLeft(y).ticks(nestedDates.length/2).tickFormat(d3.timeFormat("%Y-%b-%d"));

                // Add the X Axis
                svg.append("g")
                        .attr("class", "axis")
                        .style("font-weight", "bold")
                        .attr("transform", "translate(9,0)")
                        .call(xAxis);

                // Add the Y Axis
                svg.append("g")
                        .attr("class", "axis")
                        .style("font-weight", "bold")
                        .attr("transform", "translate(0,9)")
                        .call(yAxis);

                // ### Color bar legend ######################################################                   
                svg.selectAll(".bars")
                    .append("g")
                    .data(d3.range(250), function(d) { return d; })
                    .enter().append("rect")
                        .attr("class", "bars")
                        .attr("x", width+30)
                        .attr("y", function(d, i) { return 250-i; })
                        .attr("height", 1)
                        .attr("width", 20)
                        .style("fill", function(d, i ) { return corSchemeBar(d); })
                
                svg.append("text")
                        .attr("x", width+20)
                        .attr("y", 240)
                        .attr("dy", ".45em") // vertical-align: middle
                        .attr("text-anchor", "start") // text-align: right
                        .style("fill", "black")
                        .style("font-size", 16)
                        .style("font-weight", "bold")                        
                        .text(0);
                
                svg.append("text")
                        .attr("x", width+20)
                        .attr("y", 8)
                        .attr("dy", ".45em") // vertical-align: middle
                        .attr("text-anchor", "start") // text-align: right
                        .style("fill", "black")
                        .style("font-size", 16)
                        .style("font-weight", "bold")                        
                        .text(1);
                // ###########################################################################

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
	
	object.colorScheme = function(value){
		if (!arguments.length) return colorScheme;
		colorScheme = value;
		return object;
	};	

	object.removeOutliers = function(value){
		if (!arguments.length) return removeOutliers;
		removeOutliers = value;
		return object;
	};
        
	return object;
};