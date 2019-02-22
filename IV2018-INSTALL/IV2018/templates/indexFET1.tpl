{include file='page_header.tpl'}

<link href="../libs/jquery.uploadfile.css" rel="stylesheet">
<script src="../libs/jquery.uploadfile.js"></script>

<div id="csscontent">
    
    <div id="title" class="roundDiv" align="center">
    	<div align="center"><font size=5><strong>Audio Feature Extraction Tool</strong></font></div>
    </div>
    
    <div id="content" class="roundDiv1" align="center">			
			
			<!-- Tabs -->
            <div id="tabs" style="width: 1300px;">
            	<ul>
            		<li><a href="#tabs-1">Database/File Manager</a></li>
            		<li><a href="#tabs-2">Feature Extraction Settings</a></li>
            		<li><a href="#tabs-3">Feature Extraction Process</a></li>
            	</ul>
            	<div id="tabs-1">
            		<div class="roundDiv"><font size=5><strong>Database Management / Files Upload</strong></font></div><br>
            	
                	<div class="divTable" style="width: 100%;">
                    	<div class="divTableBody">
                    		<div class="divTableRow">
                    			<div class="divTableCell">
                    				<fieldset style="width: 400px; height: 250px;">
                            			<legend><strong>Database List</strong></legend>
                        				<select id="dblist" size=2 style="width: 100%; height: 220px;" 
                        					onclick="
                            					$('#dbname').val($('#dblist').find(':selected').text());
                    					        $('#selectedDatabase').text('Database Selected: '+$('#dblist').find(':selected').text());
                    					        $('#GENERAL_mainPath').val($('#dblist').find(':selected').text());
                            					newDB=false;
                            					$('#filelist').load('../scripts/FETListFiles.php?dbname='+$('#dblist').find(':selected').val());">
                                        	{section name=linha loop=$soundscapedblist}
                                            <option value="{$soundscapedblist[linha].ID}">{$soundscapedblist[linha].name}</option>
                                            {/section}
                                        </select>
                                        <br>
                                        <strong>DB Name:</strong><input type="text" value="" id="dbname" size="32" 
                                        	onclick="
                                            	$('#dblist').val([]); 
                                                $('#filelist').empty(); 
                                                newDB=true;
                                                $('#selectedDatabase').text('Database Selected: NONE...PLEASE SELECT DATABASE FIRST');">
                            		</fieldset>
                    			</div>
                    			<div class="divTableCell">
                    				<fieldset style="width: 400px; height: 250px;">
                            			<legend><strong>File List</strong></legend>
                        				<select id="filelist" size=2 style="width: 100%; height: 240px;"></select>
                            		</fieldset>
                    			</div>
                    			
                    			<!--
                    			<div class="divTableCell">
                        			<fieldset style="width: 400px; height: 250px;">
                            			<legend><strong>Multiple Files Uploader</strong></legend>
                            			<div style="width: auto; height: 215px; overflow-y: scroll;">    			
                            				<div id="mulitplefileuploader" 
                            					onclick="$('#db').load('../scripts/FETCreateDBDir.php?dbname='+$('#dbname').val());"></div>
                            				<div id="db" style="display: none;"></div>
                            			</div>    			
                            		</fieldset>
                            		<div id="status"></div>
                    			</div>
                    			-->
                    			                    			
                    		</div>
                    	</div>
                    </div>
            	</div>
            	
            	<div id="tabs-2">
            		{include file='featuresConfiguration.tpl'}            		
            	</div>
            	
            	<div id="tabs-3">
            		{include file='featuresExtractionProcess.tpl'}
            	</div>
            </div>
			    		

			<br>
    </div>

</div>

