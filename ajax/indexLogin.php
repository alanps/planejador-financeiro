<?php

session_start();

include "../functions.php";

setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
$tz_object = new DateTimeZone('Brazil/East');
$now = new DateTime();
$now->setTimezone($tz_object);
$now->format("U");

if (validaUsuario($_POST["loginUsuario"], md5($_POST["loginSenha"])) == true) {
    //$_COOKIE['loginUsuario']  = $_POST["loginUsuario"];
    //$_COOKIE['loginSenha'] = md5($_POST["loginSenha"]);
    setcookie("loginUsuario", $_POST["loginUsuario"], 0, "/planejador");
    setcookie("loginSenha", md5($_POST["loginSenha"]), 0, "/planejador");

	$chamada = new Crud();
    $arraySite = array('ultimoAcesso' => $now->format($now->getTimestamp()));
    $arrayCondicao = array('login' => $_POST['loginUsuario']);
    $chamada->update($arraySite, $arrayCondicao, "usuarios");

} else {
	json_simple("false", "Usuário não encontrado.", $arraySite);
}

?>