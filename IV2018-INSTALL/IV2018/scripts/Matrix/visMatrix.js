/*#############################################################################################################################################
* ### Define histogram graph ################################################################################################################## 
* #############################################################################################################################################*/
function visMatrix(options){
	// Parameters
	var margin 			 = {top: 20, right: 10, bottom: 100, left: 100},
	    width 			 = options.width,
	    data 			 = options.data,
	    groups 			 = options.groups,
	    container 		 = options.container,
	    showLegend 		 = options.showLegend,
	    labelsData 		 = options.labels,
	    colorScheme 	 = options.colorScheme,
		showValues  	 = options.showValue,
		tooltipFormatter = 
			function(d){
	        	return '<div style="background-color: white; border:1px solid black; position: relative;">&nbsp;' + d.toFixed(5) + '&nbsp;</div>';
	      	};

	if (!options.width){
		width=350;
		height=350;
	} else {
		height=width;
	}

    // Intern variables
    var svg, x, y;
    var maxValue, minValue;
    var widthLegend = 50;
    var numrows, numcols;

    var object = {};

	/*########################################################################################################################################
	* ### Method for render/refresh graph #################################################################################################### 
	* ########################################################################################################################################*/
	object.render = function(){
		
		if(!svg){ //### RENDER FIRST TIME ###		
			
			if(!data){
				throw new Error('Please pass data');
			}

			if(!Array.isArray(data) || !data.length || !Array.isArray(data[0])){
				throw new Error('It should be a 2-D array');
			}

		    maxValue = Math.ceil( d3.max(data, function(layer) { return d3.max(layer, function(d) { return d; }); }) );
		    minValue = Math.floor( d3.min(data, function(layer) { return d3.min(layer, function(d) { return d; }); }) );

			numrows = data.length;
			numcols = data[0].length;
			
			svg = d3.select(container).append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
				.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var background = svg.append("rect")
			    .style("stroke", "black")
			    .style("stroke-width", "2px")
			    .attr("width", width)
			    .attr("height", height);			
			
			x = d3.scaleBand()
			    .domain(d3.range(numcols))
			    .range([0, width]);

			y = d3.scaleBand()
			    .domain(d3.range(numrows))
			    .range([0, height]);

			//Color schemes
			var colorMap = d3.scaleSequential()
			    .domain([minValue,maxValue])	
			    .interpolator(d3[colorScheme]);			
			var colorMapLegend = d3.scaleSequential()
				.domain([0, width])
				.interpolator(d3[colorScheme]);
			var colorMapGroups = d3.scaleOrdinal(d3.schemeCategory10);

			var row = svg.selectAll(".row")
			    .data(data)
			  	.enter().append("g")
			    .attr("class", "row")
			    .attr("y", function(d, i) { return y(i); })
			    .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

			var cell = row.selectAll(".cell")
			    .data(function(d) { return d; })
					.enter().append("g")
			    .attr("class", "cell")
			    .attr("x", function(d, i) { return x(i); })
			    .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });

			function findTheMouse(){
				var coordinates = d3.mouse(this);
				var x = coordinates[0];
				var y = coordinates[1];
				
				tooltip.setPosition(x+110, y+40);				
			}
			
			svg.on('mousemove', findTheMouse);
			
			cell.append('rect')
			    .attr("width", x.bandwidth())
			    .attr("height", y.bandwidth())
			    .style("stroke-width", 0)
			    .on('mousemove', function(d) { tooltip.setText(tooltipFormatter(d)).show(); })
			    .on('mouseout', function(d) { tooltip.hide(); });
			
			if (showValues) {
			    cell.append("text")
				    .attr("dy", ".32em")
				    .attr("x", x.bandwidth() / 2)
				    .attr("y", y.bandwidth() / 2)
				    .attr("text-anchor", "middle")
				    .style("fill", function(d, i) { return d >= maxValue/2 ? 'black' : 'white'; })
				    .text(function(d, i) { return d; });
			}

			row.selectAll(".cell")
			    .data(function(d, i) { return data[i]; })
			    .style("fill", colorMap);

			var labels = svg.append('g')
				.attr('class', "labels");

			var columnLabels = labels.selectAll(".column-label")
			    .data(labelsData)
			    .enter().append("g")
			    .attr("class", "column-label")
			    .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; });

			columnLabels.append("line")
				.style("stroke", "black")
			    .style("stroke-width", "1px")
			    .attr("x1", x.bandwidth() / 2)
			    .attr("x2", x.bandwidth() / 2)
			    .attr("y1", 0)
			    .attr("y2", 5);

			columnLabels.append("text")
			    .attr("x", -7)
			    .attr("y", (y.bandwidth() / 2)-5)
			    .attr("dy", ".82em")
			    .attr("text-anchor", "end")
			    .attr("transform", "rotate(-90)")
			    .style("cursor", "pointer")
			    .text(function(d, i) { return d; })
			    .on("click", 
			    		function(d,i) {
							var strUser = d;					        
					        var select = document.getElementById("sortable");            
					        var option = document.createElement("option");
					        option.appendChild(document.createTextNode(strUser));            
					        select.appendChild(option);
			    		}); ;

			var rowLabels = labels.selectAll(".row-label")
			    .data(labelsData)
			  .enter().append("g")
			    .attr("class", "row-label")
			    .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });

			rowLabels.append("line")
				.style("stroke", "black")
			    .style("stroke-width", "1px")
			    .attr("x1", 0)
			    .attr("x2", -5)
			    .attr("y1", y.bandwidth() / 2)
			    .attr("y2", y.bandwidth() / 2);

			rowLabels.append("text")
			    .attr("x", -7)
			    .attr("y", (y.bandwidth() / 2))
			    .attr("dy", ".32em")
			    .attr("text-anchor", "end")
			    .style("cursor", "pointer")
			    .text(function(d, i) { return d; })
			    .on("click", 
			    		function(d,i) {
							var strUser = d;					        
					        var select = document.getElementById("sortable");            
					        var option = document.createElement("option");
					        option.appendChild(document.createTextNode(strUser));            
					        select.appendChild(option);
			    		});        
            
			
			if (showLegend) {
				var i = Math.random();
				
			    var key = d3.select(container)
				    .append("svg")
				    .attr("width", widthLegend+margin.right)
				    .attr("height", height + margin.top + margin.bottom);
			
			    var legend = key
				    .append("defs")
				    .append("svg:linearGradient")
				    .attr("id", "gradient"+i)
				    .attr("x1", "100%")
				    .attr("y1", "0%")
				    .attr("x2", "100%")
				    .attr("y2", "100%")
				    .attr("spreadMethod", "pad");
						
			    var y = d3.scaleLinear()
				    .range([height-1, 0])
				    .domain([minValue, maxValue]);
			    
			    var numTicks;
			    if (width >= 100) {
			    	numTicks = 10;
			    } else if (width>=50 && width<100) {
			    	numTicks = 5;
			    } else {
			    	numTicks = 3;
			    };
			    var yAxis = d3.axisRight()
			    	.ticks(numTicks)
			    	.scale(y);
			
			    key.append("g")
				    .attr("class", "y axis")
				    .attr("transform", "translate("+(widthLegend/2)+"," + margin.top + ")")
				    .call(yAxis)				    

				key.selectAll(".bars")
                    .append("g")
                    .data(d3.range(height), function(d) { return d; })                    
                    .enter().append("rect")
                        .attr("class", "bars")
                        .attr("x", -1)
                        .attr("y", function(d, i) { return height-i-2+margin.top; })
                        .attr("height", 2)
                        .attr("width", widthLegend/2)
                        .style("fill", function(d, i ) { return colorMapLegend(d); })
			}
			
			// Groups color labels
			var group = svg.selectAll(".group")
			    .data(groups)	
			    	.enter().append("g")
			    .attr("transform", function(d, i) { return "translate(0, 0)"; });
	
			group.append('rect')
			    .style("fill", 
			    		function(d,i){
			    			return colorMapGroups(d);
			    		})
			    .attr("width", (width/numrows)+1)
			    .attr("height", 18)
			    .attr("x", 
			    		function(d,i){
			    			return (i * x.bandwidth());
			    		})
			    .attr("y", -19)
			    .on("mouseover", function(d, i) {
			    	group.selectAll("rect")
			    		.attr("height", height+20)
			    		.style("opacity", .8);
	            })
	            .on("mouseout", function(d, i) {
	            	group.selectAll("rect")
		    			.attr("height", 18)
		    			.style("opacity", 1.0);
	            });

			group.append("text")
			    .attr("x", -70)
			    .attr("y", -7)
			    .attr("text-anchor", "start")
			    .text('CLUSTERS:');				
			
			// Apply styles
			labels.selectAll('text')
				.style('font', '10px sans-serif');
			
			key.selectAll('.axis text')
				.style('font', '10px sans-serif');
			
			key.selectAll('.axis line, .axis path')
				.style('fill', 'none')
				.style('stroke', '#000')
				.style('stroke-width', '2px')
				.style('shape-rendering', 'crispEdges');

			// Tooltip
			var tooltipDiv = d3.select(container);
			
			var tooltipContainer = tooltipDiv.append("div")
				.attr("id", "matrix-tooltip");
			
			var tooltip = tooltipComponent(tooltipContainer.node());
			
	    }else{ 
    	    //### REFRESH DATA ###
	    }

		return object;
	};
		
	var tooltipComponent = function(tooltipNode) {
        var root = d3.select(tooltipNode)
        	.style("position", "absolute")
            .style("pointer-events", "none");
        
        var setText = function(html) {
            root.html(html);
            return this;
        };
        
        var position = function(x, y) {
            root.style("left", x + "px")
            	.style("top", y + "px");
            return this;
        };
        
        var show = function() {
            root.style("display", "block");
            return this;
        };
        
        var hide = function() {
            root.style("display", "none");
            return this;
        };
        
        return {
            setText: setText,
            setPosition: position,
            show: show,
            hide: hide
        };
    };
	
	return object;
};