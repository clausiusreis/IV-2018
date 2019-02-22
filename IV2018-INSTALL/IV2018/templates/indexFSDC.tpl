{include file='page_header.tpl'}

<link href="../libs/jquery.uploadfile.css" rel="stylesheet">
<script src="../libs/jquery.uploadfile.js"></script>
<script src="../scripts/Matrix/visMatrix.js"></script>
<script src="../libs/d3-scale-chromatic.v1.js"></script>
<script src="../scripts/radviz/RadvizComponent.js"></script>
<script src="../scripts/histogram/histogramV4.js"></script>
<script src="../scripts/LineChart/linechart.js" type="text/javascript"></script>
<script src="../libs/lodash.js"></script>
<script src="../libs/wavesurfer/wavesurfer205.js" type="text/javascript"></script>
<script type="text/javascript" src="../scripts/LabelMaker/LabelMaker.js"></script>


<link rel="stylesheet" type="text/css" href="../scripts/slider/sliderStyle.css">
<script src="../scripts/slider/sliderComponent.js"></script>

<script type="text/javascript" src="../scripts/GeneticAlgorithm/main.js"></script>
<script type="text/javascript" src="../scripts/GeneticAlgorithm/algorithm.js"></script>
<script type="text/javascript" src="../scripts/GeneticAlgorithm/utils.js"></script>

<style>
    #sortable { list-style-type: none; margin: 0; padding: 0; width: 100%; }
    #sortable li { margin: 0 3px 3px 3px; padding: 0.4em; padding-left: 1.5em; font-size: 1.4em; height: 18px; }
    #sortable li span { position: absolute; margin-left: -1.3em; }
    #sortableAll { list-style-type: none; margin: 0; padding: 0; width: 100%; }
    #sortableAll li { margin: 0 3px 3px 3px; padding: 0.4em; padding-left: 1.5em; font-size: 1.4em; height: 18px; }
    #sortableAll li span { position: absolute; margin-left: -1.3em; }
</style>

