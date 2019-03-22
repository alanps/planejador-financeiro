<?php

session_start();
header('Content-Type: text/html; charset=utf-8');

include "../functions.php";

$chamada = new Crud();
$arrayCondicao = array(
		'idUsuario' => $_COOKIE['id']
	);
if ($_POST['ordenacao'] == "padrao") {
	$ordenacao = "dataAdicionado DESC";
} else {
	$ordenacao = $_POST['ordenacao'];
}
$chamada->read_simple($arrayCondicao, $ordenacao, "objetivos", "9", $_POST['pagina']);


?>