{literal}
<script>
	$( "#tabs" ).tabs();	
	$( "#accordion" ).accordion();	
	$( "#GENERAL_timeWindow" ).spinner();
	$( "#GENERAL_audioChannel" ).selectmenu();	
	$( "#GENERAL_dbThreshold").spinner();
	$( "#GENERAL_groupingOperation" ).selectmenu();
	$( "#GENERAL_normalizationOperation" ).selectmenu();
	$( "#GENERAL_removeOutliers" ).selectmenu();	
	
	$( "#ACI_min_freq").spinner();
	$( "#ACI_max_freq").spinner();
	$( "#ACI_j_bin").spinner();
	$( "#ACI_fft_w").selectmenu();
	
	$( "#ADI_max_freq").spinner();
	$( "#ADI_freq_step").spinner();
	$( "#ADI_fft_w").selectmenu();	
	
	$( "#AEI_max_freq").spinner();
	$( "#AEI_freq_step").spinner();
	$( "#AEI_fft_w").selectmenu();
	
	$( "#BIO_min_freq").spinner();
	$( "#BIO_max_step").spinner();
	$( "#BIO_fft_w").selectmenu();
		
	$( "#MFCC_numcep").spinner();
	$( "#MFCC_min_freq").spinner();
	$( "#MFCC_max_freq").spinner();
	$( "#MFCC_useMel").selectmenu();
	
	$( "#NDSI_biophony_min").spinner();
	$( "#NDSI_biophony_max").spinner();
	$( "#NDSI_anthrophony_min").spinner();
	$( "#NDSI_anthrophony_max").spinner();
	$( "#NDSI_fft_w").selectmenu();
	
	$( "#SpecSpread_fft_w").selectmenu();
	
	$( "#SpecMean_min_freq").spinner();
	$( "#SpecMean_max_freq").spinner();
	$( "#SpecMean_fft_w").selectmenu();
	
	$( "#SpecMedian_min_freq").spinner();
	$( "#SpecMedian_max_freq").spinner();
	$( "#SpecMedian_fft_w").selectmenu();
	
	$( "#SpecSD_min_freq").spinner();
	$( "#SpecSD_max_freq").spinner();
	$( "#SpecSD_fft_w").selectmenu();
	
	$( "#SpecSEM_min_freq").spinner();
	$( "#SpecSEM_max_freq").spinner();
	$( "#SpecSEM_fft_w").selectmenu();
	
	$( "#SpecMode_min_freq").spinner();
	$( "#SpecMode_max_freq").spinner();
	$( "#SpecMode_fft_w").selectmenu();
	
	$( "#SpecQuartile_min_freq").spinner();
	$( "#SpecQuartile_max_freq").spinner();
	$( "#SpecQuartile_fft_w").selectmenu();
	
	$( "#SpecSkewness_min_freq").spinner();
	$( "#SpecSkewness_max_freq").spinner();
	$( "#SpecSkewness_fft_w").selectmenu();
	$( "#SpecSkewness_power").selectmenu();
	
	$( "#SpecKurtosis_min_freq").spinner();
	$( "#SpecKurtosis_max_freq").spinner();
	$( "#SpecKurtosis_fft_w").selectmenu();
	$( "#SpecKurtosis_power").selectmenu();
		
	$( "#SpecEntropy_min_freq").spinner();
	$( "#SpecEntropy_max_freq").spinner();
	$( "#SpecEntropy_fft_w").selectmenu();
	$( "#SpecEntropy_power").selectmenu();	
	
	$( "#SpecVariance_min_freq").spinner();
	$( "#SpecVariance_max_freq").spinner();
	$( "#SpecVariance_fft_w").selectmenu();
	$( "#SpecVariance_power").selectmenu();
	
	$( "#SpecChromaSTFT_min_freq").spinner();
	$( "#SpecChromaSTFT_max_freq").spinner();
	$( "#SpecChromaSTFT_fft_w").selectmenu();
	$( "#SpecChromaSTFT_power").selectmenu();
	
	$( "#SpecCentroid_fft_w").selectmenu();
	
	$( "#SpecBandwidth_fft_w").selectmenu();
	
	$( "#SpecContrast_fft_w").selectmenu();
	
	$( "#SpecRolloff_fft_w").selectmenu();
	
	$( "#SpecPolyFeat_min_freq").spinner();
	$( "#SpecPolyFeat_max_freq").spinner();
	$( "#SpecPolyFeat_fft_w").selectmenu();
	$( "#SpecPolyFeat_power").selectmenu();
	
	$( "#SPL_min_freq").spinner();
	$( "#SPL_max_freq").spinner();
	$( "#SPL_fft_w").selectmenu();

	// Button and progress bar
	$( ".widget input[type=submit], .widget a, .widget button" ).button();    
    $( "#progressbar" ).progressbar({value: 0});
    //$("#progressbar").css({ 'background': '#0000FF repeat-x 50% 50%;' });
    $("#progressbar > div").css({ 'background': '#9ecae1' });

	
	$('#dblist').load('../scripts/FETListDB.php');
	
	var counter = 0;
	var newDB = true;
	
	var settings = {
		url: "../scripts/uploadFile.php",
		method: "POST",
		allowedTypes:"flac,wav,mp3",
		fileName: "uploadFilesDB",
		multiple: true,
		showFileCounter: true,
		showProgress: true,
		onSuccess:function(files,data,xhr)
		{
			//Código para aumentar a barra de progresso no acerto
			counter = counter+1;
			$("#status").html("<font color='green'>Files Uploaded: "+counter+"</font>");
			$('#dblist').load('../scripts/FETListDB.php');
			$('#filelist').empty();
			$('#dbname').val('');
			$('#selectedDatabase').text('Database Selected: NONE...PLEASE SELECT DATABASE FIRST');
		}
// 		,
// 		onError: function(files,status,errMsg)
// 		{	
// 			//Código para aumentar a barra de progresso no erro	
// 			$("#status").html("<font color='red'>Upload has Failed: "+counter+"</font>");
// 			counter = counter+1;
// 		}
	}
	$("#mulitplefileuploader").uploadFile(settings);

</script>
{/literal}

{include file='page_footer.tpl'}