<div id="csscontent">
	
    <div id="title" class="roundDiv" align="center">
    	<div align="center"><font size=5><strong><span id="dbnametitle">Feature Selection by Distance/Correlation Matrix</span></strong></font></div>
    </div>
    
    <div id="content1" class="roundDiv2" align="center" style="height:610px;">			
			
			<div style="float: left;">
				<!-- Tabs -->
	            <div id="tabs">
	            	<ul>
	            		<li><a href="#tabs-01">Data Input / Visualization Settings</a></li>
	            		<li><a href="#tabs-11">Distance Matrix</a></li>
	            		<li><a href="#tabs-12">Correlation Matrix</a></li>
	            		<li><a href="#tabs-13">Spectrogram</a></li>
	            	</ul>
	            	<div id="tabs-01">
	            		<div class="divTable" style="width: 100%;">
	                    	<div class="divTableBody">
	                    		<div class="divTableRow">
	                    			<div class="divTableCell">
	                    				<div id="settings1" style='display: inline;'>
	                    	
    										<table>
    										<tr>
    										<td>
        										<form action="../scripts/indexFSDC.php?action=upload" method="post" enctype="multipart/form-data">
                                               		<fieldset style="width: 330px; height: 200px;">
                                            			<legend><strong>Database List</strong></legend>
                                        				<select name="dblist" id="dblist" size=2 style="width: 100%; height: 170px;" 
                                        					onclick="$('#dirName').val($('#dblist').find(':selected').text());">
                                                        	{section name=linha loop=$soundscapedblist}
                                                            <option value="{$soundscapedblist[linha].ID}">{$soundscapedblist[linha].name}</option>
                                                            {/section}
                                                        </select>
                                                        <br>
                                                        <input id='labels' name='labels' type='hidden' value='x'>
                                                        <div align="center"><input type="submit" value="Load Database"></div>
                                            		</fieldset>
                                           		</form>
                                       		</td>
                                       		<td>
                                       		
                                        	<fieldset style="width: 330px; height: 200px;">
                                        		<legend><strong>Visualization Settings</strong></legend>
                                    			<form name="changeFrm" id="changeFrm" action="../scripts/indexFSDC.php?action=change" method="post" enctype="multipart/form-data">        			
                                
                               						<table>
                               						<tr><td>
                                                	<strong>Reset Label to Filename: </strong>
                                                	</td><td>
                                    				<select id="filenameAsLabel" name="filenameAsLabel" style="width:120px;">                                        				
                                        				<option value="0" selected="selected">False</option>                                     
                                        				<option value="1">True</option>   				
                                    				</select>
                                    				</td></tr>
            										<tr><td>
                                                	<strong>Number of Clusters: </strong>
                                                	</td><td>
                                    				<select id="numberOfClusters" name="numberOfClusters" style="width:120px;">
                                        				<option value=1>3</option>
                                        				<option value=2>4</option>
                                        				<option value=3>5</option>
                                        				<option value=4>6</option>
                                        				<option value=5>7</option>
                                        				<option value=6>8</option>
                                        				<option value=7>9</option>
                                        				<option value=8>10</option>
                                    				</select>
                                    				</td></tr>
                                    				<tr><td>
                                    				<strong>Sorting Method: </strong>
                                    				</td><td>
                                    				<select id="orderMethod" name="orderMethod" style="width:120px;">
                                        				<option value=0>single</option>
                                        				<option value=1>complete</option>
                                        				<option value=2>average</option>
                                        				<option value=3>weighted</option>
                                        				<option value=4>centroid</option>
                                        				<option value=5>median</option>
                                        				<option value=6>ward</option>
                                    				</select>
                                    				</td></tr>
                                    				<tr><td>
                                    				<strong>Clusters By: </strong>
                                    				</td><td>
                                    				<select id="clusterOn" name="clusterOn" style="width:120px;">
                                        				<option value=0>Distance Matrix</option>
                                        				<option value=1>Correlation Matrix</option>    				
                                    				</select>
                                    				</td></tr>
                                    				<tr><td>&nbsp;</td><td>                                    							
                                    					<input id='dbName' name='dbName' type='hidden' value=''>
                                    					<input id='dirName' name='dirName' type='hidden' value=''>
                                    					<input type="button" onClick='document.getElementById("changeFrm").submit();' value="Apply Changes">
                                    				</td></tr></table>
                                				</form>
                                    		</fieldset>
                                    		</td>
                                    		</tr>
	                    					</table>
	                    				</div>
	                    			</div>
	                    		</div>
	                    	</div>
	                    </div>            		
	            	</div>
	            	<div id="tabs-11">            	
	                	<div class="divTable" style="width: 100%;">
	                    	<div class="divTableBody">
	                    		<div class="divTableRow">
	                    			<div class="divTableCell">
	                    				<div id="mat1" style='display: inline;'></div>
	                    			</div>
	                    		</div>
	                    	</div>
	                    </div>
	            	</div>

	            	<div id="tabs-12">
	            		<div class="divTable" style="width: 100%;">
	                    	<div class="divTableBody">
	                    		<div class="divTableRow">
	                    			<div class="divTableCell">
	                    				<div id="mat2" style='display: inline;'></div>
	                    			</div>
	                    		</div>
	                    	</div>
	                    </div>            		
	            	</div>            	
	            	<div id="tabs-13">
	            		<div class="divTable" style="width: 100%;">
	                    	<div class="divTableBody">
	                    		<div class="divTableRow">
	                    			<div class="divTableCell">
	                    				<div id="spec1" style='display: inline;'>	                    				
    	                    				<div>
                                    			<!-- <button id="rwd-btn" class="btn btn-secondary" onclick="wavesurfer.seekTo(0)"></button>  -->
                                    			<button id="play-btn" class="btn btn-success" onclick="wavesurfer.playPause()">Play/Pause</button>
                                    			<input name="audioRate" id="audioRate" value=1 size=1>
                                    			<button id="remove-brushes-btn" class="btn btn-danger">Clear Label</button>
                                    			<button id="addlabelbtn" class="btn btn-primary">Add Label</button>
                            					<input id="addlabelname" class="form-control" type="text" id="usr" style="width: 70px; height: 25px;" value=":::: LABEL ::::">
												<button id="thresholdlabelbtn" class="btn btn-primary">Threshold based Label</button>
												<select id="tcond" name="tcond">
													<option>Over</option>
													<option>Under</option>
												</select>
                                    			<div id="waveform" style="width: 600px; margin-left: 0px; margin-top: 2px;"></div>
                                    			<!-- Load the audio after the components are set (waveform) -->
                                                {literal}
                                                    <script>
                                                        var wavesurfer = WaveSurfer.create({
                                                            audioRate: $("#audioRate").value,
                                                		    container: '#waveform',
                                                		    waveColor: 'black',
                                                		    progressColor: 'red',
                                                	    	barWidth: 3,
                                                	    	//barHeight:5,
                                                	    	normalize: true,
                                                	    	splitChannels: false,
                                                	    	height: 60,
                                                	    	cursorColor: 'black',
                                                	    	cursorWidth: 2
                                                		});
                                                    </script>
                                                {/literal}
                                    			<div id="labelmaker"></div>
                                    			<div id="linechart1"></div>
                                    			<div style="float: left; width: 100%;">
                                    				<table>
                                    					<tr>
                                    						<td><b>Features list:</b></td>
                                    						<td><b>Equalizer:</b></td>
                                    					</tr>
                                    					<tr>
                                    						<td><select id="lcfeatures" name="lcfeatures" onchange="updateLineChart();" size="6" style="width: 300px;"></select></td>
                                    						<td>
                                    							<textarea id="labelslist" name="labelslist" rows="6" cols="40" style="display:none;"></textarea>
                                    							<div style="width: 300px; height: 94px; border: 1px solid lightgray;">
                                    								<div id="equalizer1"></div>
                                    								<div><img src="../images/equalizer.png"></div>
                                    							</div>
                                    							<!-- <select id="labelslist" name="lcfeatures" size="6" style="width: 300px;"></select> -->
                                    						</td>
                                    					</tr>
                                    				</table>
                                    				
                                    				<form name="labelFrm" id="labelFrm" action="../scripts/addLabels.php?action=add" method="post" enctype="multipart/form-data">
                                    					<input id='dbName1' name='dbName1' type='hidden' value=''>
                                    					<input id='dirName1' name='dirName1' type='hidden' value=''>
                                    					<input id='fname1' name='fname1' type='hidden' value=''>
                                    					<input id='labels1' name='labels1' type='hidden' value=''>
                                    				</form>
                                    				
                                    				<form name="labelTFrm" id="labelTFrm" action="../scripts/addLabelsThreshold.php?action=add" method="post" enctype="multipart/form-data">
                                    					<input id='dbName2' name='dbName2' type='hidden' value=''>
                                    					<input id='dirName2' name='dirName2' type='hidden' value=''>
                                    					<input id='fname2' name='fname2' type='hidden' value=''>
                                    					<input id='feature2' name='feature2' type='hidden' value=''>
                                    					<input id='threshold2' name='threshold2' type='hidden' value=''>
                                    					<input id='tcond2' name='tcond2' type='hidden' value=''>
                                    				</form>
                                    				
        										</div>
                                    		</div>
	                    				</div>
	                    			</div>
	                    		</div>
	                    	</div>
	                    </div>            		
	            	</div>
	            </div>
            </div>

            <div id="pretabs2">
				<!-- Tabs -->
	            <div id="tabs2">
	            	<ul>	            		
	            		<li id="#t222"><a href="#tabs-222">Feature Selection</a></li>
	            	</ul>	            	
	            	<div id="tabs-222">            	
	                	<div class="divTable" style="width: 100%;">
	                    	<div class="divTableBody">
	                    		<div class="divTableRow">
	                    			<div class="divTableCell">
										<div style="float: left; width: 100%;">
    										<button id="up1" style="width: 40%;" onclick='moveUp("sortable");'>&uarr;</button>											
											<button id="down1" style="width: 40%;" onclick='moveDown("sortable");'>&darr;</button>
											<br>
    										<select id="sortable" size=8></select>
    										<select id="sortable_ID" style="visibility: hidden"></select>									
										</div>
										<div align="center" style="float: left; width: 100%;">
												<table>
													<tr>
														<td><img src="../images/add.png" onclick="insertFeature();"></td>
														<td>&nbsp;&nbsp;&nbsp;</td>
														<td><img src="../images/remove.png" onclick="removeFeature();"></td>
														<td>&nbsp;&nbsp;&nbsp;</td>
														<td><img src="../images/removeAll.png" onclick="removeAllFeature();"></td>
													</tr>
												</table>											
										</div>
										<div style="float: left; width: 100%;">
    										<select id="sortableAll"></select>
										</div>
	                    			</div>	                    				                    			
	                    		</div>	                    		
	                    	</div>	                    	
	                    </div>
	                    <br>
	                    <input type="button" value="Redraw" onclick="drawRadviz(1);">&nbsp;
	                    <input type="button" value="Reorder and Redraw" onclick="drawRadviz(2);">
	                    <br>
	                    <br>	                    
	                    <div style="background-color: white; border:1px solid black; width: 100%;" align="left">
	                    	<table>
	                    		<tr>
	                    			<td>
		        						<strong> Database:</strong>
		        					</td>
		        					<td>
		        						<span id="dbname1"></span><br>
		        					</td>
		        				</tr>
		        				<tr>
		        					<td>
		        						<strong> Nº of Files:</strong>
		        					</td>
		        					<td>
		        						<span id="dbfiles1"></span><br>
		        					</td>
		        				</tr>
		        				<tr>
		        					<td>
		        						<strong> Nº of Samples:</strong> 
		        					</td>
		        					<td>
		        						<span id="dbsamples1"></span><br>
		        					</td>
		        				</tr>
		        				<tr>
		        					<td>
		        						<strong> Sample Window:</strong> 
		        					</td>
		        					<td>
		        						<span id="dbsamplewindow1"></span><br>
		        					</td>
		        				</tr>
		        			</table>
		    		    </div>
		    		        	
	                    
	            	</div>
	            	<div id="rvtt"></div>
	            </div>
            </div>

			<div style="float: left;">
				<!-- Tabs -->
	            <div id="tabs1">
	            	<ul>
	            		<li id="#t21"><a href="#tabs-21">Radviz</a></li>	
	            		<li><a href="#tabs-11">Distance Matrix</a></li>
	            		<li><a href="#tabs-12">Correlation Matrix</a></li>            		
	            	</ul>
	            	<div id="tabs-21">            	
	                	<div class="divTable" style="width: 100%;">
	                    	<div class="divTableBody">
	                    		<div class="divTableRow">
	                    			<div id="radvizplace" class="divTableCell">
										<div id="radviz1"></div>
	                    			</div>
	                    		</div>
	                    	</div>
	                    </div>
	            	</div>
	            	<div id="tabs-11">            	
	                	<div class="divTable" style="width: 100%;">
	                    	<div class="divTableBody">
	                    		<div class="divTableRow">
	                    			<div class="divTableCell">
	                    				<div id="mat11" style='display: inline;'></div>
	                    			</div>
	                    		</div>
	                    	</div>
	                    </div>
	            	</div>

	            	<div id="tabs-12">
	            		<div class="divTable" style="width: 100%;">
	                    	<div class="divTableBody">
	                    		<div class="divTableRow">
	                    			<div class="divTableCell">
	                    				<div id="mat22" style='display: inline;'></div>
	                    			</div>
	                    		</div>
	                    	</div>
	                    </div>            		
	            	</div>	           	
	            </div>
            </div>
			<br>
    </div>

