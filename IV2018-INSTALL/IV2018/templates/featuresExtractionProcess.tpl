
{literal}
<script>
	function submitAndCheck() {
		//TODO: Testar este código, atualizar progressbar
		var currentDir = $('#dblist').find(':selected').text();
		var percent = 0;
		$( "#progressbar" ).progressbar({value: 0});
		$( "#progressbar > div" ).css({ 'background': '#9ecae1' });
		$('#text1').html('<font size="5"><strong>EXTRACTING FEATURES...</strong></font>');
		
		setInterval(function(){
			if (percent < 100) {
        		$.ajax({
        			url:'../scripts/progressBarUpdate.php?ID='+currentDir,
        			method:'get',
        			//data:{name},
        			success:function(data){        				
        				$( "#progressbar" )
        					.progressbar({value: parseInt(data)})
        					.children('.ui-progressbar-value')
        					.html('<div align="right"><font size="5">'+ parseInt(data) + '%</font></div>')
        					.css("display", "block");
        				percent = data;
        			}
        		});
			};
		}, 2000);
 
	    $.ajax({
            type: "POST",
            url: "../scripts/indexFET2.php",
            data: $("#f1").serialize(),
            success: function(data)
            {
            	$('#text1').html('<font size="5"><strong>EXTRACTION PROCESS COMPLETED</strong></font>');
            	$( "#progressbar > div" ).css({ 'background': '#31a354' });
            }
    	});

	    return false; // avoid to execute the actual submit of the form.
	};

</script>
{/literal}

<div class="roundDiv"><font size=5><strong>Features Extraction Process</strong></font></div><br>

<fieldset style="width: 98%; height: auto; text-align: left;">
    <legend><strong>Extraction</strong></legend>
	
	<div align="center">
	<table>
		<tr>
    		<td>
				<button class="ui-button ui-widget ui-corner-all" onclick="submitAndCheck();">Begin Extraction</button>
    		</td>
    		<td width="90%">
    			<div id="progressbar"></div>
    		</td>
		</tr>
	</table>
	</div>
	
	<br>
	<div align="center" id="text1"></div>
	
	
	<br><br><br><br>
</fieldset><br>









