{include file='page_header.tpl'}

<div id="csscontent">
    <div id="title" class="roundDiv" align="center">
		<h1>Data Visualization Framework for Soundscape Ecology Applications</h1>
    </div>
    
    <div id="title" class="roundDiv" align="center">
        <img src="../images/backIndex.png">
    </div>

</div>

{literal}
<script>
	$( "#controlgroup" ).controlgroup();
	$( "#tabs" ).tabs();
	$( "#progressbar" ).progressbar({
		value: 20
	});
</script>
{/literal}

{include file='page_footer.tpl'}