</div>

<input id='jsonFromPHP' type='hidden' value='{if isset($json)}{$json}{else}{literal}{}{/literal}{/if}'>
<input id='status' type='hidden' value='{$status}'>
<input id='filename' type='hidden' value=''>


{literal}
<script>	

	$( "#audioRate").spinner();
	$( "#tcond").selectmenu({ width: 80 });
	//option = document.createElement( 'option' );
    //option.value = option.text = i;
    //select.add( option );	
    
    function updateLineChart(){
    	
    	var filename = $('#filename').val();
		var currentFeature = $('#lcfeatures').val();
    	
    	//csvFile1 = "../../FILES/FET/"+json['dbName']+"/Extraction/AudioFeatures/"+filename+".csv";
    	csvFile1 = json['locationFeatureDataOriginal'];
    	d3.csv(csvFile1, function (error, singleData) {
    		
    		singleData1 = [];
    		singleData1Mean = [];
    		singleData.forEach(function (dd, i) {
        		if (dd['FileName'] == filename) {
        			singleData1.push({x:+dd['SecondsFromStart'], y:+dd[currentFeature]});
        		}
        		singleData1Mean.push({x:+dd['SecondsFromStart'], y:+dd[currentFeature]});
            });

    		singleData1.push({x:0, y:0});
    		singleData1[singleData1.length-1].x = singleData1[singleData1.length-2].x+singleData1[1].x;;
    		singleData1[singleData1.length-1].y = singleData1[singleData1.length-2].y;   		
    		
    		meanValue = d3.mean(singleData1Mean, function(d) { return +d.y });
    		line1.mean(meanValue).data(singleData1).render();
        });
    }

	function insertFeature()
    {
        var e = document.getElementById("sortableAll");
		var strUser = e.options[e.selectedIndex].value;
        
        var select = document.getElementById("sortable");            
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(strUser));            
        select.appendChild(option);
    }
    
    function removeFeature()
    {
        var e = document.getElementById("sortable");
		e.remove(e.selectedIndex);
    }

    function removeAllFeature()
    {
        var e = document.getElementById("sortable");        
        for(var i = e.options.length - 1 ; i >= 0 ; i--)
        {
            e.remove(i);
        }
    }

    function moveUp(obj)
    {
        var ddl = document.getElementById(obj);

        var selectedItems = new Array();
        var temp = {innerHTML:null, value:null};
        for(var i = 0; i < ddl.length; i++)
            if(ddl.options[i].selected)
                selectedItems.push(i);
    
        if(selectedItems.length > 0)    
            if(selectedItems[0] != 0)
                for(var i = 0; i < selectedItems.length; i++)
                {
                    temp.innerHTML = ddl.options[selectedItems[i]].innerHTML;
                    temp.value = ddl.options[selectedItems[i]].value;
                    ddl.options[selectedItems[i]].innerHTML = ddl.options[selectedItems[i] - 1].innerHTML;
                    ddl.options[selectedItems[i]].value = ddl.options[selectedItems[i] - 1].value;
                    ddl.options[selectedItems[i] - 1].innerHTML = temp.innerHTML; 
                    ddl.options[selectedItems[i] - 1].value = temp.value; 
                    ddl.options[selectedItems[i] - 1].selected = true;
                    ddl.options[selectedItems[i]].selected = false;
                }
    }
    
    function moveDown(obj)
    {
        var ddl = document.getElementById(obj);
        //var size = ddl.length;
        //var index = ddl.selectedIndex;
        var selectedItems = new Array();
        var temp = {innerHTML:null, value:null};
        for(var i = 0; i < ddl.length; i++)
            if(ddl.options[i].selected)             
                selectedItems.push(i);
    
        if(selectedItems.length > 0)    
            if(selectedItems[selectedItems.length - 1] != ddl.length - 1)
                for(var i = selectedItems.length - 1; i >= 0; i--)
                {
                    temp.innerHTML = ddl.options[selectedItems[i]].innerHTML;
                    temp.value = ddl.options[selectedItems[i]].value;
                    ddl.options[selectedItems[i]].innerHTML = ddl.options[selectedItems[i] + 1].innerHTML;
                    ddl.options[selectedItems[i]].value = ddl.options[selectedItems[i] + 1].value;
                    ddl.options[selectedItems[i] + 1].innerHTML = temp.innerHTML; 
                    ddl.options[selectedItems[i] + 1].value = temp.value; 
                    ddl.options[selectedItems[i] + 1].selected = true;
                    ddl.options[selectedItems[i]].selected = false;
                }
    }

	var json = JSON.parse(d3.select('#jsonFromPHP').property('value'));
	console.log(json);

	$( "#tabs" ).tabs();	
	$( "#tabs1" ).tabs();
	$( "#tabs2" ).tabs();
	
	$( "#numberOfClusters" ).val(json['numberOfClusters']);
	$( "#orderMethod" ).val(json['orderMethod']);
	$( "#clusterOn" ).val(json['clusterOn']);
	$( "#dirName" ).val(json['dirName']);
	$( "#dbName" ).val(json['dbName']);	
	
	if (json['dbName'] != null){
		csvFile2 = "../../FILES/FET/"+json['dbName']+"/Extraction/dbinfo.csv";
    	d3.csv(csvFile2, function (error, infoData) {
    		$( "#dbnametitle" ).html("Database: <font color='red'>"+json['dbName']+"</font>");
    		$( "#dbname1" ).html("<font color='red'>"+ infoData[0]['dbname'] +"</font>");
    		$( "#dbfiles1" ).html("<font color='blue'>"+ infoData[0]['numfiles'] +"</font>");
    		$( "#dbsamples1" ).html("<font color='blue'>"+ infoData[0]['numsamples'] +"</font>");
    		$( "#dbsamplewindow1" ).html("<font color='blue'>"+ infoData[0]['samplewindow'] +" second(s)</font>");
        });
	}

	//Defino as larguras
	var sizeTabs = document.getElementById("content1").clientWidth/2-160;
	document.getElementById('content1').setAttribute("style","height:"+(sizeTabs)+"px;");
	document.getElementById('tabs').setAttribute("style","width:"+sizeTabs+"px; height:"+(sizeTabs-50)+"px;");
	document.getElementById('tabs1').setAttribute("style","width:"+sizeTabs+"px; height:"+(sizeTabs-50)+"px;");
	document.getElementById('tabs2').setAttribute("style","width:"+270+"px; height:"+(sizeTabs-50)+"px;");
	document.getElementById('pretabs2').setAttribute("style","float: left;");

	if ((d3.select('#status').property('value') == 'upload') || (d3.select('#status').property('value') == 'change'))   {
    	//################################################################################################################################
    	//################################################################################################################################
    	//Distance Matrix
    	$.get(json['locationDistMatrixOrdered'], function(data) {
    		var items = items = data.split('\n').map( pair => pair.split(',').map(Number) );
    		items = items.slice(0,(items.length-1));

    		var matrix1 = items;
    		var labels1 = json['orderedDistanceMatrixFeaturesNames'];
			var clustersOrdered = json['clustersOrdered'];			
    		
        	var distM = visMatrix({
        	    container   : '#mat1',
        	    showLegend  : true,
        	    data        : matrix1,
        	    groups		: clustersOrdered,
        	    labels      : labels1,
        	    colorScheme : 'interpolateInferno',
        	    width	    : document.getElementById("tabs").clientWidth-250,
        	    showValue	: false
        	}).render();

        	var distM1 = visMatrix({
        	    container   : '#mat11',
        	    showLegend  : true,
        	    data        : matrix1,
        	    groups		: clustersOrdered,
        	    labels      : labels1,
        	    colorScheme : 'interpolateInferno',
        	    width	    : document.getElementById("tabs").clientWidth-250,
        	    showValue	: false
        	}).render();
    		
        });

    	//Correlation Matrix
    	$.get(json['locationCorrMatrixOrdered'], function(data) {
    		var items = items = data.split('\n').map( pair => pair.split(',').map(Number) );
    		items = items.slice(0,(items.length-1));
    			
    		var matrix1 = items;
    		var labels1 = json['orderedCorrelationMatrixFeaturesNames'];
    		var clustersOrdered = json['clustersCOrdered'];
    		
        	var corrM = visMatrix({
        	    container   : '#mat2',
        	    showLegend  : true,
        	    data        : matrix1,
        	    groups		: clustersOrdered,
        	    labels      : labels1,
        	    colorScheme : 'interpolateRdBu',
        	    width	    : document.getElementById("tabs").clientWidth-250,
        	    showValue	: false
        	}).render();

        	var corrM1 = visMatrix({
        	    container   : '#mat22',
        	    showLegend  : true,
        	    data        : matrix1,
        	    groups		: clustersOrdered,
        	    labels      : labels1,
        	    colorScheme : 'interpolateRdBu',
        	    width	    : document.getElementById("tabs").clientWidth-250,
        	    showValue	: false
        	}).render();
    		
        });	

    	//################################################################################################################################
    	//################################################################################################################################
    	//### Modificar este trecho para poder chamar o "redraw" e "redraw and update" ###################################################
    	//################################################################################################################################
    	//################################################################################################################################    	
		    	
    	function drawRadviz(from){			
			//TODO: Descobrir como corrigir esse erro;
			//TODO: O width est� virando 0 ap�s a remo��o;		
			//d3.select("#radviz1").selectAll("svg").remove();
			//d3.select("#radviz1").selectAll("*").remove();
			//console.log("sizeTabs:"+sizeTabs);			
			//document.getElementById('tabs1').setAttribute("style","width:"+sizeTabs+"px; height:"+(sizeTabs-50)+"px;");
			//document.getElementById('radviz1').setAttribute("style","width:"+sizeTabs+"px; height:"+(sizeTabs-50)+"px;");
			//d3.select("#radviz1").selectAll("*").innerHTML = "";
			
			d3.select("#radviz1").selectAll("*").html("");

			var clusters = [];
	    	if (d3.select('#clusterOn').property('value') == 0) {    	
	        	clusters = json['clusters'];
	    	} else {
	    		clusters = json['clustersC'];
	        }
    		if (from == 0) {
		    	//Radviz visualization - Colocar todas as configurações disponíveis		    	
		    	var dimensions = [];
		    	var dimensionsCluster = [];		    	
		    	//Pego os IDs
		    	if (d3.select('#clusterOn').property('value') == 0) {    	
		        	dimensions = json['featSelDist'];
		    	} else {
		    		dimensions = json['featSelCorr'];
		        }
		        //Transformo em nome
		    	for (i = 0; i < dimensions.length; i++) { 
		    	    dimensions[i] = json['originalFeatureNames'][dimensions[i]];
		    	}
				//Identifico o cluster de cada feature
				var featureNames = json['originalFeatureNames'];				
				for (i = 0; i < dimensions.length; i++) {
					for (j = 0; j < featureNames.length; j++) {
						if (dimensions[i] == featureNames[j]) {
		    	    		dimensionsCluster[i] = clusters[j];
						}
					}
		    	}
		    	//console.log("first dimensionsCluster",dimensionsCluster);
			} else if (from == 1 | from == 2) {				
				var select = document.getElementById('sortable').options;
				dimensions = new Array(select.length);
				dimensionsCluster = new Array(select.length);				
				//Pego os nomes
				for (i=0; i< dimensions.length; i++) {            
		            dimensions[i] = select[i].text;
		        }		        
		      	//Identifico o cluster de cada feature
				var featureNames = json['originalFeatureNames'];				
				for (i = 0; i < dimensions.length; i++) {
					for (j = 0; j < featureNames.length; j++) {
						if (dimensions[i] == featureNames[j]) {
		    	    		dimensionsCluster[i] = clusters[j];
						}
					}
		    	}
				//console.log("second dimensionsCluster",dimensionsCluster);
			}
			//console.log("dimensions 1: " + dimensions);
			
			var mtx = "";
			if (json['clusterOn'] == 0) {
				mtx = json['locationDistMatrixOrdered_2'];
			} else if (json['clusterOn'] == 1) {
				mtx = json['locationCorrMatrixOrdered_2'];
			}			

			d3.csv(mtx, function(data){	        

				//Proposta da melhor ordenação
		        if (from == 0 | from == 2){
			        //var length = data.length;
			        dis = new Array(data.length);
			        for(var i=0; i<data.length; i++) {
			        	dis[i] = new Array(length);
			          	for(var j=0; j<dimensions.length; j++) {
			            	dis[i][j] = parseFloat(data[i][dimensions[j]]);
			          	}
			        }
		
			        var num_points = dimensions.length; //dis[0].length
			        addRandomPoints(num_points)
			
			        initData();
			        GAInitialize(dis,points);
			
			        for(i=0;i<100;i++){
			        	GANextGeneration();
			        }
			
			        var BestOrder=best;
			        var BestDistances=new Array();
			        
			        var dimensionsAux = new Array(dimensions.length);
			        var dimensionsClusterAux = new Array(dimensionsCluster.length);
			        for (i=0; i<BestOrder.length;i++){
			        	dimensionsAux[i] = dimensions[BestOrder[i]]; 
			        	dimensionsClusterAux[i] = dimensionsCluster[BestOrder[i]];
			        }
			        dimensions = dimensionsAux;
			        dimensionsCluster = dimensionsClusterAux;

			        console.log("dimensions_2", dimensions);
			        console.log("dimensionsCluster_2", dimensionsCluster);
		        } 
	    		//console.log("dimensions 2: " + dimensions);

				//Fill selected features and cluster IDs
				var select = document.getElementById("sortable");
				select.innerHTML = "";
		        for (i=0; i< dimensions.length; i++) {            
		            var option = document.createElement("option");
					option.value = dimensionsCluster[i];
		            option.appendChild(document.createTextNode(dimensions[i]));            
		            select.appendChild(option);
		        }

		        //Fill all features 
		        var featureNames = json['originalFeatureNames'];
		        var select = document.getElementById("sortableAll");
		        var featuresList = document.getElementById("lcfeatures");
		        select.innerHTML = "";
		        featuresList.innerHTML = "";
		        for (i=0; i< featureNames.length; i++) {            
		            var option1 = document.createElement("option");
		            option1.appendChild(document.createTextNode(featureNames[i]));            
		            select.appendChild(option1);

		            var option2 = document.createElement("option");
		            option2.appendChild(document.createTextNode(featureNames[i]));
		            featuresList.appendChild(option2);
		        }		        
		        currentFeature = featuresList.options[0].text;
				//console.log("current feature", currentFeature); 

				var dimensions1 = [];
    			for (i=0; i< dimensions.length; i++) {            
    	            dimensions1[i] = {name:dimensions[i],cluster:dimensionsCluster[i]-1};
    	        }
    	        //console.log(dimensions1);
				
		    	d3.csv(json['locationFeatureDataOriginal'], function(error, data1){
					//console.log("Current Database", d3.select('#dirName').property('value'));
		    		var radviz1 = RadvizComponent()
		    			.$el(d3.select("#radviz1"))
		    			.size(sizeTabs-220)
		    			.colorAcessor( 'label' )
		    			//.colorScale(d3.scaleOrdinal(d3.schemeCategory10))
		    			.data(data1)
		    			.dimensions(dimensions1)
		    			.dataLabels(json['dataLabels'])
		    			//.colorScaleDimensions(d3.scaleOrdinal(d3.schemeCategory10))
		    			.drawLinks(false)
		    			.dotRadius(5)
		    			.dotOpacity(0.5)
		    			.currentDatabase(json['dbName'])
		    			.useTooltip(true)
		    			.tooltipFormatter(
		    				function(d){
		    		        	return '<div style="background-color: white; border:1px solid black; width: '+
		    		        		(document.getElementById("sortable").clientWidth +14) +'px" align="left">'+
		    		        		'<strong>File:</strong> '+ d["FileName"] + '<br>' +
		    		        		'<strong>Sample:</strong> '+ d["SecondsFromStart"] +
		    		        		'<table><tr><td>&nbsp;</td><td><b>Value</b></td></tr>' + 
		    		        	dimensions.map(
		    		        		function(dB){ 
		    		        			return "<tr><td><b>"+ dB +'</b></td><td align="center">' + d[dB+"_normalized"].toFixed(2)+"</td></tr>";
		    		            	}
		    		        	).join('') + '</table></div>';
		    		      	}
		    			)
		    			.render();
		    	});
	      	}); 
		};  	
		
		drawRadviz(0);
		//console.log("cluaterOn: "+json['clusterOn']);
		
		//$( "#tabs" ).tabs({ active: 3 });
		
  		//################################################################################################################################
		//################################################################################################################################
    	
	};
	
	//################################################################################################################################
    //### Create graphs and spectrogram
    //################################################################################################################################    
    //Ao trocar o Feature, File ou Color scheme, chamo esta função
    var currentsoundscapedblist = "";
    var currentfileslist = "";
    var currentSpecColor = "Color";
    var currentFeature = "";
    var currentNormalization = "";
    var updateData = function () {

        var csvFile1 = "../../FILES/NMF/" + currentsoundscapedblist + "/Extraction/" + currentNormalization;
        var csvFile2 = "../../FILES/NMF/" + currentsoundscapedblist + "/NMF/Extraction/" + currentNormalization;

        if (currentsoundscapedblist != "" && currentfileslist != "") {                    
            //For line1
            d3.csv(csvFile1, function (error, data) {

                //Filter date
                data1 = data.filter(function (d) {
                    return d.FileName == currentfileslist.substr(0, currentfileslist.length-4);
                });

                data1.forEach(function (d, i) {
                    d.x = +d['SecondsFromStart'];
                    d.y = +d[currentFeature];
                });

                if (currentSpecColor == 'BW') {
                    wavesurfer.load('../../FILES/NMF/' + currentsoundscapedblist + '/' + currentfileslist);
                    changeImage1('../../FILES/NMF/'  + currentsoundscapedblist + '/Extraction/AudioSpectrogram/' 
                            + currentfileslist.substr(0, currentfileslist.length-4) + '_Min0_BW.png');                            
                } else {
                    wavesurfer.load('../../FILES/NMF/' + currentsoundscapedblist + '/' + currentfileslist);
                    changeImage1('../../FILES/NMF/'  + currentsoundscapedblist + '/Extraction/AudioSpectrogram/' 
                            + currentfileslist.substr(0, currentfileslist.length-4) + '_Min0_Color.png');
                }

                line1.data(data1).render();
            });

        }
    };
    
	//Ao clicar em um sample no radviz:
	// currentsoundscapedblist 	= diretório do database em análise
	// currentfileslist 		= nome do arquivo em análise (audio,csv)
    // currentNormalization 	= será sempre a mesma (features_norm.csv)
    // currentFeature 			= Deixo uma lista para o usuário escolher
    // updateData();
	
	wavesurfer.load('../images/empty.mp3');
	wavesurfer.setPlaybackRate($("#audioRate").value);

	LabelMaker()
        .$el(d3.select("#labelmaker"))
        .minFreq(0)
        .maxFreq(22050)
        .sampleWindow(1)
        .audioSeconds(60)        
        .specImg("../images/emptySpec.png")
        .render();
    
	var line1 = linechart()
        .$el(d3.select("#linechart1"))
        .width(600)
        .height(100) // Set height
        .color("red") // Set color
        //.data(getData()) // Set data
        .transitionTime(300)
        .render();

	wavesurfer.on('ready', function () {
        $("#equalizer1").html("");
        var EQ = [
            {
                f: 32,
                type: 'lowshelf'
            }, {
                f: 64,
                type: 'peaking'
            }, {
                f: 125,
                type: 'peaking'
            }, {
                f: 250,
                type: 'peaking'
            }, {
                f: 500,
                type: 'peaking'
            }, {
                f: 1000,
                type: 'peaking'
            }, {
                f: 2000,
                type: 'peaking'
            }, {
                f: 4000,
                type: 'peaking'
            }, {
                f: 8000,
                type: 'peaking'
            }, {
                f: 16000,
                type: 'highshelf'
            }
        ];
        // Create filters
        var filters = EQ.map(function (band) {
            var filter = wavesurfer.backend.ac.createBiquadFilter();
            filter.type = band.type;
            filter.gain.value = 0;
            filter.Q.value = 1;
            filter.frequency.value = band.f;
            return filter;
        });
        // Connect filters to wavesurfer
        wavesurfer.backend.setFilters(filters);
        // Bind filters to vertical range sliders                
        var container = document.querySelector('#equalizer1');
        filters.forEach(function (filter) {
            var input = document.createElement('input');
            wavesurfer.util.extend(input, {
                type: 'range',
                min: -40,
                max: 40,
                value: 0,
                title: filter.frequency.value
            });
            input.style.display = 'inline-block';
            input.setAttribute('orient', 'vertical');
            wavesurfer.drawer.style(input, {
                'webkitAppearance': 'slider-vertical',
                width: '25px',
                height: '50px'
            });
            container.appendChild(input);
            var onChange = function (e) {
                filter.gain.value = ~~e.target.value;
            };
            input.addEventListener('input', onChange);
            input.addEventListener('change', onChange);
        });

        // For debugging
        wavesurfer.filters = filters;
    });
</script>
{/literal}

{include file='page_footer.tpl'}

