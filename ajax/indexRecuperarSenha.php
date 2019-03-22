<?php

header('Content-Type: text/html; charset=utf-8');
include "../functions.php";

$email=strtolower($_POST['email']);
$email2=strtolower($_POST['email2']);

$senhaRandom = substr(md5(rand()), 0, 10);

function enviarEmail($destinatario, $senha) {

	require '../libs/phpmailer/PHPMailerAutoload.php';


	$mail = new PHPMailer(true);

	try {

	    $mail->isSMTP(); // Define como SMTP
	    $mail->SMTPAuth   = true; // enable SMTP authentication
	    $mail->SMTPSecure = "ssl"; // sets the prefix to the servier
	    $mail->Host       = "br952.hostgator.com.br"; // sets GMAIL as the SMTP server
	    $mail->Port       = 465; // set the SMTP port for the GMAIL server
	    $mail->Username   = "no-reply@agenciadreamup.com.br"; // GMAIL username
	    $mail->Password   = "no-reply"; // GMAIL password

		//$mail->SMTPDebug = 2; // Pra depurar o código remova o // do começo

        $mail->From = "no-reply@agenciadreamup.com.br";
        $mail->FromName = "Planejador Financeiro";
        $mail->FromName = utf8_decode($mail->FromName);

		$mail->addAddress($destinatario); // Adiciona destinatário

		//Habilita HTML
		$mail->isHTML(true);

		$subject = "Planejador Financeiro - Recuperar Senha";
		$file = file_get_contents("../templates/template-esqueciasenha.html");
		$file = str_replace("[EMAIL]", $destinatario, $file);
		$file = str_replace("[SENHA]", $senha, $file);

		$mail->Subject = $subject;
		$mail->Body = $file;
        $mail->Subject = utf8_decode($mail->Subject);
        $mail->Body = utf8_decode($mail->Body);

	    $mail->Send();

	} catch (Exception $e) {

	    echo $e->getMessage();

	}

}


setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
$tz_object = new DateTimeZone('Brazil/East');
$now = new DateTime();
$now->setTimezone($tz_object);

$arraySite = array(
	'email' => $email,
	'recuperarSenha' => $now->format($now->getTimestamp()),
	'senha' => md5($senhaRandom),
);

if ($_POST['email'] == "EMAIL" || $_POST['email2'] == "REPETIR EMAIL") {
	json_simple("false", "Preencha todos os dados!", $arraySite);

} else if ($email != $email2) {
	json_simple("false", "Emails devem ser iguais!", $arraySite);

} else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
	json_simple("false", "Email inválido.", $arraySite);

} else {

	$chamada = new Crud();
	$pdo = new PDO('mysql:host='.$chamada->db_host.';dbname='.$chamada->db_name, $chamada->db_user, $chamada->db_pass);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email='$email'");

	$stmt->execute();

	$row_count = $stmt->rowCount();

	if ($row_count == 1) {

		$whitelist = array('127.0.0.1', "::1");
		if(!in_array($_SERVER['REMOTE_ADDR'], $whitelist)){
			enviarEmail($email, $senhaRandom);
		}

		$crud = new Crud();
    	$arrayCondicao = array('email' => $email);
    	$crud->update($arraySite, $arrayCondicao, "usuarios");
	} else {
		json_simple("false", "Email não encontrado!", $arraySite);
	}

}

?>