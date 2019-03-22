<?php

session_start();
header('Content-Type: text/html; charset=utf-8');

include "../functions.php";
	
$chamada = new Crud();
$arrayCondicao = array('id' => $_COOKIE['id']);
$chamada->read_simple($arrayCondicao, "", "usuarios");

?>