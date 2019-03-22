<?php

session_start();
header('Content-Type: text/html; charset=utf-8');

include "../functions.php";

$chamada = new Crud();
$arrayCondicao = array(
		'id' => $_POST['id']
	);
$table = $_POST['table'];
$chamada->delete($arrayCondicao, $table);
echo $chamada;

?>