<?php 

include "functions.php";

?>

<?php include "header.php"; ?>

<link rel="stylesheet" href="css/login.css" />

<body class="page-login">

<div class="base carregando">
	<img src="images/logo.jpg" class="logo">


	<div class="login">

		<div class="titulo">
			<span>Login</span>
		</div>

		<div class="loginDiv">
			<form class="loginForm" name="loginForm" action="planejador.php" method="POST">
				<input type="text" name="loginUsuario" class="loginUsuario" value="LOGIN">
				<input type="password" name="loginSenha" class="loginSenha" value="SENHA">
				<button>Entrar</button>
				<img src="images/loading.svg" class="loading">

				<div class="erro">Nome de Usúario ou Senha Incorretos!</div>
				<a class="esqueciSenhaLink" href="esqueciasenha.php"><span class="esqueciSenha">Esqueci a Senha</span></a>
			</form>
		</div>

	</div>

	<div class="registro">

		<div class="titulo">
			<span>Novo Registro</span>
		</div>

		<div class="registroDiv">
			<form class="registroForm" name="registroForm" action="planejador.php" method="POST">
				<input type="text" name="registroNome" class="registroNome" value="NOME COMPLETO">
				<input type="text" name="registroDataNascimento" class="registroDataNascimento" value="DATA DE NASCIMENTO">
				<input type="text" name="registroProfissao" class="registroProfissao" value="PROFISSÃO">
				<div class="registroSexo">
					<span class="registroSexoOp">SEXO</span>
					<span class="icon-arrow-down registroSexoImg"></span>
				</div>
				<div class="registroSexo2">
					<span class="registroSexoMasc">Masculino</span>
					<span class="registroSexoFem">Feminino</span>
				</div>
				<input type="text" name="registroEmail" class="registroEmail" value="EMAIL">
				<input type="text" name="registroUsuario" class="registroUsuario" value="LOGIN">
				<input type="password" name="registroSenha" class="registroSenha" value="SENHA">
				<button>Registrar</button>
				<img src="images/loading.svg" class="loading">
				<div class="erro"></div>
			</form>
		</div>

	</div>


</div>

<div class="naodisponivel">
	<span class="icon-lock"></span>
	<span>Site não disponivel para tablet e smartphone.</span>
</div>

<script src="js/login.js"></script>
<script src="libs/mask/jquery.mask.js" type="text/javascript"></script>
<?php include "footer.php"; ?>