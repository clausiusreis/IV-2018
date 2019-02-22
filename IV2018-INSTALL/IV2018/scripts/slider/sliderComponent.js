
function sliderComponent(options){
	// Parameters
	var margin 		= {top: 0, right: 20, bottom: 10, left: 10},
	    width 		= options.width,	    
	    min			= options.min,
	    max			= options.max,
	    value 		= options.value,
	    container 	= options.container,
	    color		= options.color,
		event		= options.event;

    // Intern variables
    var svg, x;	
    var height = 30;
    var handle;

    var object = {};

	/*########################################################################################################################################
	* ### Method for render/refresh graph #################################################################################################### 
	* ########################################################################################################################################*/
	object.render = function(){
		
		if(!svg){ //### RENDER FIRST TIME ###		

			svg = container.append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
				.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	        
	        x = d3.scaleLinear()
		        .domain([min, max])
		        .range([0, width-40])
		        .clamp(true);

		    var slider = svg.append("g")
		        .attr("class", "slider")
		        .attr("transform", "translate(10,20)");
	        
		    slider.append("line")
			    .attr("class", "track")			    			    
			    .attr("x1", x.range()[0])
			    .attr("x2", x.range()[1])
			  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
			    .attr("class", "track-inset")
			  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
			    .attr("class", "track-overlay")
			    .call(d3.drag()
			        .on("start.interrupt", function() { slider.interrupt(); })
			        .on("start drag", 
			        	function(h) { 
			        		handle.attr("cx", x(x.invert(d3.event.x)));
			        		value = x.invert(d3.event.x);
			        		
			        		//Evento passado pelo objeto
			        		if (event)
			                    event();
			                d3.event.sourceEvent.stopPropagation();
			        	}));
		    
		    slider.insert("g", ".track-overlay")
			    .attr("class", "ticks")
			    .attr("transform", "translate(0," + 18 + ")")
			  .selectAll("text")
			  .data(x.ticks(5))
			  .enter().append("text")
			    .attr("x", x)
			    .attr("text-anchor", "middle")
			    .text(function(d) { return d; });
		    
		    handle = slider.insert("circle", ".track-overlay")
			    .attr("class", "handle")
			    .attr("r", 9)
			    .style("fill", color);
			
		    handle.attr("cx", x(value));		    
		    
	    }else{ //### REFRESH DATA ###
	    	//object.data(data);
	    	// Não precisei ainda...
	    }

		return object;
	};

	object.value = function () {       
        return value;
    }
	
	return object;
};