{include file='page_header.tpl'}

<script src="../libs/wavesurfer/wavesurfer.js" type="text/javascript"></script>
<script src="../scripts/LineChart/linechart.js" type="text/javascript"></script>

<div id="csscontent">
    <div id="config" class="roundDiv">
        <table align="center">
            <tr>
                <td width="84%">
                    <form action="../scripts/indexPaper01.php?action=upload" method="post" enctype="multipart/form-data">
                        <strong>Soundscape DB name:</strong><input type="text" name="soundscapedb" size="30">
                        <input type="file" name="files[]" multiple="multiple" id="files">
                        <input type="submit" value="Upload files" onclick="d3.select('#loader').style('visibility','visible');">
                    </form>
                </td>
                <td>
                    <div id="loader" style="visibility: hidden; height: 30px;">
                        <img src="../images/processing.gif" height="30">
                    </div>
                </td>
                <td>
                    <select id = "currentSpecColor" 
                            onchange="currentSpecColor = d3.select(this).property('value'); updateData();">
                        <option value="BW">Spectrogram colormap: Grayscale</option>
                        <option value="Color" selected="selected">Spectrogram colormap: Color (Hot)</option>
                    </select>
                </td>
            </tr>
            {if !empty($warning)}
            <tr>
                <td>
                    <font color="red">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h1>::: {$warning} :::</h1>
                    </font>
                </td>
                <td></td>
                <td></td>
            </tr>
            {/if}
        </table>                       
    </div>

    <!--
    <div id="config1" class="roundDiv">
        <table align="center" width="100%">
            <tr>                
                <td align="center">
                    <div id="equalizer1"></div>
                </td>
                <td align="center">
                    <div id="loader" style="visibility: hidden;">
                        <img src="../images/processing.gif">
                    </div>
                </td>
                <td align="center">
                    <div id="equalizer2"></div>
                </td>
            </tr>                                            
        </table>
    </div>
    -->
    
    <div id="main" class="roundDiv1">
        <table align="center">
            <tr>
                <td>
                    <table>
                        <tr>
                            <td>                            	
                                <!-- ### Spectrogram 1 ### -->         
                                <div align="center"><font size=5><strong>Pre-NMF Spectrogram/Features</strong></font></div>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                                                                              
                                <button onclick="wavesurfer1.playPause();">PLAY/PAUSE AUDIO</button>                                
                                <br>
                                <div class="myplayer">
                                    <div style="position: relative;" >
                                        <div style="position: absolute; padding-left:34px; padding-top: 18px;">                                            
                                            <div id="waveform1" style="width:482px; border-style: solid; border-width: 1px; border-color: #000000;"></div>                                            

                                            <!-- Load the audio after the components are set (waveform) -->
                                            {literal}
                                                <script>
                                                    var wavesurfer1 = WaveSurfer.create({
                                                        container: '#waveform1',
                                                        waveColor: 'transparent',
                                                        progressColor: 'transparent',
                                                        height: 233,
                                                        cursorWidth: 2,
                                                        cursorColor: 'yellow'
                                                    });
                                                </script>
                                            {/literal}
                                        </div>

                                        <img src="../images/emptySpectrogram.png" id="imgSpectrogram1">
                                    </div>
                                </div>
                            </td>
                            <td width="1px" style="background-color: black;"></td>
                            <td>
                                <!-- ### Spectrogram 2 ### -->
                                <div align="center"><font size=5><strong>Post-NMF Spectrogram/Features</strong></font></div>  
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button onclick="wavesurfer2.playPause();">PLAY/PAUSE AUDIO</button><br>
                                <div class="myplayer">
                                    <div style="position: relative;" >
                                        <div style="position: absolute; padding-left:34px; padding-top: 18px;">				  		
                                            <div id="waveform2" style="width:482px; border-style: solid; border-width: 1px; border-color: #000000;"></div>

                                            <!-- Load the audio after the components are set (waveform) -->
                                            {literal}
                                                <script>
                                                    var wavesurfer2 = WaveSurfer.create({
                                                        container: '#waveform2',
                                                        waveColor: 'transparent',
                                                        progressColor: 'transparent',
                                                        height: 233,
                                                        cursorWidth: 2,
                                                        cursorColor: 'yellow'
                                                    });
                                                </script>
                                            {/literal}
                                        </div>

                                        <img src="../images/emptySpectrogram.png" id="imgSpectrogram2">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <!-- Line chart 1 -->
                                <div style="padding-left:6px; padding-top: 0px;" id="linechart1"></div>
                            </td>
                            <td width="1px" style="background-color: black;"></td>
                            <td>
                                <!-- Line chart 1 -->
                                <div style="padding-left:6px; padding-top: 0px;" id="linechart2"></div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>    

    <div id="config3" class="roundDiv">
        <table align="center" width="70%">
            <tr>
                <td align="center">                    
                    <div id="files" style="overflow-y: auto;">
                        <table>
                            <tr>
                                <td>
                                    <strong>List of Soundscape DB:</strong>
                                </td>
                                
                                <td>
                                    <strong>List of Audio Files:</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <!--
                                    <select id = "currentFilter" 
                                            onchange="currentFilter = d3.select(this).property('value');
                                                    updateData();" size="7">                            
                                        <option value="MIX01">MIX01</option>
                                    </select>
                                    -->
                                    <select id = "soundscapedblist" 
                                            onclick="                                                
                                                currentsoundscapedblistID = d3.select(this).property('value');
                                                currentsoundscapedblist = document.getElementById('soundscapedblist').options[document.getElementById('soundscapedblist').selectedIndex ].text;
                                                $('#fileslist').load('../scripts/NMFlistfiles.php?ID='+currentsoundscapedblistID);
                                                //TODO: Atualizar o normalizationlist e featureslist
                                                $('#normalizationlist').load('../scripts/NMFlistnormalizations.php?ID='+currentsoundscapedblist);
                                                $('#featureslist').load('../scripts/NMFlistfeatures.php?ID='+currentsoundscapedblist);                                                
                                                " size="6" style="width:290px;">
                                        {section name=linha loop=$soundscapedblist}
                                        <option value="{$soundscapedblist[linha].ID}">{$soundscapedblist[linha].name}</option>
                                        {/section}
                                    </select>
                                </td>

                                <td>
                                    <!--
                                    <select id = "currentFilter" 
                                            onchange="currentFilter = d3.select(this).property('value');
                                                    updateData();" size="7">                            
                                        <option value="MIX01">MIX01</option>                                        
                                    </select>
                                    -->
                                    <select id = "fileslist" 
                                            onclick="
                                                currentfileslist = d3.select(this).property('value');
                                                currentNormalization = d3.select('#normalizationlist').property('value');
                                                currentFeature = d3.select('#featureslist').property('value');
                                                updateData();" size="6" style="width:290px;">
                                        <option value="">::: SELECT SOUNDSCAPE DB :::</option>
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
                <td align="center">
                    <div id="features" style="overflow-y: auto;">                        
                        <table>
                            <tr>
                                <td>
                                    <strong>Available Normalizations (
                                    <a href='#' onclick="this.href='../../FILES/NMF/'+currentsoundscapedblist+'/Extraction/'+currentNormalization;">Download</a>):</strong>
                                </td>
                                <td>
                                    <strong>Available Features:</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <select id = "normalizationlist" 
                                            onchange="
                                            currentNormalization = d3.select(this).property('value');
                                            updateData();" size="6" style="width:290px;">
                                        <option value="">::: SELECT SOUNDSCAPE DB :::</option>
                                    </select>
                                </td>                                
                                <td>
                                    <select id = "featureslist" 
                                            onchange="
                                            currentFeature = d3.select(this).property('value');
                                            updateData();" size="6" style="width:290px;">
                                        <option value="">::: SELECT SOUNDSCAPE DB :::</option>
                                    </select>
                                </td>
                            </tr>
                    </div>
                </td>
            </tr>                                            
        </table>
    </div>

    {literal}        
        <script>
        	/*
             * Create graphs
             */
            var line1 = linechart()
                    .$el(d3.select("#linechart1"))
                    .width(479)
                    .height(100) // Set height
                    .color("red") // Set color
                    //.data(getData()) // Set data
                    .transitionTime(300)
                    .render();

            var line2 = linechart()
                    .$el(d3.select("#linechart2"))
                    .width(479)
                    .height(100) // Set height
                    .color("blue") // Set color
                    //.data(getData()) // Set data
                    .transitionTime(300)
                    .render();

            //Ao trocar o Feature, File ou Color scheme, chamo esta função
            var currentsoundscapedblist = "";
            var currentfileslist = "";
            var currentSpecColor = "Color";
            //var currentFileName1 = "clean";
            //var currentFileName2 = "rain";
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
                            wavesurfer1.load('../../FILES/NMF/' + currentsoundscapedblist + '/' + currentfileslist);
                            changeImage1('../../FILES/NMF/'  + currentsoundscapedblist + '/Extraction/AudioSpectrogram/' 
                                    + currentfileslist.substr(0, currentfileslist.length-4) + '_Min0_BW.png');                            
                        } else {
                            wavesurfer1.load('../../FILES/NMF/' + currentsoundscapedblist + '/' + currentfileslist);
                            changeImage1('../../FILES/NMF/'  + currentsoundscapedblist + '/Extraction/AudioSpectrogram/' 
                                    + currentfileslist.substr(0, currentfileslist.length-4) + '_Min0_Color.png');
                        }

                        line1.data(data1).render();
                    });

                    //For line2
                    d3.csv(csvFile2, function (error, data) {

                        //Filter date
                        data1 = data.filter(function (d) {
                            return d.FileName == currentfileslist.substr(0, currentfileslist.length-4) + "_Clean";
                        });

                        data1.forEach(function (d, i) {
                            d.x = +d['SecondsFromStart'];
                            d.y = +d[currentFeature];
                        });

                        if (currentSpecColor == 'BW') {
                            wavesurfer2.load('../../FILES/NMF/' + currentsoundscapedblist + '/NMF/' 
                                    + currentfileslist.substr(0, currentfileslist.length-4) + '_Clean.wav');
                            changeImage2('../../FILES/NMF/'  + currentsoundscapedblist + '/NMF/Extraction/AudioSpectrogram/' 
                                    + currentfileslist.substr(0, currentfileslist.length-4) + '_Clean_Min0_BW.png');
                        } else {
                            wavesurfer2.load('../../FILES/NMF/' + currentsoundscapedblist + '/NMF/' 
                                    + currentfileslist.substr(0, currentfileslist.length-4) + '_Clean.wav');
                            changeImage2('../../FILES/NMF/'  + currentsoundscapedblist + '/NMF/Extraction/AudioSpectrogram/' 
                                    + currentfileslist.substr(0, currentfileslist.length-4) + '_Clean_Min0_Color.png');
                        }

                        line2.data(data1).render();
                    });
                }
            };

            //Primeira vez que entrar na página abrir o primeiro audio com o primeiro feature
            //updateData();

            //Teste do equalizador        
            /*
            wavesurfer1.on('ready', function () {
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
                    var filter = wavesurfer1.backend.ac.createBiquadFilter();
                    filter.type = band.type;
                    filter.gain.value = 0;
                    filter.Q.value = 1;
                    filter.frequency.value = band.f;
                    return filter;
                });
                // Connect filters to wavesurfer
                wavesurfer1.backend.setFilters(filters);
                // Bind filters to vertical range sliders                
                var container = document.querySelector('#equalizer1');
                filters.forEach(function (filter) {
                    var input = document.createElement('input');
                    wavesurfer1.util.extend(input, {
                        type: 'range',
                        min: -40,
                        max: 40,
                        value: 0,
                        title: filter.frequency.value
                    });
                    input.style.display = 'inline-block';
                    input.setAttribute('orient', 'vertical');
                    wavesurfer1.drawer.style(input, {
                        'webkitAppearance': 'slider-vertical',
                        width: '40px',
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
                wavesurfer1.filters = filters;
            });            
            
            wavesurfer2.on('ready', function () {
                $("#equalizer2").html("");
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
                    var filter = wavesurfer2.backend.ac.createBiquadFilter();
                    filter.type = band.type;
                    filter.gain.value = 0;
                    filter.Q.value = 1;
                    filter.frequency.value = band.f;
                    return filter;
                });
                // Connect filters to wavesurfer
                wavesurfer2.backend.setFilters(filters);
                // Bind filters to vertical range sliders
                var container = document.querySelector('#equalizer2');
                filters.forEach(function (filter) {
                    var input = document.createElement('input');
                    wavesurfer2.util.extend(input, {
                        type: 'range',
                        min: -40,
                        max: 40,
                        value: 0,
                        title: filter.frequency.value
                    });
                    input.style.display = 'inline-block';
                    input.setAttribute('orient', 'vertical');
                    wavesurfer2.drawer.style(input, {
                        'webkitAppearance': 'slider-vertical',
                        width: '40px',
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
                wavesurfer2.filters = filters;
            });
            */

        </script>
    {/literal}
</div>

{include file='page_footer.tpl'}

