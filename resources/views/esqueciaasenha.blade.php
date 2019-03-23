@include('head')

<link rel="stylesheet" href="{{ asset('css/esqueciaasenha.css') }}">
<script src="{{ asset('js/esqueciaasenha.js') }}"></script>

<section id="esqueciaasenha">

	<div class="base carregando">
		<a href="index.php"><div class="editarPerfil sair"><img src="images/logo.jpg" class="logo"></a>

		<div class="esqueciaasenha">

			<div class="titulo">
				<span>Esqueci a Senha</span>
			</div>

			<div class="esqueciasenhaDiv">
				<form class="esqueciasenhaForm" name="esqueciasenhaForm">
					<input type="text" name="esqueciasenhaEmail" class="esqueciasenhaEmail" placeholder="EMAIL">
					<input type="text" name="esqueciasenhaRepetirEmail" class="esqueciasenhaRepetirEmail" placeholder="REPETIR EMAIL">
					<button>Recuperar</button>
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

</section>

@include('footer')