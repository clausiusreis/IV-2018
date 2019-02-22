
// Solution to load an external JS script
function importScript(scriptPath="") {
	var imported = document.createElement('script');
	imported.src = scriptPath;
	document.head.appendChild(imported);	
};

//Solution to load an external CSS stylesheet
function importCSS(scriptPath="") {
	var ss = document.createElement('link');
	ss.type = "text/css";
	ss.rel = "stylesheet";
	ss.href = scriptPath;
	document.getElementsByTagName("head")[0].appendChild(ss);	
};

function isEmptyObject(obj) {
	var name;
	for (name in obj) {
		return false;
	}
	return true;
};

//########################################################################################################################
//### Visualization control variables ####################################################################################
//########################################################################################################################
var csvFile = "testdata/CostaRica_015104.csv";

var feature1 = 'ACI_LEFT';
var feature2 = 'ADI_LEFT';
var feature3 = 'AEI_LEFT';
var dimensions = [feature1, feature2, feature3];

//Data filtering
var filterFromDate = "2015/03/06";
var filterToDate = "2015/03/20";

//Time filtering
var filterFromTime = "00:00";
var filterToTime = "23:59";

//Loaded visualization objects
var heatmap1;
var brushing1;
var radviz1;
var parcoords1;

//########################################################################################################################


//### Filter data and update vizualizations ###############################################################################
function updateViz() {

	var parseDate = d3.timeParse("%Y/%m/%d");
	var parseTime = d3.timeParse("%H:%M");

	d3.csv(csvFile, function(error, data) {	

		// Coerce the CSV data to the appropriate types.
		data.forEach(function(d, i) {
			d.date = parseDate( d.FILENAME.substring(7, 11) + "/" + d.FILENAME.substring(11, 13) + "/" + d.FILENAME.substring(13, 15) );
		    d.time = parseTime( d.FILENAME.substring(16, 18) + ":" + d.FILENAME.substring(18, 20) );
		    d.valueR = +d[feature1];
		    d.valueG = +d[feature2];
		    d.valueB = +d[feature3];
		});
		
		//Filter date
		data1 = data.filter( function(d){ return ( d.date >=parseDate(filterFromDate) && d.date <= parseDate(filterToDate) ); });
		
		//Filter time
		data1 = data1.filter( function(d){ return ( d.time >=parseTime(filterFromTime) && d.time <= parseTime(filterToTime) ); });

		if ($('#brushing').length) {
			if (isEmptyObject(brushing1)) {
				brushing1 = Brushing()
					.$el(d3.select("#brushingtabs-1"))
					.dateFrom('2015/03/06')
					.dateTo('2015/03/20')
					.snapTime(15)
					.render();
			};
		};

		if ($('#heatmap').length) {
			if (isEmptyObject(heatmap1)) {
				heatmap1 = HeatmapRGB()
					.$el(d3.select("#heatmaptabs-1"))
					.data(data1)
					.drawR(true)
					.drawG(true)
					.drawB(true)
					.textR(feature1)
					.textG(feature2)
					.textB(feature3)
					.render();
			} else {
				heatmap1.data(data1)
					.$el(d3.select("#heatmaptabs-1"))
					.drawR(true)
					.drawG(true)
					.drawB(true)
					.textR(feature1)
					.textG(feature2)
					.textB(feature3)
					.render();
			};
		};	
				
		if ($('#radviz').length) {
			if (isEmptyObject(radviz1)) {
				radviz1 = Radviz()
					.$el(d3.select("#radviztabs-1"))
					.colorAcessor( 'FILENAME' )
					.colorScale(d3.scaleOrdinal(d3.schemeCategory10))
					.data(data1)
					.dimensions(dimensions)
					.colorScaleDimensions(d3.scaleOrdinal(d3.schemeDark2))
					.drawLinks(false)
					.dotRadius(3)
					.dotOpacity(0.25)
					.useTooltip(true)
					.tooltipFormatter(
						function(d){
				        	return '<h1>' + d.species + '</h1>' + 
				        	dimensions.map(
				        		function(dB){
				            		return dB + ' Original: ' + d[dB] + " / Normalized:" + d[dB+"_normalized"].toFixed(3); 
				            	}
				        	).join('<br />');
				      	}
					).render();
			};
		};	

	});
};


function addDiv(divname, width="100%", height="auto") {
    $('#csscontent').empty();

    if (!$('#'+divname).length) {
        
        //Add the div and tabs
        $('#csscontent')
        .append('<div class="roundDiv" id="'+ divname 
                        +'" style="width:'+ width
                        +'; height:'+ height
                        +'; overflow-y:scroll'
                        +'; float:left'
                        +'; position: relative; top:0px; left:0px;">'
                        +'</div>');
    };
};

//Wavesurfer specrogram change function
function changeImage1(newImg) {
    document.getElementById("imgSpectrogram1").src = newImg;
};

function changeImage2(newImg) {
    document.getElementById("imgSpectrogram2").src = newImg;
};

