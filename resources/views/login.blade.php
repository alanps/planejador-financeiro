@include('head')

<link rel="stylesheet" href="{{ asset('css/login.css') }}">
<link href="https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/css/datepicker.min.css" rel="stylesheet" type="text/css">
<script src="{{ asset('js/login.js') }}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/js/datepicker.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/js/i18n/datepicker.pt-BR.js"></script>


<section id="login">

    <div class="base carregando">
        <img src="images/logo.jpg" class="logo">


        <div class="login">

            <div class="titulo">
                <span>Login</span>
            </div>

            <div class="loginDiv">
                <form class="loginForm" name="loginForm">
                    <input type="text" name="loginUsuario" class="loginUsuario" placeholder="EMAIL">
                    <input type="password" name="loginSenha" class="loginSenha" placeholder="SENHA">
                    <button>Entrar</button>
                    <img src="images/loading.svg" class="loading">

                    <div class="erro"></div>
                    <a class="esqueciSenhaLink" href="esqueciaasenha"><span class="esqueciSenha">Esqueci a Senha</span></a>
                </form>
            </div>

        </div>

        <div class="registro">

            <div class="titulo">
                <span>Novo Registro</span>
            </div>

            <div class="registroDiv">
                <form class="registroForm" name="registroForm">
                    <input type="text" name="registroNome" class="registroNome" placeholder="NOME COMPLETO">
                    <input type="text" name="registroDataNascimento" class="registroDataNascimento" placeholder="DATA DE NASCIMENTO" readonly>
                    <input type="text" name="registroProfissao" class="registroProfissao" placeholder="PROFISSÃO">
                    <div class="registroSexo">
                        <span class="registroSexoOp">SEXO</span>
                        <span class="icon-arrow-down registroSexoImg"></span>
                    </div>
                    <div class="registroSexo2">
                        <span class="registroSexoMasc">Masculino</span>
                        <span class="registroSexoFem">Feminino</span>
                    </div>
                    <input type="text" name="registroEmail" class="registroEmail" placeholder="EMAIL">
                    <input type="password" name="registroSenha" class="registroSenha" placeholder="SENHA">
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

</section>

@include('footer')