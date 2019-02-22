<!-- ########################################### -->
<!-- ### Every feature configuration go here ### -->
<!-- ########################################### -->

{literal}
<script>
	function selectAll(){
		checked = document.getElementById('enableALL').checked
		document.getElementById('enableACI').checked 			= checked;
		document.getElementById('enableADI').checked 			= checked;
		document.getElementById('enableAEI').checked 			= checked;
		document.getElementById('enableBIO').checked 			= checked;
		document.getElementById('enableMFCC').checked 			= checked;
		document.getElementById('enableNDSI').checked 			= checked;
		document.getElementById('enableRMS').checked 			= checked;
		document.getElementById('enableTH').checked 			= checked;
		document.getElementById('enableZCR').checked 			= checked;
		document.getElementById('enableSpecMean').checked 		= checked;
		document.getElementById('enableSpecSD').checked 		= checked;
		document.getElementById('enableSpecSEM').checked 		= checked;
		document.getElementById('enableSpecMedian').checked 	= checked;
		document.getElementById('enableSpecMode').checked 		= checked;
		document.getElementById('enableSpecQuartile').checked 	= checked;
		document.getElementById('enableSpecSkewness').checked 	= checked;
		document.getElementById('enableSpecKurtosis').checked 	= checked;
		document.getElementById('enableSpecEntropy').checked 	= checked;
		document.getElementById('enableSpecVariance').checked 	= checked;
		document.getElementById('enableSpecChromaSTFT').checked = checked;
		document.getElementById('enableSpecChromaCQT').checked 	= checked;
		document.getElementById('enableSpecCentroid').checked 	= checked;
		document.getElementById('enableSpecBandwidth').checked 	= checked;
		document.getElementById('enableSpecContrast').checked 	= checked;
		document.getElementById('enableSpecRolloff').checked 	= checked;
		document.getElementById('enableSpecPolyFeat').checked 	= checked;
		document.getElementById('enableSpecSpread').checked 	= checked;
		document.getElementById('enableSPL').checked 			= checked;		
	}
</script>
{/literal}

<div class="roundDiv"><font size=5><strong id="selectedDatabase">Database Selected: NONE...PLEASE SELECT DATABASE FIRST</strong></font></div><br>

