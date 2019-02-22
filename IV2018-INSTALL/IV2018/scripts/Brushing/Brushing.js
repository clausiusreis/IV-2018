/*#############################################################################################################################################
* ### Define brushing graph ################################################################################################################### 
* ### Require JQuery        ###################################################################################################################
* #############################################################################################################################################*/
function Brushing(){
	// Parameters
	var $el = d3.select("body")
	var margin = {top: 0, right: 0, bottom: 2, left: 0};    
    var dateFrom, dateTo;
    var snapTime = 15;
    
//    var data;
    
    // Intern variables
    var svg, xD, xT;    
    var date0, date1, time0, time1;
    var width = 0;//190 - margin.left - margin.right;
    var height = 19 - margin.top - margin.bottom;
    
    var object = {};

    var parseDate = d3.timeParse("%Y/%m/%d");
	var parseTime = d3.timeParse("%H:%M");
	var formatDate = d3.timeFormat("%Y/%m/%d");
	var formatTime = d3.timeFormat("%H:%M");
	
	var formatDateDP = d3.timeFormat("%m/%d/%Y");
	
	function addDiv(divname, divtarget, width, heigth, floatPos, yControl, backColor="none") {
		if (yControl){
			divtarget.append('div')
			.attr('id', divname)
			.style('width', width)
			.style('height', heigth)
			.style('overflow-y', 'scroll')
			.style('background-color', backColor)
			.style('float', floatPos)
			.style('position', 'relative')
			.style('top', '0px')
			.style('left', '0px');
		} else {
			divtarget.append('div')
			.attr('id', divname)
			.style('width', width)
			.style('height', heigth)
			.style('background-color', backColor)
			.style('float', floatPos)
			.style('position', 'relative')
			.style('top', '0px')
			.style('left', '0px');			
		}
	}
	
    function brushEndedDate() {
    	if (!d3.event.sourceEvent) return; // Only transition after input.
    	if (!d3.event.selection) {
    		date1[0] = parseDate(dateFrom);
    		date1[1] = parseDate(dateTo);
    		date1[1].setDate(date1[1].getDate()+1);
    		
    		$("#from").datepicker('setDate', formatDateDP(date1[0]) );    		
			$("#to").datepicker('setDate', formatDateDP(date1[1]-1) );
		
			// Update the visualizations
    		filterFromDate = formatDate(date1[0]);
    		filterToDate = formatDate(date1[1]-1);
    		updateViz();
			
    		return;
    	};

    	date0 = d3.event.selection.map(xD.invert);
    	date1 = date0.map(d3.timeDay.round);    	
    	
    	// If empty when rounded, use floor & ceil instead.
    	if (date1[0] >= date1[1]) {
    		date1[0] = d3.timeDay.floor(date0[0]);
    		date1[1] = d3.timeDay.offset(date1[1]);
    	}

    	$("#from").datepicker('setDate', formatDateDP(date1[0]) );
		$("#to").datepicker('setDate', formatDateDP(date1[1]-1) );
    			
    	d3.select(this).transition().call(d3.event.target.move, date1.map(xD));
    	
    	// Update the visualizations
		filterFromDate = formatDate(date1[0]);
		filterToDate = formatDate(date1[1]-1);
		updateViz();
	};
	
	function brushEndedTime() {
		if (!d3.event.sourceEvent) return; // Only transition after input.
		if (!d3.event.selection) {
			time1[0] = parseTime('00:00');
    		time1[1] = parseTime('23:59');
    		
    		$("#fromT").val(formatTime(time1[0]));
    		$("#toT").val(formatTime(time1[1]));
    		
    		// Update the visualizations
    		filterFromTime = formatTime(time1[0]);
    		filterToTime = formatTime(time1[1]-1);
    		updateViz();
    		
			return; // Ignore empty selections.
		};
		
		time0 = d3.event.selection.map(xT.invert),
		time1 = time0.map(d3.timeMinute.every(snapTime).round);

		// If empty when rounded, use floor & ceil instead.
		if (time1[0] >= time1[1]) {
			time1[0] = d3.timeHour.floor(time0[0]);
			time1[1] = d3.timeHour.offset(time1[0]);
		}

		$("#fromT").val(formatTime(time1[0]));
		$("#toT").val(formatTime(time1[1]));
		
		d3.select(this).transition().call(d3.event.target.move, time1.map(xT));
				
		// Update the visualizations
		filterFromTime = formatTime(time1[0]);
		filterToTime = formatTime(time1[1]-1);
		updateViz();

	}

	/*########################################################################################################################################
	* ### Method for render/refresh graph #################################################################################################### 
	* ########################################################################################################################################*/
	object.render = function(){
		
		if(!svg){ //### RENDER FIRST TIME ###		
			
			if (width == 0){
				var autowidth = $el.node();
				width = autowidth.getBoundingClientRect().width - margin.left - margin.right - 5;
			}

			//Divs to hold the brush
			widthBr1 = 210;
			widthBr2 = width - (widthBr1 - margin.left - margin.right);
			addDiv('br1', $el, widthBr1+'px', height*2+'px', 'left', yControl=false, backColor="none");
			addDiv('br2', $el, widthBr2+'px', (height*2+margin.bottom)+'px', 'left', yControl=false, backColor="none");
			addDiv('br2-1', d3.select('#br2'), (widthBr2-3)+'px', (height+10)+'px', 'left', yControl=false, backColor="none");
			addDiv('br2-2', d3.select('#br2'), (widthBr2-3)+'px', height+'px', 'left', yControl=false, backColor="none");

			//Add the max and min dates do the brush (Using data and Nested)
			$('#br1').append("<div align='right'>Date 0: <input type='text' name='from' id='from' size='8' disabled/>&nbsp;"+
					"Date 1: <input type='text' name='to' id='to' size='8' disabled/>&nbsp;</div>");		
			$('#from, #to').datepicker();
			$("#from").datepicker('setDate', formatDateDP(parseDate(dateFrom)));
			$("#to").datepicker('setDate', formatDateDP(parseDate(dateTo)));
			
			dateAux = parseDate(dateTo);
			dateAux.setDate(dateAux.getDate() + 1)			
			xD = d3.scaleTime()
		    	.domain([parseDate(dateFrom), dateAux-1])
		    	.rangeRound([0, widthBr2]);
						
			svg = d3.select('#br2-1').append("svg")				
				.attr("width", widthBr2 + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//TODO: Calcular, se for menos de 1 mês mostrar ticks em dias, senão mostrar em meses.
			//Linhas e quadrados
			svg.append("g")
			    .attr("class", "axis axis--grid")
			    .attr("transform", "translate(0," + height + ")")
			    .call(d3.axisBottom(xD)
			        .ticks(d3.day, 1)
			        .tickSize(-height)
			        .tickFormat(function() { return null; }))
			    .selectAll(".tick")
			    	.classed("tick--minor", function(d) { return d.getDay(); });
	
			//Texto e ticks abaixo do texto
			svg.append("g")
			    .attr("class", "axis axis--x")
			    .attr("transform", "translate(0," + height + ")")
			    .call(d3.axisBottom(xD)
			        .ticks(d3.timeday)
			        .tickPadding(-15))
			    .attr("text-anchor", null)
			    .selectAll("text")
			    	.attr("x", 2);
	
			svg.append("g")
			    .attr("class", "brush")			    
			    .call(d3.brushX()
			        .extent([[0, 0], [widthBr2, height]])
			        .on("end", brushEndedDate));
			
			//####### DIV 2 #######
			//$('#br1').append("<div style='height:8px;'></div>");
			$('#br1').append("<div style='padding:8px 0px 0px 0px;' align='right'>Time 0: <input type='text' name='fromT' id='fromT' size='5' disabled/>&nbsp;"+
			"Time 1: <input type='text' name='toT' id='toT' size='5' disabled/>&nbsp;</div>");
			$("#fromT").val('00:00');
			$("#toT").val('23:59');
			
			xT = d3.scaleTime()				
	    		.domain([parseTime('00:00'), parseTime('23:59')])
	    		.rangeRound([0, widthBr2]);

			svg1 = d3.select('#br2-2').append("svg")				
				.attr("width", widthBr2 + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			//Linhas e quadrados
			svg1.append("g")
			    .attr("class", "axis axis--grid")
			    .attr("transform", "translate(0," + height + ")")
			    .call(d3.axisBottom(xT)
			        .ticks(d3.timeHour, 24)
			        .tickSize(-height)
			        .tickFormat(function() { return null; }))			        
			    .selectAll(".tick")
			    	.classed("tick--minor", function(d) { return d.getHours(); });

			//Texto e ticks abaixo do texto
			svg1.append("g")
			    .attr("class", "axis axis--x")
			    .attr("transform", "translate(0," + height + ")")
			    .call(d3.axisBottom(xT)
			        //.ticks(d3.timeMinute.every(30))
		    		.ticks(d3.timeHour.every(1))
			        .tickSize(-height)
			        .tickPadding(-10)
			        //.tickFormat(d3.timeFormat("%H:%M")))
			        .tickFormat(d3.timeFormat("%H")))
			    .attr("text-anchor", 'start')
			    .selectAll("text")
			    	//.attr("transform", "rotate(-90)")
			    	.attr("x", 2);
					//.attr("y", 3);
	
			svg1.append("g")
			    .attr("class", "brush")			    
			    .call(d3.brushX()
			        .extent([[0, 0], [widthBr2, height]])
			        .on("end", brushEndedTime));
			
			//TODO: Aplicar os estilos aqui dentro e remover o aquivo CSS
			// Apply styles to date
			svg.selectAll('.axis--grid .domain')
				.style('fill', 'rgb(34,179,218)')
				.style('stroke', 'none');
		
			svg.selectAll('.axis--x .domain')
				.style('stroke', '#000');
			
			svg.selectAll('.axis--grid .tick line')
				.style('stroke', '#000');
		
			svg.selectAll('.axis--grid .tick--minor line')
				.style('stroke-opacity', '.5');			
		
			// Apply styles to time
			svg1.selectAll('.axis--grid .domain')
				.style('fill', 'rgb(9,242,98)')
				.style('stroke', 'none');
		
			svg1.selectAll('.axis--x .domain')
				.style('stroke', '#000');
			
			svg1.selectAll('.axis--grid .tick line')
				.style('stroke', '#000');
		
			svg1.selectAll('.axis--grid .tick--minor line')
				.style('stroke-opacity', '.5');

	    }else{ //### REFRESH DATA ###	    	
	    	
			// Remove previous data
//			svg.selectAll("g").data([]).exit().remove();
//			svg.selectAll("text").data([]).exit().remove();
	    }

		return object;
	};

	//Getter and setter methods
	object.$el = function(value){
		if (!arguments.length) return $el;
		$el = value;
		return object;
	};

	object.dateFrom = function(value){
		if (!arguments.length) return dateFrom;
		dateFrom = value;
		return object;
	};
	
	object.dateTo = function(value){
		if (!arguments.length) return dateTo;
		dateTo = value;
		return object;
	};
	
	object.getSelectionDate = function(){
		return date1;
	};
	
	object.getSelectionTime = function(){
		return time1;
	};
	
	object.snapTime = function(value){
		if (!arguments.length) return snapTime;
		snapTime = value;
		return object;
	};
	
	return object;
};