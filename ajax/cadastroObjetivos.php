<?php

session_start();
header('Content-Type: text/html; charset=utf-8');

include "../functions.php";

setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
$tz_object = new DateTimeZone('Brazil/East');
$now = new DateTime();
$now->setTimezone($tz_object);

$arrayObjetivo = array(
	'idUsuario' => $_COOKIE['id'], 
	'tipoValorTag' => $_POST['tipoValorTag'], 
	'tipoValor' => htmlspecialchars(ucwords($_POST['tipoValor'])),
	'valorTotal' => $_POST['valorTotal'],
	'dataPrevista' => $_POST['dataPrevista'],
	'dataAdicionado' => $now->format($now->getTimestamp()), 
);

$chamada = new Crud();
$chamada->insert($arrayObjetivo, "objetivos");
echo $chamada;

?>