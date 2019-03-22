<?php 

session_start();

include "functions.php";

if (isset($_COOKIE["loginUsuario"]) && isset($_COOKIE["loginSenha"])) {
	header("Location: planejador.php");
} else {
	expulsaVisitante();
    header("Location: login.php");
}

?>

<?php include "header.php"; ?>


<?php include "footer.php"; ?>