<?php

define('SMARTY_DIR', '../libs/smarty/libs/');

include_once(SMARTY_DIR . "Smarty.class.php");

$smarty = new Smarty();

$smarty->setTemplateDir('../templates/');

# Unified to enable easy copy of the code
$smarty->setConfigDir('../../SMARTY/configs/');
$smarty->setCacheDir('../../SMARTY/cache/');
$smarty->setCompileDir('../../SMARTY/templates_c/');

?>