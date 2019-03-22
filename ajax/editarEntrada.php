<?php

session_start();
header('Content-Type: text/html; charset=utf-8');

include "../functions.php";

setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
$tz_object = new DateTimeZone('Brazil/East');
$now = new DateTime();
$now->setTimezone($tz_object);

$crud = new Crud();
$arraySite = array(
	'tipoValor' => htmlspecialchars(ucwords($_POST['tipoValor'])),
	'valorTotal' => $_POST['valorTotal'],
	'valorParcela' => $_POST['valorParcela'],
	'nParcelas' => $_POST['nParcelas'],
	'parcelaAtual' => $_POST['parcelaAtual'],
	'dataModificado' => $now->format($now->getTimestamp()),
);
$arrayCondicao = array('id' => $_POST['id']);
$crud->update($arraySite, $arrayCondicao, "entrada");

?>