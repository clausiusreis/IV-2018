/*#############################################################################################################################################
* ### Define heatmap graph ##################################################################################################################
* Esquemas de cor que podem ser usados:
* 	d3.schemeCategory10
* 	d3.schemeCategory20
* 	d3.schemeCategory20b
* 	d3.schemeCategory20c
* 	d3.schemeAccent
* 	d3.schemeDark2
* 	d3.schemePaired
* 	d3.schemePastel1
* 	d3.schemePastel2
* 	d3.schemeSet1
* 	d3.schemeSet2
* 	d3.schemeSet3
* 	
*  
* #############################################################################################################################################*/
function Radviz(){
	// Parameters
	var $el = d3.select("body");	
    var size = 0;  
    var margin = 27;    
    var colorAccessor = null; //Onde defino quem define as cores dos grupos. Exemplo: function(d){ return d['species']; };
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    var data; //Todos os dados
    var dimensions = []; //Features selecionados
    var drawLinks = true;
    var dotRadius = 6;
    var dotOpacity = 0.4;
    var useTooltip = true;
    var tooltipFormatter =
    	function(d) {
        	return d;
    	};
    var colorScaleDimensions = d3.scaleOrdinal(d3.schemeDark2);

	// Format variables
	var formatDate = d3.timeFormat("%Y-%b-%d");
	var formatTime = d3.timeFormat("%H:%M");

    // Intern variables
    var svg, x, y;
    var width, height;    
    var force; //O sistema de simuçação de forças
    //var events = d3.dispatch("panelEnter", "panelLeave", "dotEnter", "dotLeave");    
    //var dimensionsColorScale = d3.scaleOrdinal([0,dimensions.length-1]).range(["darkgray", "gray"]);

    //Variables to create the force along the circle axis
    var normalizeSuffix = "_normalized";
    var dimensionNamesNormalized;
    var thetaScale;
    var chartRadius;
    var nodeCount;
    var panelSize;
    var dimensionNodes;
    
    //Donut
    var arcWidth = 25;
    //var radius = ((size-margin*2) / 2);
    var arcGap = .10;
    
    //Inter radviz data
    var linksData;
	
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
	
	var addNormalizedValues = function(data) {
        data.forEach(function(d) {
            config.dimensions.forEach(function(dimension) {
                d[dimension] = +d[dimension];
            });
        });
        var normalizationScales = {};
        config.dimensions.forEach(function(dimension) {
            normalizationScales[dimension] = d3.scaleLinear().domain(d3.extent(data.map(function(d, i) {
                return d[dimension];
            }))).range([ 0, 1 ]);
        });
        data.forEach(function(d) {
            config.dimensions.forEach(function(dimension) {
                d[dimension + "_normalized"] = normalizationScales[dimension](d[dimension]);
            });
        });
        return data;
    };
	
    var object = {};
    
	/*########################################################################################################################################
	* ### Method for render/refresh graph #################################################################################################### 
	* ########################################################################################################################################*/
	object.render = function(){
		
		if(!svg){ //### RENDER FIRST TIME ###		
			
			// width and height of the DIV container
			var autowidth = $el.node();
			width = autowidth.getBoundingClientRect().width;
			height = autowidth.getBoundingClientRect().height;
			if (size == 0){
				size = height;
			}
			
			// Add the necessary Divs
			addDiv("rv1", $el, size+"px", size-1+"px", "left", false, "none");
			//addDiv("rv2", $el, width-size-20+"px", size-1+"px", "left", false, "none");			
			$el1 = d3.select("rv1"); // O radviz
			//$el2 = d3.select("rv2"); // Estatísticas dos dados selecionados e botões de comando para Keep e Exclude(Filter)

			//Normalize the data
			data = addNormalizedValues(data);

			//Create the dimension nodes	        
			dimensionNamesNormalized = dimensions.map(function(d) {
	            return d + normalizeSuffix;
	        });
	        thetaScale = d3.scaleLinear().domain([ 0, dimensionNamesNormalized.length ]).range([ 0, Math.PI * 2 ]);
	        chartRadius = size / 2 - margin;
	        nodeCount = data.length;
	        panelSize = size - margin * 2;
	        dimensionNodes = dimensions.map(function(d, i) {
	            var auxAngle = thetaScale(i);
	            var auxX = chartRadius + Math.cos(auxAngle) * chartRadius;
	            var auxY = chartRadius + Math.sin(auxAngle) * chartRadius;
	            
	            //console.log(((360/dimensions.length)*i));
	            //console.log(Math.sin(angle)*chartRadius);
	            return {
	                index: nodeCount + i,
	                x: auxX,
	                y: auxY,
	                fx: auxX,
	                fy: auxY,
	                angleRad: (360/dimensions.length)*i,
	                name: d
	            };
	        });

	        //Generate the links
	        linksData = [];
	        data.forEach(function(d, i) {
	            dimensionNamesNormalized.forEach(function(dB, iB) {
	                linksData.push({
	                    source: i,
	                    target: nodeCount + iB,
	                    value: d[dB] //0.23 ajustou os pontos, possivelmente diferenças no sistema de forças.
	                });
	            });
	        });
	        
	        force = d3.forceSimulation(data.concat(dimensionNodes))
	        	.alphaDecay(0.1)
		        .force("link", d3.forceLink(linksData).strength( function(d) { return d.value; }));

        
	        svg = $el1.append("svg")
	        	.attr("width", size-1)
	        	.attr("height", size-1);
	        
	        svg.append("rect")
	        	.style("fill", "white")//.classed("bg", true)
	        	.attr("width", size)
	        	.attr("height", size);
	        
	        var root = svg.append("g")
        		.attr("transform", "translate(" + [ margin, margin ] + ")");
	        
	        // Draw the main circle
	        var panel = root.append("circle")//.classed("panel", true)
	        	.style("fill", "white")
	        	.style("stroke", "lightgray")
	        	.style("stroke-width", (arcWidth/2)+"px")
	        	.attr("r", chartRadius + arcWidth/2)
	            .attr("cx", chartRadius)
	            .attr("cy", chartRadius);
	        
	        if (drawLinks) {
	            var links = root.selectAll(".link")
	            	.data(linksData)
	                .enter()
	                	.append("line")
	                	.style("stroke", "silver")
	                	.style("stroke-opacity", 0.05);//.classed("link", true);
	        }
	        
	        var labelNodes = root.selectAll("circle.label-node")
	        	.data(dimensionNodes)
	        	.enter().append("circle")
	        		.style("fill", function(d, i){ return colorScaleDimensions(i) })
			    	.attr("cx", function(d) { return d.x; })
			    	.attr("cy", function(d) { return d.y; })
			        .attr("r", 6);
	        
	        //Generating width of each dimensionNode
	        var dimensionNodesWidth = [];
	        for (i = 0; i < dimensions.length; i++) {
	        	dimensionNodesWidth.push(360/dimensions.length);
	        };

	        var arc = d3.arc()
	            .innerRadius(chartRadius)
	            .outerRadius(chartRadius + arcWidth)
	            .cornerRadius(20);

	        var pie = d3.pie()
	            .padAngle(arcGap);
	        
	        svg.selectAll("path")
		        .data(pie(dimensionNodesWidth))
		        .enter().append("path")
			        .style("fill", function(d, i) { return colorScaleDimensions(i); })
			        .attr("d", arc)
			        .attr("id", function(d, i) { return "arc-" + i })
			        .attr("transform", 
			        	"translate(" + (chartRadius+margin) + "," + (chartRadius+margin) + ") rotate("+ (90-((360/dimensions.length)/2)) +")");
	        
		    svg.selectAll("text")
		    	.data(dimensions)
		    	.enter().append("text")	
			    	.attr("dx", 0)
			    	.style("text-anchor","middle")
			    	.attr("dy", (arcWidth/1.5))
			    	.attr("fill", "white")
			    	.attr("font-size", "15")
			    	.attr("font-weight", "bold")
			    	.attr("font-family", "Arial,Helvetica Neue,Helvetica,sans-serif;")
			    	.append("textPath")
				      	.attr("startOffset","27%")
				    	.style("text-anchor","middle")
				    	.attr("xlink:href", function(d, i) { return "#arc-" + i; })
				    	.text(function(d) { return d; });
		    
	        // Insert each data node to the SVG
		    var colorNodeScale = d3.scaleOrdinal().domain(["setosa", "versicolor", "virginica"]).range([0, 2]);
	        var nodes = root.selectAll("circle.dot").data(data).enter().append("circle")
	        	.style("fill-opacity", dotOpacity)//.classed("dot", true)
	        	.attr("r", dotRadius)
	        	.attr("fill", 
	        		function(d, i) {
	                	return colorScale( d[colorAcessor.substring(7, 11)] ); //TODO: verificar a função colorAcessor
	            	})
	            .on("mouseenter", 
	        	function(d) {
		            if (useTooltip) {
		                var mouse = d3.mouse(this);
		                tooltip.setText(tooltipFormatter(d)).setPosition(mouse[0], mouse[1]).show();
		            }
		            //events.dotEnter(d);
		            this.classList.add("active");
		        })
		        .on("mouseout", 
	        	function(d) {
		            if (useTooltip) {
		                tooltip.hide();
		            }
		            //events.dotLeave(d);
		            this.classList.remove("active");
		        });
	        
	        //Start the force simulation
	        force.on("tick", function() {
	            if (drawLinks) {
	                links
	                	.attr("x1", function(d) { return d.source.x; })
	                    .attr("y1", function(d) { return d.source.y; })
	            		.attr("x2", function(d) { return d.target.x; })
	    				.attr("y2", function(d) { return d.target.y; });
	            };
	            
	            nodes
	            	.attr("cx", function(d) { return d.x; })
	                .attr("cy", function(d) { return d.y; });
	        });
	        
	        var tooltipContainer = $el1.append("div")
	        	.attr("id", "radviz-tooltip");
	        
	        var tooltip = tooltipComponent(tooltipContainer.node());
	        
	    }else{ //### REFRESH DATA ###
	    	object.data(data);
	    	
	    	// Remove previous data
			//svg.selectAll("g").data([]).exit().remove();
	    	//svg.selectAll("text").data([]).exit().remove();
			//svg.data([]).exit().remove();			

			// Append the SVG on the target DIV
			svg = $el1.select("svg")
				.attr("width", size + margin.left + margin.right)
				.attr("height", size + margin.top + margin.bottom)
				.append("g")
		  	  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			
			
			
			// Apply styles
			//svg.selectAll('.bar rect')
			//	.style('shape-rendering', 'crispEdges');
	    }

		return object;
	};	
	
	var addNormalizedValues = function(data) {
        data.forEach(function(d) {
            dimensions.forEach(function(dimension) {
                d[dimension] = +d[dimension];
            });
        });
        var normalizationScales = {};
        dimensions.forEach(function(dimension) {
            normalizationScales[dimension] = d3.scaleLinear().domain(d3.extent(data.map(function(d, i) {
                return d[dimension];
            }))).range([ 0, 1 ]);
        });
        data.forEach(function(d) {
            dimensions.forEach(function(dimension) {
                d[dimension + "_normalized"] = normalizationScales[dimension](d[dimension]);
            });
        });
        return data;
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
    
	//Getter and setter methods
	object.$el = function(value){
		if (!arguments.length) return $el;
		$el = value;
		return object;
	};

	object.size = function(value){
		if (!arguments.length) return size;
		size = value;
		return object;
	};

	object.colorAcessor = function(value){
		if (!arguments.length) return colorAcessor;
		colorAcessor = value;
		return object;
	};
	
	object.colorScale = function(value){
		if (!arguments.length) return colorScale;
		colorScale = value;
		return object;
	};
	
	object.margin = function(value){
		if (!arguments.length) return margin;
		margin = value;
		return object;
	};

	object.data = function(value){
		if (!arguments.length) return data;
		data = value;
		return object;
	};
	
	object.dimensions = function(value){
		if (!arguments.length) return dimensions;
		dimensions = value;
		return object;
	};
	
	object.drawLinks = function(value){
		if (!arguments.length) return drawLinks;
		drawLinks = value;
		return object;
	};
	
	object.dotRadius = function(value){
		if (!arguments.length) return dotRadius;
		dotRadius = value;
		return object;
	};
	
	object.useTooltip = function(value){
		if (!arguments.length) return useTooltip;
		useTooltip = value;
		return object;
	};
	
	object.tooltipFormatter = function(value){
		if (!arguments.length) return tooltipFormatter;
		tooltipFormatter = value;
		return object;
	};
	
	object.colorScaleDimensions = function(value){
		if (!arguments.length) return colorScaleDimensions;
		colorScaleDimensions = value;
		return object;
	};
	
	object.dotOpacity = function(value){
		if (!arguments.length) return dotOpacity;
		dotOpacity = value;
		return object;
	};

	return object;
};