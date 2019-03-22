<?php

include "class/crud.php";

function protegePagina() {
    if (!isset($_COOKIE['loginUsuario'])) {
        expulsaVisitante();
    } else {
        if (validaUsuario($_POST["loginUsuario"], $_POST["loginSenha"]) == true) {
            expulsaVisitante();
        }
    }
}

function expulsaVisitante() {
    $homepath = "http://www.agenciadreamup.com.br/planejador/"; //localhost
    //$homepath = "http://www.agenciadreamup.com/planejador/"; //ftp
    /*unset($_COOKIE['loginUsuario']);
    unset($_COOKIE['loginSenha']);
    unset($_COOKIE['id']);*/
    setcookie("id", "", 0, "/planejador");
    setcookie("loginUsuario", "", 0, "/planejador");
    setcookie("loginSenha", "", 0, "/planejador");
    header("Location: ".$homepath);
}

function validaUsuario($login, $senha) {

    $chamada = new Crud();

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        $pdo = new PDO('mysql:host='.$chamada->db_host.';dbname='.$chamada->db_name, $chamada->db_user, $chamada->db_pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
       
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE login='".$login."' AND senha='".$senha."'");

        $stmt->execute();

        $row_count = $stmt->rowCount();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($row_count == 1) {
            setcookie("id", $result[0]['id'], 0, "/planejador");
            setcookie("loginUsuario", $login, 0, "/planejador");
            setcookie("loginSenha", md5($senha), 0, "/planejador");
            return true;
        } else {
            return false;
        }

    }
}

?>