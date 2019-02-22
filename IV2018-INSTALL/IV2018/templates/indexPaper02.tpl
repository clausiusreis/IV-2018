{include file='page_header.tpl'}

<div id="csscontent">
    
    <div id="controls" class="roundDiv" style="height: auto;">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <select id = "currentFeature" 
            onChange="currentFeature = d3.select(this).property('value'); update();">
            <option value="ACI">Acoustic Complexity Index (ACI)</option>
            <option value="AEI">Acoustic Evenness Index (AEI)</option>
            <option value="ADI">Acoustic Diversity Index (ADI)</option>
            <option value="BIO">Bioacoustic Index (BIO)</option>
        </select>
        
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <select id = "colorScheme" 
            onChange="currentColorScheme = d3.select(this).property('value'); update();">
            <option value="interpolateInferno">Sunset</option>            
            <option value="yellowRed">Yellow to Red</option>            
            <option value="interpolateBrBG">BrBG</option>
            <option value="interpolatePRGn">PRGn</option>
            <option value="interpolatePiYG">PiYG</option>
            <option value="interpolatePuOr">PuOr</option>
            <option value="interpolateRdBu">RdBu</option>
            <option value="interpolateRdGy">RdGy</option>
            <option value="interpolateRdYlBu">RdYlBu</option>
            <option value="interpolateRdYlGn">RdYlGn</option>
            <option value="interpolateSpectral">Spectral</option>
            <option value="interpolateBlues">Blues</option>
            <option value="interpolateGreys">Grays</option>
            <option value="interpolateGreens">Greens</option>            
            <option value="interpolateOranges">Oranges</option>
            <option value="interpolatePurples">Purples</option>
            <option value="interpolateReds">Reds</option>
            <option value="interpolateBuGn">BuGn</option>
            <option value="interpolateBuPu">BuPu</option>
            <option value="interpolateGnBu">GnBu</option>
            <option value="interpolateOrRd">OrRd</option>
            <option value="interpolatePuBuGn">PuBuGn</option>
            <option value="interpolatePuBu">PuBu</option>
            <option value="interpolatePuRd">PuRd</option>
            <option value="interpolateRdPu">RdPu</option>
            <option value="interpolateYlGnBu">YlGnBu</option>
            <option value="interpolateYlGn">YlGn</option>
            <option value="interpolateYlOrBr">YlOrBr</option>
            <option value="interpolateYlOrRd">YlOrRd</option>
        </select>
    </div>
    <div id="heatmap1" class="roundDiv" style="height: 320px;">
    	<div align="left"><font size=5><strong>Pre-NMF Heatmap</strong></font></div>
    </div>    
    <div id="heatmap2" class="roundDiv" style="height: 320px;">
    	<div align="left"><font size=5><strong>Post-NMF Heatmap</strong></font></div>
    </div>    
    
    {literal}
    <script>

    //ACI,ADI,AEI,BIO,H,NDSI,NDSI_Anthrophony,NDSI_Biophony,Rain
    var currentFeature = 'ACI';
    var currentColorScheme = 'interpolateInferno';
    
    var hm1 = Heatmap().$el(d3.select("#heatmap1")).colorScheme(currentColorScheme).removeOutliers(false);
    var hm2 = Heatmap().$el(d3.select("#heatmap2")).colorScheme(currentColorScheme).removeOutliers(false);

    var csvFile1 = "../DATA_PAPER1/CostaRica_015089_none_n4_1.csv";
    var csvFile2 = "../DATA_PAPER1/CostaRica_015089_NNMF_none_n4_1.csv";
    //var csvFile1 = "../DATA_PAPER1/Extraction/CostaRica_015089_none_n4.csv";
    //var csvFile2 = "../DATA_PAPER1/Extraction/CostaRica_015089_NNMF_none_n4.csv";
    
    var parseDate = d3.timeParse("%Y-%m-%d");
    var parseTime = d3.timeParse("%H:%M:%S");
    
    var filterFromDate = "2015-03-06";
    var filterToDate = "2015-03-20";

    var update = function(){
        console.log("update");
        d3.csv(csvFile1, function (error, data) {

            data.forEach(function (d, i) {                        
                d.date = parseDate( d.Date );
                d.time = parseTime( d.Time );
                d.value = +d[currentFeature];
            });

            data = data.filter( 
                function(d){ 
                    return ( d.date >=parseDate(filterFromDate) && d.date <= parseDate(filterToDate) ); 
                }
            );

            hm1.data(data).colorScheme(currentColorScheme).render();
        });

        d3.csv(csvFile2, function (error, data) {

            data.forEach(function (d, i) {                        
                d.date = parseDate( d.Date );
                d.time = parseTime( d.Time );
                d.value = +d[currentFeature];
            });

            data = data.filter( 
                function(d){ 
                    return ( d.date >=parseDate(filterFromDate) && d.date <= parseDate(filterToDate) ); 
                }
            );

            hm2.data(data).colorScheme(currentColorScheme).render();
        });
    };
   
    update();
   
    </script>
    {/literal}
</div>

{include file='page_footer.tpl'}

