<?php

header('Content-Type: text/html; charset=utf-8');
include "../functions.php";

$login=$_POST['login'];
$email=strtolower($_POST['email']);
$senha=$_POST['senha'];
$sexo=$_POST['sexo'];
$dataNascimento=$_POST['dataNascimento'];
$nome=$_POST['nome'];
$nome=ucwords(strtolower($nome));
$nome=preg_replace_callback('!\b[a-z]!', 'upper', $nome);
$nome=htmlentities($nome);
$profissao=ucwords(strtolower($_POST['profissao']));


/////////////////////////////////////////
//função para deixar caractere antes das aspas simples capitalize
function upper($matches) {
  return strtoupper($matches[0]);
}

/////////////////////////////////////////
//função para enviar o email de cadastro
function enviarEmail($destinatario, $nome, $login, $senha) {

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

		$subject = "Bem Vindo ao Planejador Financeiro";
		$file = file_get_contents("../templates/template-bemvindo.html");
		$file = str_replace("[NOMECOMPLETO]", $nome, $file);
		$file = str_replace("[LOGIN]", $login, $file);
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

$dataNascimento2 = explode('/', $dataNascimento);
$month = $dataNascimento2[1];
$day   = $dataNascimento2[0];
$year  = $dataNascimento2[2];

$arraySite = array(
	'email' => $email,
	'login' => $login,
	'senha' => md5($senha),
	'sexo' => $sexo,
	'nome' => $nome,
	'profissao' => $profissao,
	'dataNascimento' => strtotime($month . "-" . $day . "-" . $year),
	'dataCadastro' => $now->format($now->getTimestamp())
);

if ($login == "LOGIN" || $senha == "SENHA" || $email == "EMAIL" || $sexo == "SEXO" || $nome == "NOME" || $dataNascimento == "DATA DE NASCIMENTO" || $profissao == "PROFISSÃO") {
	json_simple("false", "Preencha todos os dados!", $arraySite);

} else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
	json_simple("false", "Email inválido.", $arraySite);

} else if (strlen($senha) <= 3) {
	json_simple("false", "Mínimo 4 caracteres na senha!", $arraySite);

} else if (strlen($login) <= 3) {
	json_simple("false", "Mínimo 4 caracteres no login!", $arraySite);

} else if (strlen($nome) <= 3) {
	json_simple("false", "Mínimo 4 caracteres no nome!", $arraySite);

} else if (strlen($dataNascimento) < 10) {
	json_simple("false", "Data de nascimento inválida!", $arraySite);

} else if (strlen($profissao) < 3) {
	json_simple("false", "Mínimo 4 caracteres na profissão!", $arraySite);

} else {

	$chamada = new Crud();
	$pdo = new PDO('mysql:host='.$chamada->db_host.';dbname='.$chamada->db_name, $chamada->db_user, $chamada->db_pass);
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE login='$login' OR email='$email'");

	$stmt->execute();

	$row_count = $stmt->rowCount();

	if ($row_count == 1) {
		json_simple("false", "Login ou email já cadastrado!", $arraySite);
	} else {

		$whitelist = array('127.0.0.1', "::1");
		if(!in_array($_SERVER['REMOTE_ADDR'], $whitelist)){
			enviarEmail($email, $nome, $login, $senha);
		}

		$crud = new Crud();
		$crud->insert($arraySite, "usuarios");
	}

}

?>