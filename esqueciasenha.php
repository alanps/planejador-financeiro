<?php 

include "functions.php";

?>

<?php include "header.php"; ?>

<link rel="stylesheet" href="css/esqueciasenha.css" />

<body class="page-esqueciasenha">

<div class="base carregando">
	<a href="index.php"><div class="editarPerfil sair"><img src="images/logo.jpg" class="logo"></a>

	<div class="esqueciasenha">

		<div class="titulo">
			<span>Esqueci a Senha</span>
		</div>

		<div class="esqueciasenhaDiv">
			<form class="esqueciasenhaForm" name="esqueciasenhaForm" action="planejador.php" method="POST">
				<input type="text" name="esqueciasenhaEmail" class="esqueciasenhaEmail" value="EMAIL">
				<input type="text" name="esqueciasenhaRepetirEmail" class="esqueciasenhaRepetirEmail" value="REPETIR EMAIL">
				<button>Recuperar</button>
				<img src="images/loading.svg" class="loading">

				<div class="erro">Email não encontrado!</div>
			</form>
		</div>

	</div>

</div>

<div class="naodisponivel">
	<span class="icon-lock"></span>
	<span>Site não disponivel para tablet e smartphone.</span>
</div>

<script src="js/esqueciasenha.js"></script>

<?php include "footer.php"; ?>