/*#############################################################################################################################################
* ### Define heatmap graph ##################################################################################################################
* #############################################################################################################################################*/

function RadvizComponent(){
	// Parameters
	var $el = d3.select("body");	
    var size = 0;  
    var margin = 28;    
    var colorAccessor = null; //Onde defino quem define as cores dos grupos. Exemplo: function(d){ return d['species']; };
    var colorScale = d3.scaleOrdinal(d3.schemeDark2);
    var data; //Todos os dados
    var dimensions = []; //Features selecionados
    var dataLabels = []; //Labels dos dados
    var drawLinks = false;
    var dotRadius = 6;
    var dotOpacity = 0.4;
    var currentDatabase = "";
    var useTooltip = true;
    var tooltipFormatter =
    	function(d) {
        	return d;
    	};
    var colorScaleDimensions = d3.scaleOrdinal(d3.schemeCategory10)
    	.domain([0,1,2,3,4,5,6,7,8,9]);
    
	// Format variables
	var formatDate = d3.timeFormat("%Y-%b-%d");
	var formatTime = d3.timeFormat("%H:%M");

    // Intern variables
    var svg, x, y;
    var width, height;    
    var force; 
    var histogramWidth = 120;

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
            dimensions.forEach(function(dimension) {
                d[dimension.name] = +d[dimension.name];
            });
        });
        var normalizationScales = {};
        dimensions.forEach(function(dimension) {
            normalizationScales[dimension.name] = d3.scaleLinear().domain(d3.extent(data.map(function(d, i) {
                return d[dimension.name];
            }))).range([ 0, 1 ]);
        });
        data.forEach(function(d) {
            dimensions.forEach(function(dimension) {
                d[dimension.name + "_normalized"] = normalizationScales[dimension.name](d[dimension.name]);
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
				size = height/2;
			}

			// Add the necessary Divs
			addDiv("rv1", $el, size+"px", size-1+"px", "left", false, "none");
			addDiv("rv2", $el, width-size+"px", size-1+"px", "left", false, "none");			
			addDiv("rv3", $el, width-20+"px", 110+"px", "left", false, "none");
			$el1 = d3.select("rv1");
			$el2 = d3.select("rv2");
			$el3 = d3.select("rv3");

			//Normalize the data
			data = addNormalizedValues(data);			
			
			//Create the dimension nodes	        
			dimensionNamesNormalized = dimensions.map(function(d) {
	            return d.name + normalizeSuffix;
	        });
	        thetaScale = d3.scaleLinear().domain([ 0, dimensionNamesNormalized.length ]).range([ 0, Math.PI * 2 ]);
	        chartRadius = size / 2 - margin;
	        nodeCount = data.length;
	        panelSize = size - margin * 2;
	        dimensionNodes = dimensions.map(function(d, i) {
	            var auxAngle = thetaScale(i);
	            var auxX = chartRadius + Math.cos(auxAngle) * chartRadius;
	            var auxY = chartRadius + Math.sin(auxAngle) * chartRadius;
	            
	            return {
	                index: nodeCount + i,
	                x: auxX,
	                y: auxY,
	                fx: auxX,
	                fy: auxY,
	                angleRad: (360/dimensions.length)*i,
	                name: d.name,
	                cluster: d.cluster
	            };
	        });
	        
	        //Generate the links
	        linksData = [];
	        data.forEach(function(d, i) {
	            dimensionNamesNormalized.forEach(function(dB, iB) {
	                linksData.push({
	                    source: i,
	                    target: nodeCount + iB,
	                    value: d[dB]
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
	        	.style("fill", "white")
	        	.attr("width", size)
	        	.attr("height", size);
	        
	        var root = svg.append("g")
        		.attr("transform", "translate(" + [ margin, margin ] + ")");
	        
	        // Draw the main circle
	        var panel = root.append("circle")
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
	                	.style("stroke-opacity", 0.05);
	        }
	        
	        var labelNodes = root.selectAll("circle.label-node")
	        	.data(dimensionNodes)
	        	.enter().append("circle")
	        		.style("fill", function(d, i){ 
	        			return colorScaleDimensions(d.cluster)
	        		})
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
			        .style("fill", function(d, i) { 
			        	return colorScaleDimensions(dimensions[i].cluster); 
			        })
			        .attr("d", arc)
			        .attr("id", function(d, i) { return "arc-" + i })
			        .attr("transform", "translate(" + (chartRadius+margin) + "," + (chartRadius+margin) + ") rotate("+ (90-((360/dimensions.length)/2)) +")")			        
			        .on("mouseenter", 
			        	function(d, j) {
				            actualFeature = j;
					        histData = new Array(data.length);
					        for (i = 0; i < data.length; i++) {
					        	histData[i] = data[i][dimensions[actualFeature].name];
					        };
					        
					        $el3.empty();
					        $el3.html("<div align='left'><b><font color='"+colorScaleDimensions(actualFeature)+"'>"+dimensionNodes[actualFeature].name+"</font> Values Distribution</b></div>");
					        var hist1 = histogram()
						    	.$el($el3)
						    	.data(histData)
						    	.width($el3.node().getBoundingClientRect().width-histogramWidth)
						    	.height($el3.node().getBoundingClientRect().height-40)
						    	.bins(20)
						    	.minColor("black")
						    	.maxColor(colorScaleDimensions(dimensions[j].cluster))
						    	.render();
				        });
	        
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
				    	.text(function(d) { return d.name; });
		    
	        // Insert each data node to the SVG
	        var nodes = root.selectAll("circle.dot").data(data).enter().append("circle")
	        	.style("fill-opacity", function(d,i){
	        		
	        		//TODO: for para saber qual o índice do none nos labels
	        		var currentNone = 0;
	        		for (j=0; j<dataLabels.length; j++) {
	        			if (dataLabels[j] == "none") {
	        				currentNone = j;
	        			}
	        		}
	        			        		
	        		if (d['label'] == currentNone) {
	        			return 0.1;
	        		} else {
	        			return dotOpacity
	        		}
	        		
	        	})
	        	.attr("r", dotRadius)
	        	.attr("fill", 
	        		function(d, i) {
	                	return colorScale( d[colorAcessor] ); //TODO: verificar a função colorAcessor
	            	})
	            .on("mouseenter", 
	        	function(d) {
		            if (useTooltip) {
		                var mouse = d3.mouse(this);
		                tooltip.setText(tooltipFormatter(d)).setPosition(20, 420).show();
		            }
		            this.classList.add("active");
		        })
		        .on("click", 
		        function(d) {
		        	$( "#tabs" ).tabs({ active: 3 });
		        	
		        	csvFile2 = "../../FILES/FET/"+currentDatabase+"/Extraction/AudioMP3/"+d['FileName']+"_info.csv";
		        	d3.csv(csvFile2, function (error, infoData) {
		        		LabelMaker()
				            .$el(d3.select("#labelmaker"))
				            .minFreq(0)
				            .maxFreq(infoData[0]['maxFreq'])
				            .sampleWindow(infoData[0]['sampleWindow'])
				            .audioSeconds(infoData[0]['audioSeconds'])
            		        .currentSample(d['SecondsFromStart']/infoData[0]['sampleWindow'])
				            .specImg("../../FILES/FET/"+currentDatabase+"/Extraction/AudioSpectrogram/"+d['FileName']+".png")
				            .render();
		            });
		        	
		        	wavesurfer.load("../../FILES/FET/"+currentDatabase+"/Extraction/AudioMP3/"+d['FileName']+".mp3");
		        	wavesurfer.setPlaybackRate(document.getElementById('audioRate').value);
		        	
		        	singleData = [];
		        	singleDataMean = [];
		        	data.forEach(function (dd, i) {
		        		if (dd['FileName'] == d['FileName']) {
		        			singleData.push({x:+dd['SecondsFromStart'], y:+dd[currentFeature]});
		        		}
		        		singleDataMean.push({x:+dd['SecondsFromStart'], y:+dd[currentFeature]});
                    });		        	
		        	
	        		singleData.push({x:0, y:0});
	        		singleData[singleData.length-1].x = singleData[singleData.length-2].x+singleData[1].x;;
	        		singleData[singleData.length-1].y = singleData[singleData.length-2].y;
	        		
	        		meanValue = d3.mean(singleDataMean, function(d) { return +d.y });
                   line1.mean(meanValue).data(singleData).render();		        	
                   //FIM do codigo do line chart
                   
		        	$('#filename').val(d['FileName']);

	        		document.getElementById("lcfeatures").options[0].selected = true;
	        		
	        		//Data for the label maker form	        		
	        	    document.getElementById('fname1').value = d['FileName'];
	        	    document.getElementById('fname2').value = d['FileName'];
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
	        
	        var tooltipContainer = d3.select("#rvtt").append("div") // $el1
	        	.attr("id", "radviz-tooltip");
	        
	        var tooltip = tooltipComponent(tooltipContainer.node());
	        
	        //################################################################################################	        
	        //################################################################################################        	        
	        
	        addDiv("rv4", $el2, $el2.node().getBoundingClientRect().width+"px", $el2.node().getBoundingClientRect().height+"px", "left", true, "none");//Era heigth 150
	        $el4 = d3.select("rv4");
	        $el4.style("border", "1px solid lightgray");
	        
	        $el4.html("<b>Data Labels</b>");
	        var enterSelection = $el4.append("svg")
	        	.attr("width", $el2.node().getBoundingClientRect().width-15)
	        	.attr("height", $el2.node().getBoundingClientRect().height*5)
	        	.append("g")
	        	.attr("width", $el2.node().getBoundingClientRect().width-15)
	        	.attr("height", $el2.node().getBoundingClientRect().height*5);
	        
	        enterSelection.selectAll("rect")
	        	.data(dataLabels)
	        	.enter()
	        	.append('rect')	        	
		        	.attr("x",5)
		        	.attr("y", function(d,i){ return (i*21)+3; })
		        	.attr("width",$el4.node().getBoundingClientRect().width)
		        	.attr("height", 20)
		        	.attr("fill", function(d,i){ return colorScale(i); })
		        	.style("cursor", "pointer")
		        .on("click", 
		        function(d) {
		        	$( "#tabs" ).tabs({ active: 3 });

		        	csvFile2 = "../../FILES/FET/"+currentDatabase+"/Extraction/AudioMP3/"+d+"_info.csv";
		        	d3.csv(csvFile2, function (error, infoData) {
		        		LabelMaker()
				            .$el(d3.select("#labelmaker"))
				            .minFreq(0)
				            .maxFreq(infoData[0]['maxFreq'])
				            .sampleWindow(infoData[0]['sampleWindow'])
				            .audioSeconds(infoData[0]['audioSeconds'])
            		        .currentSample(d['SecondsFromStart']/infoData[0]['sampleWindow'])
				            .specImg("../../FILES/FET/"+currentDatabase+"/Extraction/AudioSpectrogram/"+d+".png")
				            .render();
		            });
		        	
		        	wavesurfer.load("../../FILES/FET/"+currentDatabase+"/Extraction/AudioMP3/"+d+".mp3");
		        	wavesurfer.setPlaybackRate(document.getElementById('audioRate').value);
		        	
		        	var teste = 0;
		        	singleData = [];
		        	singleDataMean = [];		        	
		        	csvFile1 = "../../FILES/FET/"+currentDatabase+"/Extraction/features_norm.csv";
		        	d3.csv(csvFile1, function (error, singleData1) {
		        		singleData1.forEach(function (dd, i) {		        			
			        		if (dd['FileName'] == d) {			        			
			        			singleData.push({x:+dd['SecondsFromStart'], y:+dd[currentFeature]});
			        			teste = teste+1;
			        		}
			        		singleDataMean.push({x:+dd['SecondsFromStart'], y:+dd[currentFeature]});
	                    });
		        		
		        		singleData.push({x:0, y:0});
		        		singleData[singleData.length-1].x = singleData[singleData.length-2].x + singleData[1].x;;
		        		singleData[singleData.length-1].y = singleData[singleData.length-2].y;
		        		
		        		meanValue = d3.mean(singleDataMean, function(d) { return +d.y });
	                    line1.mean(meanValue).data(singleData).render();
		        	});
		        	
		        	$('#filename').val(d);

	        		document.getElementById("lcfeatures").options[0].selected = true;
	        		
	        		//Data for the label maker form	        		
	        	    document.getElementById('fname1').value = d;
	        	    document.getElementById('fname2').value = d;
		        });
	        
	        enterSelection.selectAll("text")
			    .data(dataLabels)
			  .enter().append("text")
			  	.attr("dy", ".75em")			  	
			    .attr("y", function(d,i) { return (i*21)+8; })
			    .attr("x", 7)
				.attr("text-anchor", "left")
				.text(function(d) { return d; })
				.style("fill", "white")
				.style("font-weight", "bold")
				.style("cursor", "pointer")
				.on("click", 
		        function(d) {
		        	$( "#tabs" ).tabs({ active: 3 });
		        	
		        	csvFile2 = "../../FILES/FET/"+currentDatabase+"/Extraction/AudioMP3/"+d+"_info.csv";
		        	d3.csv(csvFile2, function (error, infoData) {
		        		LabelMaker()
				            .$el(d3.select("#labelmaker"))
				            .minFreq(0)
				            .maxFreq(infoData[0]['maxFreq'])
				            .sampleWindow(infoData[0]['sampleWindow'])
				            .audioSeconds(infoData[0]['audioSeconds'])
            		        .currentSample(d['SecondsFromStart']/infoData[0]['sampleWindow'])
				            .specImg("../../FILES/FET/"+currentDatabase+"/Extraction/AudioSpectrogram/"+d+".png")
				            .render();
		            });
		        	
		        	wavesurfer.load("../../FILES/FET/"+currentDatabase+"/Extraction/AudioMP3/"+d+".mp3");
		        	wavesurfer.setPlaybackRate(document.getElementById('audioRate').value);
		        	
		        	var teste = 0;
		        	singleData = [];
		        	singleDataMean = [];		        	
		        	csvFile1 = "../../FILES/FET/"+currentDatabase+"/Extraction/features_norm.csv";
		        	d3.csv(csvFile1, function (error, singleData1) {
		        		singleData1.forEach(function (dd, i) {		        			
			        		if (dd['FileName'] == d) {			        			
			        			singleData.push({x:+dd['SecondsFromStart'], y:+dd[currentFeature]});
			        			teste = teste+1;
			        		}
			        		singleDataMean.push({x:+dd['SecondsFromStart'], y:+dd[currentFeature]});
	                    });
		        		
		        		singleData.push({x:0, y:0});
		        		singleData[singleData.length-1].x = singleData[singleData.length-2].x + singleData[1].x;;
		        		singleData[singleData.length-1].y = singleData[singleData.length-2].y;
		        		
		        		meanValue = d3.mean(singleDataMean, function(d) { return +d.y });
	                    line1.mean(meanValue).data(singleData).render();
		        	});
		        	
		        	$('#filename').val(d);

	        		document.getElementById("lcfeatures").options[0].selected = true;
	        		
	        		//Data for the label maker form	        		
	        	    document.getElementById('fname1').value = d;
	        	    document.getElementById('fname2').value = d;
		        });

	        //################################################################################################	        
	        //################################################################################################
	        // Histogram
	        
	        actualFeature = 0;
	        histData = new Array(data.length);
	        for (i = 0; i < data.length; i++) {
	        	histData[i] = data[i][dimensions[actualFeature].name];
	        };	        
	        
	        $el3.empty();
	        $el3.html("<div align='left'><b><font color='"+colorScaleDimensions(actualFeature)+"'>"+dimensionNodes[actualFeature].name+"</font> Values Distribution</b></div>");
	        var hist1 = histogram()
		    	.$el($el3)
		    	.data(histData)
		    	.width($el3.node().getBoundingClientRect().width-histogramWidth)
		    	.height($el3.node().getBoundingClientRect().height-40)
		    	.bins(20)
		    	.minColor("black")
		    	.maxColor(colorScaleDimensions(actualFeature))
		    	.render();
	        
	        //################################################################################################	        
	        //################################################################################################
	        
	    }else{ //### REFRESH DATA ###
	    	object.data(data);
	    	
			// Append the SVG on the target DIV
			svg = $el1.select("svg")
				.attr("width", size + margin.left + margin.right)
				.attr("height", size + margin.top + margin.bottom)
				.append("g")
		  	  	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
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
	
	object.dataLabels = function(value){
		if (!arguments.length) return dataLabels;
		dataLabels = value;
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
	
	object.currentDatabase = function(value){
		if (!arguments.length) return currentDatabase;
		currentDatabase = value;
		return object;
	};

	return object;
};