<form id="f1" name="f1" action="../scripts/indexFET2.php" method="POST">
	<input name="action" id="action" type="hidden" value="begin"> 
    <table style="width=100%;">
    
    <tr>
    <td align="center" valign="top"><strong>ALL</strong><br><input id="enableALL" name="enableALL" type="checkbox" onclick="selectAll();"></td>
    <td>	
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>General Extraction Settings</strong></legend>
    	
    	<input type="hidden" name="GENERAL_mainPath" id="GENERAL_mainPath">
    	
    	<strong>Sample size (Seconds): </strong>
    	<input name="GENERAL_timeWindow" id="GENERAL_timeWindow" value=1 size=1>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>DB Threshold: </strong>
    	<input name="GENERAL_dbThreshold" id="GENERAL_dbThreshold" value=60 size=1>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Audio channel to use: </strong>
    	<select name="GENERAL_audioChannel" id="GENERAL_audioChannel">
    		<option value='0'>Left</option>
    		<option value='1'>Right</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;

    	<strong>Grouping operation (Main file): </strong>
    	<select name="GENERAL_groupingOperation" id="GENERAL_groupingOperation">
    		<option value='none'>None</option>
    		<option value='mean'>Mean</option>
    		<option value='median'>Median</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;
    	
    	<br>
    	<strong>Normalization operation (Main file): </strong>
    	<select name="GENERAL_normalizationOperation" id="GENERAL_normalizationOperation">
    		<option value='n0'>n0: Without normalization</option>
    		<option value='n1'>n1: Standardization ((x-mean)/sd)</option>
    		<option value='n2'>n2: Positional standardization ((x-median)/mad)</option>
    		<option value='n3'>n3: Unitization ((x-mean)/range)</option>
    		<option value='n3a'>n3a: Positional unitization ((x-median)/range)</option>
    		<option value='n4' selected="selected">n4: Unitization with zero minimum ((x-min)/range)</option>
    		<option value='n5'>n5: Normalization in range (-1,1) ((x-mean)/max(abs(x-mean)))</option>
    		<option value='n5a'>n5a: Positional normalization in range (-1,1) ((x-median)/max(abs(x-median)))</option>
    		<option value='n6'>n6: Quotient transformation (x/sd)</option>
    		<option value='n6a'>n6a: Positional quotient transformation (x/mad)</option>
    		<option value='n7'>n7: Quotient transformation (x/range)</option>
    		<option value='n8'>n8: Quotient transformation (x/max)</option>
    		<option value='n9'>n9: Quotient transformation (x/mean)</option>
    		<option value='n9a'>n9a: Positional quotient transformation (x/median)</option>
    		<option value='n10'>n10: Quotient transformation (x/sum)</option>
    		<option value='n12'>n12: Normalization ((x-mean)/sqrt(sum((x-mean)^2)))</option>
    		<option value='n12a'>n12a: Positional normalization ((x-median)/sqrt(sum((x-median)^2)))</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    	
    	<strong>Filename format: </strong>
    	<input name="GENERAL_fileDateTimeMask" id="GENERAL_fileDateTimeMask"> (Adicionar janela de ajuda aqui.)
    	&nbsp;&nbsp;&nbsp;
    
    	<strong>Remove outliers: </strong>
    	<select name="GENERAL_removeOutliers" id="GENERAL_removeOutliers">
    		<option value='True'>True</option>
    		<option value='False'>False</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableACI" name="enableACI" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Acoustic Complexity Index (ACI)</strong></legend>
    	
    	<strong>Min frequency (Hz): </strong>
    	<input name="ACI_min_freq" id="ACI_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input name="ACI_max_freq" id="ACI_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Cluster size (Seconds): </strong>
    	<input name="ACI_j_bin" id="ACI_j_bin" value=1 size=3>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select name="ACI_fft_w" id="ACI_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableADI" name="enableADI" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Acoustic Diversity Index (ADI)</strong></legend>
    	
    	<strong>Max frequency (Hz): </strong>
    	<input name="ADI_max_freq" id="ADI_max_freq" size=6 value="10000">
    	&nbsp;&nbsp;&nbsp;
    
    	<strong>Size of frequency bands (Hz): </strong>
    	<input name="ADI_freq_step" id="ADI_freq_step" value=1000 size=4>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select name="ADI_fft_w" id="ADI_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;		
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableAEI" name="enableAEI" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Acoustic Evenness Index (AEI)</strong></legend>
    	
    	<strong>Max frequency (Hz): </strong>
    	<input name="AEI_max_freq" id="AEI_max_freq" size=6 value="10000">
    	&nbsp;&nbsp;&nbsp;
    		
    	<strong>Size of frequency bands: </strong>
    	<input name="AEI_freq_step" id="AEI_freq_step" value="1000" size=4>
    	&nbsp;&nbsp;&nbsp;	
    	
    	<strong>FFT window size: </strong>
    	<select name="AEI_fft_w" id="AEI_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableBIO" name="enableBIO" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Bioacoustic Index (BIO)</strong></legend>
    	
    	<strong>Min frequency (Hz): </strong>
    	<input name="BIO_min_freq" id="BIO_min_freq" size=6 value="2000">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input name="BIO_max_freq" id="BIO_max_freq" size=6 value=8000>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select name="BIO_fft_w" id="BIO_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableMFCC" name="enableMFCC" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Mel-Frequency Cepstral Coefficients (MFCC)</strong></legend>
    		
    	<strong>Number of cepstra: </strong>
    	<input name="MFCC_numcep" id="MFCC_numcep" size=2 value=12>
    	&nbsp;&nbsp;&nbsp;
    
    	<strong>Min frequency (Hz): </strong>
    	<input name="MFCC_min_freq" id="MFCC_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input name="MFCC_max_freq" id="MFCC_max_freq" size=6 value="8000">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Use MEL: </strong>
    		<select name="MFCC_useMel" id="MFCC_useMel">
    		<option value='True'>True</option>
    		<option value='False' selected>False</option>		
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableNDSI" name="enableNDSI" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Normalized Difference Soundscape Index (NDSI)</strong></legend>
    	
    	<strong>Min freq. Anthrophony (Hz): </strong>
    	<input name="NDSI_anthrophony_min" id="NDSI_anthrophony_min" size=6 value="1000">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max freq. Anthrophony (Hz): </strong>
    	<input name="NDSI_anthrophony_max" id="NDSI_anthrophony_max" size=6 value="2000">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Min freq. Biophony (Hz): </strong>
    	<input name="NDSI_biophony_min" id="NDSI_biophony_min" size=6 value="2000">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max freq. Biophony (Hz): </strong>
    	<input name="NDSI_biophony_max" id="NDSI_biophony_max" size=6 value="11000">
    	&nbsp;&nbsp;&nbsp;	
    
    	<br>
    	<strong>FFT window size: </strong>
    	<select name="NDSI_fft_w" id="NDSI_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableRMS" name="enableRMS" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>RMS</strong></legend>
    	
    	<strong>No configuration required</strong>
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableTH" name="enableTH" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Temporal Entropy (TH)</strong></legend>
    	
    	<strong>No configuration required</strong>
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableZCR" name="enableZCR" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Zero Crossing Rate (ZCR)</strong></legend>
    	
    	<strong>No configuration required</strong>
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecSpread" name="enableSpecSpread" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Spread</strong></legend>
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecSpread_fft_w" name="SpecSpread_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecMean" name="enableSpecMean" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Mean</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecMean_min_freq" name="SpecMean_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecMean_max_freq" name="SpecMean_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecMean_fft_w" name="SpecMean_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecMedian" name="enableSpecMedian" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Median</strong></legend>
    
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecMedian_min_freq" name="SpecMedian_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecMedian_max_freq" name="SpecMedian_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecMedian_fft_w" name="SpecMedian_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecSD" name="enableSpecSD" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral SD</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecSD_min_freq" name="SpecSD_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecSD_max_freq" name="SpecSD_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecSD_fft_w" name="SpecSD_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecSEM" name="enableSpecSEM" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral SEM (Standard Error Mean)</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecSEM_min_freq" name="SpecSEM_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecSEM_max_freq" name="SpecSEM_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecSEM_fft_w" name="SpecSEM_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecMode" name="enableSpecMode" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Mode</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecMode_min_freq" name="SpecMode_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecMode_max_freq" name="SpecMode_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecMode_fft_w" name="SpecMode_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecQuartile" name="enableSpecQuartile" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Quartiles</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecQuartile_min_freq" name="SpecQuartile_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecQuartile_max_freq" name="SpecQuartile_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecQuartile_fft_w" name="SpecQuartile_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecSkewness" name="enableSpecSkewness" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Skewness</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecSkewness_min_freq" name="SpecSkewness_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecSkewness_max_freq" name="SpecSkewness_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecSkewness_fft_w" name="SpecSkewness_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Use Spectrum Power: </strong>
    	<select id="SpecSkewness_power" name="SpecSkewness_power">
    		<option value='True' selected>True</option>
    		<option value='False'>False</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecKurtosis" name="enableSpecKurtosis" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Kurtosis</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecKurtosis_min_freq" name="SpecKurtosis_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecKurtosis_max_freq" name="SpecKurtosis_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecKurtosis_fft_w" name="SpecKurtosis_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Use Spectrum Power: </strong>
    	<select id="SpecKurtosis_power" name="SpecKurtosis_power">
    		<option value='True' selected>True</option>
    		<option value='False'>False</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecEntropy" name="enableSpecEntropy" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Entropy</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecEntropy_min_freq" name="SpecEntropy_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecEntropy_max_freq" name="SpecEntropy_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecEntropy_fft_w" name="SpecEntropy_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Use Spectrum Power: </strong>
    	<select id="SpecEntropy_power" name="SpecEntropy_power">
    		<option value='True' selected>True</option>
    		<option value='False'>False</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecVariance" name="enableSpecVariance" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Variance</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecVariance_min_freq" name="SpecVariance_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecVariance_max_freq" name="SpecVariance_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecVariance_fft_w" name="SpecVariance_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Use Spectrum Power: </strong>
    	<select id="SpecVariance_power" name="SpecVariance_power">
    		<option value='True' selected>True</option>
    		<option value='False'>False</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecChromaSTFT" name="enableSpecChromaSTFT" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Chroma STFT</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecChromaSTFT_min_freq" name="SpecChromaSTFT_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecChromaSTFT_max_freq" name="SpecChromaSTFT_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecChromaSTFT_fft_w" name="SpecChromaSTFT_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Use Spectrum Power: </strong>
    	<select id="SpecChromaSTFT_power" name="SpecChromaSTFT_power">
    		<option value='True' selected>True</option>
    		<option value='False'>False</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecChromaCQT" name="enableSpecChromaCQT" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Chroma CQT</strong></legend>
    	
    	<strong>No configuration required</strong>
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecCentroid" name="enableSpecCentroid" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Centroid</strong></legend>
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecCentroid_fft_w" name="SpecCentroid_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecBandwidth" name="enableSpecBandwidth" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Bandwidth</strong></legend>
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecBandwidth_fft_w" name="SpecBandwidth_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecContrast" name="enableSpecContrast" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Contrast</strong></legend>
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecContrast_fft_w" name="SpecContrast_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecRolloff" name="enableSpecRolloff" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Rolloff</strong></legend>
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecRolloff_fft_w" name="SpecRolloff_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSpecPolyFeat" name="enableSpecPolyFeat" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Spectral Poly Features</strong></legend>
    		
    	<strong>Min frequency (Hz): </strong>
    	<input id="SpecPolyFeat_min_freq" name="SpecPolyFeat_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SpecPolyFeat_max_freq" name="SpecPolyFeat_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SpecPolyFeat_fft_w" name="SpecPolyFeat_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Use Spectrum Power: </strong>
    	<select id="SpecPolyFeat_power" name="SpecPolyFeat_power">
    		<option value='True' selected>True</option>
    		<option value='False'>False</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;	
    </fieldset><br>
    </td>
    </tr>
    
    <tr>
    <td align="center" valign="top"><strong>Enable</strong><br><input id="enableSPL" name="enableSPL" type="checkbox"></td>
    <td>
    <fieldset style="width: 98%; height: auto; text-align: left; border-color: #FFFFFF;">
        <legend><strong>Sound Pressure Level (SPL)</strong></legend>
    
    	<strong>Min frequency (Hz): </strong>
    	<input id="SPL_min_freq" name="SPL_min_freq" size=6 value="0">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>Max frequency (Hz): </strong>
    	<input id="SPL_max_freq" name="SPL_max_freq" size=6 value="22050">
    	&nbsp;&nbsp;&nbsp;
    	
    	<strong>FFT window size: </strong>
    	<select id="SPL_fft_w" name="SPL_fft_w">
    		<option value='256'>256</option>
    		<option value='512' selected>512</option>
    		<option value='1024'>1024</option>
    		<option value='2048'>2048</option>
    		<option value='4096'>4096</option>
    		<option value='8192'>8192</option>
    		<option value='16384'>16384</option>
    		<option value='32768'>32768</option>
    	</select>
    	&nbsp;&nbsp;&nbsp;
    </fieldset><br>
    </td>
    </tr>
    </table>
</form>

