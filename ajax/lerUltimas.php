<?php

session_start();
header('Content-Type: text/html; charset=utf-8');

include "../functions.php";

setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
$tz_object = new DateTimeZone('Brazil/East');
$now = new DateTime();
$now->setTimezone($tz_object);

$add = $_POST['dataAdd'];
$fim = $_POST['dataFim'];

if ($add == "") {
	$add = strtotime("-1 month");
}
if ($fim == "") {
	$fim = $now->format($now->getTimestamp());
}

$arrayCondicao = array(
	'idUsuario' => $_COOKIE['id'],
	'dataAdd' => $add,
	'dataFim' => $fim
);
$chamada = new Crud();
$arrayTables = array('entrada','saida','objetivos');

if ($_POST['dataAdd'] == "" && $_POST['dataFim'] == "") {
	$chamada->read_between($arrayCondicao, "`dataAdicionado` DESC", $arrayTables, 4, 1, true);
} else {
	$chamada->read_between($arrayCondicao, "`dataAdicionado` DESC", $arrayTables, 4, 1);
}


?>