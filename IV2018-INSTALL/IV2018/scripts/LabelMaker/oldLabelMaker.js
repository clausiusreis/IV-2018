/*#############################################################################################################################################
* ### Define line graph ####################################################################################################################### 
* #############################################################################################################################################*/
function LabelMaker(){
	// Parameters
	var $el = d3.select("body")
	var minFreq = 0;
	var maxFreq = 22050;
	var sampleWindow = 1;
	var samples = 60;
	var audioSeconds = 60;
	var specImg = ""
	var currentSample = 0;
	
	var margin = {top:15, bottom:20, left:50, right:50};	
	var width = 600;
	var height = 270;
	var xScale;
	var xScale_sec;
	var xScale_sec_;
	var xScale_sec_time_axis;
	var xScale_sec_time;
	var yScale;
	var svg;
	var plotArea;
	var spectrogram;
	var gBrushes;
	var mySelections;
	var brushCount = 100;
	var All_Pos_Brushes;
	var brushes;
	var brush_selected_;
	var edge_;
	var id_brush_del;
	var formatTime = d3.timeFormat("%M:%S");
	
	var object = {};

	
	
	/*########################################################################################################################################
	* ### Method for render/refresh graph #################################################################################################### 
	* ########################################################################################################################################*/
	object.render = function(){
		$el.select("svg").remove();
		
		// create scales
		xScale = d3.scaleTime()
		  .range([0, width]);

		xScale_sec = d3.scaleTime()
		  	.domain([new Date(2013, 7, 1,8,0,0), new Date(2013, 7, 1,8,0,samples)])
			//.domain([0, 60])
			.rangeRound([0, width]);

		xScale_sec_ = d3.scaleLinear()
		  	.domain([0, width])
		  	.rangeRound([0, audioSeconds]);

		xScale_sec_time_axis = d3.scaleLinear()
			.domain([new Date(2013, 7, 1,8,0,0), new Date(2013, 7, 1,8,0,audioSeconds)])
			.rangeRound([0, width]);

		xScale_sec_time = d3.scaleLinear()
			.domain([new Date(2013, 7, 1,8,0,0), new Date(2013, 7, 1,8,0,audioSeconds)])
			.rangeRound([0, audioSeconds]);

		//Escala de frequências
		yScale = d3.scaleLinear()
			.domain([minFreq, maxFreq])
			.range([height, 0]);

		// create plot area
		svg = $el
		    .append('svg')
		    .attr('width', width + margin.left + margin.right)
		    .attr('height', height + margin.top + margin.bottom);

		plotArea = svg.append('g')
		    .attr("id", "chart")
		    .attr('transform',
		          'translate(' + margin.left + ',' + margin.top + ')');

		spectrogram = svg.append("svg:image")
			.attr('x', 1)
			.attr('y', margin.top)
			.attr('width', 700)
			.attr('height', 270)
			.attr("xlink:href", specImg)

		// Generate a SVG group to keep brushes
		gBrushes = svg.append('g')
		    .attr("height", height)
		    .attr("width", width)
		    .attr("fill", "none")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		    .attr("class", "brushes")
		    .style("opacity", 1);

		// Object to store brush selections and scatter data
		mySelections = {};

		// Keep the actual d3-brush functions and their IDs in a list:
		All_Pos_Brushes = [];
		brushes         = [];
		brush_selected_ = 0;
		edge_           = [];
		id_brush_del    = -1;

		// Add grid (TOP)
		svg.append("g")
		    .attr("class", "axis axis--grid")
		    .attr("transform", "translate(50," + (margin.top) + ")")//Grid at top
		    .call(d3.axisBottom(xScale_sec)
		    .ticks(d3.timeSecond, sampleWindow)
		    .tickSize(-10) //Size of grid
		    .tickFormat(function() { return null; }))
		    .selectAll(".tick")
		    .classed("tick--minor");

		//Time axis
		plotArea.append('g')
			.attr('class', 'axis axis--x')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(xScale_sec_time_axis)
					.ticks(10)
					.tickFormat(formatTime)
			);

		plotArea.append('g')
		    .attr('class', 'axis axis--y')
		    .call(d3.axisLeft(yScale));

		// /************ Event listener to update brush counts *************/

		newBrush();
		drawBrushes();
	
		return object;
	};

	var updateBrushes = function () {

	    //console.log("Update brush");

	    if( brushes.length > brushCount) {
	        let i = brushes.length-1;

	        while(i >= brushCount) {
	            let tempID = "brush-" + brushes[i].id;

	            // Delete selections
	            delete mySelections[tempID];

	            d3.select('#' + tempID).remove();
	            brushes.pop();
	            i--;
	        }

	        drawBrushes();
	    }

	    if(brushes.length === 0 && brushCount > 0) {
	        newBrush();
	        drawBrushes();
	    }

	}
	/************ End of update brush counts *************/

	//return an array that contains the closest brush edge to the left and right
	function getBrushesAround(brush, brushes){

	  var edge = [0, xScale_sec_(width)];

	  // console.log("\n");

		brushes.forEach(function(otherBrush) {

	    // console.log(otherBrush[0], otherBrush[1]);

	    if( brush[0] != otherBrush[0] && brush[1] != otherBrush[1] ){

	      // console.log("São diferentes");

	      if (brush[0] != null && otherBrush[1] <= brush[0]) {//* otherBrush[1] <= brush[1]

	        // console.log("Caso 1");

	        if (edge[0] != null && otherBrush[1] > edge[0] || edge[0] == null ){ //edge[0] = otherBrush_extent[1]

	          // console.log("LEFT 2");
	          edge[0] = otherBrush[1];
	        }

	      }else if ( brush[0] != null && otherBrush[0] >= brush[1] ) {

	        // console.log("Caso 2");

	        //Overlapping
	        // if( edge[1] != null && brush[1] > otherBrush[0] || edge[1] == null){
	        //   edge[1] = otherBrush[0];
	        // }

	        if (edge[1] != null && otherBrush[0] < edge[1] || edge[1] == null){ //edge[1] = otherBrush_extent[0];

	          // console.log("RIGHT 2");
	          edge[1] = otherBrush[0];
	        }

	      }else if( brush[0] <= otherBrush[1] && brush[0] >= otherBrush[0] && brush[1] >= otherBrush[1] || brush[1] <= otherBrush[0] && brush[1] >= otherBrush[1] && brush[0] <= otherBrush[0] ){


	                  if( brush[0] <= otherBrush[1] && brush[0] >= otherBrush[0] && brush[1] >= otherBrush[1] ){

	                      // console.log("Sobreposição direita");
	                      if( Math.abs(otherBrush[1] - brush[0]) <= Math.abs(brush[0] - otherBrush[0]) ){
	                        edge[0] = otherBrush[1];
	                      }else{
	                        edge[1] = otherBrush[0];
	                      }

	                  }

	            }else if( brush[1] >= otherBrush[0] && brush[1] <= otherBrush[1] && brush[0] <= otherBrush[0] ){

	                      // console.log("Sobreposição esquerda");
	                      if( Math.abs(brush[1] - otherBrush[0]) <= Math.abs(otherBrush[1] - brush[1]) ){
	                        edge[1] = otherBrush[0];
	                      }else{
	                        edge[0] = otherBrush[1];
	                      }

	                } else if( brush[1] >= otherBrush[1] && brush[0] <= otherBrush[0] || brush[1] <= otherBrush[1] && brush[0] >= otherBrush[0] ){

	                      if( brush[1] >= otherBrush[1] && brush[0] <= otherBrush[0] ){

	                              if( Math.abs(brush[1] - otherBrush[1]) >= Math.abs(otherBrush[0] - brush[0]) ){
	                                // console.log("Sobreposição fora, 1");
	                                edge[0] = otherBrush[1];
	                              }else{
	                                // console.log("Sobreposição fora, 2");
	                                edge[1] = otherBrush[0];
	                              }

	                      }else{

	                            if( Math.abs( otherBrush[1] - brush[1] ) <= Math.abs( brush[0] - otherBrush[0] ) ){
	                              // console.log("Sobreposição dentro, 1");
	                              edge[0] = otherBrush[1];
	                            }else{
	                              // console.log("Sobreposição dentro, 2");
	                              edge[1] = otherBrush[0];
	                            }
	                      }
	                }
	      }

		});

		return edge;

	}

	/******* Brush features *******/
	function newBrush() {

	  var brush = d3.brushX()
	    .extent( [[0, 0], [width, height]] )
	    //.on("start", brushstart)
	    .on("brush", brushed)
	    .on("end", brushend)

	  brushes.push({id: brushes.length, brush: brush});

	  function brushed() {

	    let selection = d3.event.selection.map(i => xScale_sec.invert(i));
	    mySelections[this.id] = {start: selection[0], end: selection[1]};

	    if(brushes.length > 1){

	      id_brush = this.id.split("-")[1];
	      brush_selected = d3.brushSelection( document.getElementById(this.id) );

	      if(brush_selected != null){
	          brush_selected_ = [brush_selected[0], brush_selected[1]];
	          brush_selected = [xScale_sec_(brush_selected[0]), xScale_sec_(brush_selected[1])];
	      }

	      var all_brushes = [];
	      for(var i = 1; i < brushes.length; i++){
	        // console.log("Len brush: ", brushes.length, brushes);
	        name_brush = "brush-" + (brushes[i].id-1);
	        // console.log("Name brush 1: ", name_brush);
	        br_arr = d3.brushSelection( document.getElementById(name_brush) );
	        // console.log("Name brush 2: ", br_arr);
	        if(br_arr != null){
	          br_arr = ( [xScale_sec_(br_arr[0]), xScale_sec_(br_arr[1])] );
	          all_brushes.push(br_arr);
	        }

	      }

	      edge_ = getBrushesAround(brush_selected, all_brushes);
	      All_Pos_Brushes = all_brushes;
	      brush_selected_ = brush_selected;

	    }

	  }

	  function brushend() {

	      // console.log("Brushend...");

	      // Figure out if our latest brush has a selection
	      var lastBrushID = brushes[brushes.length - 1].id;
	      var lastBrush = document.getElementById('brush-' + lastBrushID);
	      var selection = d3.brushSelection(lastBrush);

	      // ---- Snap ----
	      if (!d3.event.sourceEvent) return; // Only transition after input.
	      if (!d3.event.selection) return; // Ignore empty selections.
	      var d0 = d3.event.selection.map(i => xScale_sec.invert(i)),
	          d1 = d0.map(d3.timeSecond.round);
	      // If empty when rounded, use floor & ceil instead.
	      if (d1[0] >= d1[1]) {
	        d1[0] = d3.timeSecond.floor(d0[0]);
	        d1[1] = d3.timeSecond.offset(d1[0]);
	      }
	      // ---- ---- ----

	      d_end = d1.map(xScale_sec);

	      d3.select(document.getElementById(this.id)).transition().call(d3.event.target.move, d_end);

	      // If it does, that means we need another one
	      if (brushes.length < brushCount && selection && selection[0] !== selection[1]) {
	        newBrush();
	      }

	      // Always draw brushes
	      drawBrushes();

	   }

	}

	function drawBrushes() {

	  var brushSelection = gBrushes
	    .selectAll('.brush')
	    .data(brushes, function (d){return d.id});

		// Set up new brushes
	  brushSelection.enter()
	    .insert("g", '.brush')
	    .attr('class', 'brush')
	    .attr('id', function(brush){ return "brush-" + brush.id; })
	    .each(function(brushObject) {
	      // call the brush
	      brushObject.brush(d3.select(this));
	    });

	  brushSelection
	    .each(function (brushObject){
	      d3.select(this)
	        .attr('class', 'brush')
	        .selectAll('.overlay')
	        .style('pointer-events', function() {
	          var brush = brushObject.brush;
	          if (brushObject.id === brushes.length-1 && brush !== undefined) {
	            return 'all';
	          } else {
	            return 'none';
	          }
	        });
	    })

	}


	/************ Event and function for removing brushes *************/
	document.getElementById('remove-brushes-btn').addEventListener('click', () => {removeBrushes();});

	var removeBrushes = function() {

	    id_brush_del = -1;

	    d3.selectAll('.brush').remove();

	    let selected = document.getElementsByClassName('selected');

	    while(selected.length) {
	        selected[0].classList.remove('selected');
	    }

	    brushes = [];
	    mySelections = {};
	    newBrush();
	    drawBrushes();

	}
	/************ End of removing brushes *************/

	var isMySelection = function() {
	    if(Object.keys(mySelections).length === 0) {
	    	alert("No labels were created.");    	
	    	return true;
	    } else {
	        return false;
	    }
	}

	/************ Event and function for finding data *************/
	document.getElementById('addlabelname').addEventListener('click', () => { 
		document.getElementById('addlabelname').value = "";
	});

	document.getElementById('addlabelbtn').addEventListener('click', () => { 
		if (document.getElementById('addlabelname').value.trim() != "" & 
			document.getElementById('addlabelname').value.trim() != "INSERT LABEL NAME") {
			findData();
		} else {
			alert("Please insert label name.");
			document.getElementById('addlabelname').value = "INSERT LABEL NAME";
		}	
	});

	var findData = function() {
	    
	    // If there are no brush selections, don't bother finding the data
	    if(isMySelection()) return;

	    //console.log("Labels:", mySelections);

	    for(id in mySelections) {
	        let start = xScale_sec_(xScale_sec(mySelections[id].start));
	        let end = xScale_sec_(xScale_sec(mySelections[id].end));
	        console.log(start);
	        let label = document.getElementById('addlabelname').value;

	        console.log("Label \""+ label +"\": Start: " + start + " End: " + end);
	    }

	}
	/************ End of finding data *************/
	
	//Getter and setter methods
	object.$el = function(value){
		if (!arguments.length) return $el;
		$el = value;
		return object;
	};

	object.minFreq = function(value){
		if (!arguments.length) return minFreq;
		minFreq = value;
		return object;
	};

	object.maxFreq = function(value){
		if (!arguments.length) return maxFreq;
		maxFreq = value;
		return object;
	};

	object.specImg = function(value){
		if (!arguments.length) return specImg;
		specImg = value;
		return object;
	};
	
	object.sampleWindow = function(value){
		if (!arguments.length) return sampleWindow;
		sampleWindow = value;
		return object;
	}

	object.samples = function(value){
		if (!arguments.length) return samples;
		samples = value;
		return object;
	}
	
	object.audioSeconds = function(value){
		if (!arguments.length) return audioSeconds;
		audioSeconds = value;
		return object;
	}	
	
	object.currentSample = function(value){
		if (!arguments.length) return currentSample;
		currentSample = value;
		return object;
	}		
	
	return object;
};