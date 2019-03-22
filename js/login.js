(function($) {

    $(document).ready(function(){

        if($(".page-login").length > 0 ) {
            var content = new pageUsers($(".page-login"));
        }

    });


    var pageUsers =  function(el) {

	    $(document).ready(function() {

			console.log("#################################################");
			console.log("Iniciando tela de login do Planejador Financeiro.");
			console.log("#################################################");

			//////////////////////////////////////////////
			//função inicial de carregamento
		    //barra entrada em smartphone e tablet
		    function carregamento() {
			    if ($("html").hasClass("smartphone") || $("html").hasClass("tablet")) {
	        		el.find(".base").removeClass('carregando');
	        		el.find(".base").addClass('desabilitado');
		    		console.log("######### barrada entrada de tablet ou smartphone!!! #########");
			    } else {
	        		el.find(".base").removeClass('desabilitado');
            		el.find(".base").removeClass('carregando');
			    }
			}

			//////////////////////////////////////////////
			//chamada da função inicial de carregamento
		    $(document).ready(function() {
		        carregamento();
	    	});

			$(window).on('resize', function(){
			    carregamento();
			});

			//////////////////////////////////////////////
		    //eventos em inputs de data
			var patternday = "[0-3]";
			var patternday2 = "[0-9]";
			var patternmonth = "[0-1]";
			var patternmonth2 = "[0-9]";
			var patternyear = "[1-2]";
			var patternyear2 = "[0-9]";
			var patternyear3 = "[0-9]";
			var patternyear4 = "[0-9]";

            el.find('.registroDataNascimento').click(function(event) {
	          	el.find('.registroDataNascimento').mask('dD/sS/yYzZ', {'translation': {
						d: {pattern: patternday},
						D: {pattern: patternday2},
						s: {pattern: patternmonth},
						S: {pattern: patternmonth2},
						y: {pattern: patternyear},
						Y: {pattern: patternyear2},
						z: {pattern: patternyear3},
						Z: {pattern: patternyear4},
		            }, 
		            onChange: function(data){
						el.find(".registroDataNascimento").attr('value', data);
					},
	            });
            });

            el.find('.registroDataNascimento').focus(function(event) {
	          	el.find('.registroDataNascimento').mask('dD/sS/yYzZ', {'translation': {
						d: {pattern: patternday},
						D: {pattern: patternday2},
						s: {pattern: patternmonth},
						S: {pattern: patternmonth2},
						y: {pattern: patternyear},
						Y: {pattern: patternyear2},
						z: {pattern: patternyear3},
						Z: {pattern: patternyear4},
		            }, 
		            onChange: function(data){
						el.find(".registroDataNascimento").attr('value', data);
					},
	            });
            });

            el.find('.registroDataNascimento').click(function() {
				patternday = "[0-3]";
				patternday2 = "[0-9]";
				patternmonth = "[0-1]";
				patternmonth2 = "[0-9]";
				patternyear = "[1-2]";
				patternyear2 = "[0-9]";
				patternyear3 = "[0-9]";
				patternyear4 = "[0-9]";
			    $(this).select();
			});

            el.find('.registroDataNascimento').keydown(function(event) {
            	if (event.keyCode == "46") {
            		el.find(".registroDataNascimento").val("");
            	}

            	var data = el.find('.registroDataNascimento').val();
            	var arr = data.split('/');
			    var day = arr[0];
		    	if (day == "3") {
		    		patternday = "[3]";
		    		patternday2 = "[0-1]";
                	changeMaskDate();
		    	}

		    	if (data.length >= 3) {
			    	var month = arr[1];
			    	if (month == 0) {
			    		patternmonth = "[0-1]";
			    		patternmonth2 = "[1-9]";
	                	changeMaskDate();
			    	} else if (month == 1) {
			    		patternmonth = "[0-1]";
			    		patternmonth2 = "[0-2]";
	                	changeMaskDate();
			    	}
			    }

		    	if (data.length >= 6) {
					var year = arr[2].split(''); //terceiro digito do ano
			    	if (year[0] == "1") {
			    		patternyear2 = "[9]";
			    		patternyear3 = "[0-9]";
			    		patternyear4 = "[0-9]";
	                	changeMaskDate();
			    	} else if (year[0] == "2") {
			    		patternyear2 = "[0]";
			    		patternyear3 = "[0-2]";
			    		patternyear4 = "[0-9]";
	                	changeMaskDate();
			    	}
			    }


            });

            function changeMaskDate(e){
				el.find('.registroDataNascimento').unmask();
	          	el.find('.registroDataNascimento').mask('dD/sS/yYzZ', {'translation': {
						d: {pattern: patternday},
						D: {pattern: patternday2},
						s: {pattern: patternmonth},
						S: {pattern: patternmonth2},
						y: {pattern: patternyear},
						Y: {pattern: patternyear2},
						z: {pattern: patternyear3},
						Z: {pattern: patternyear4},
		            }, 
		            onChange: function(data){
						el.find(".registroDataNascimento").attr('value', data);
					},
	            });
            }

			//////////////////////////////////////////
			//timer da div/alert de login
			var loginEsconderTime = null;
			function loginEsconderErro() {
				if (loginEsconderTime != null) {
					clearTimeout(loginEsconderTime);
					loginEsconderTime = null;
					el.find(".login button").prop('disabled', false);
				}
				else {
					loginEsconderTime = setTimeout(function() {	
						el.find(".login .erro").fadeOut('fast'); 
						loginEsconderTime = null;
						el.find(".login button").prop('disabled', false);
					}, 5000);
				}
			}

			//////////////////////////////////////////
			//timer da div/alert de registro
			var registroEsconderTime = null;
			function registroEsconderErro() {
				if (registroEsconderTime != null) {
					clearTimeout(registroEsconderTime);
					registroEsconderTime = null;
					el.find(".registro button").prop('disabled', false);
				}
				else {
					registroEsconderTime = setTimeout(function() {	
						el.find(".registro .erro").fadeOut('fast'); 
						registroEsconderTime = null;
						el.find(".registro button").prop('disabled', false);
					}, 5000);
				}
			}

			//////////////////////////////////////////
			//click no botão de registrar
			el.find(".registro button").click(function(e) {
				registroNovoUsuario();
				e.preventDefault();
			});

			//////////////////////////////////////////
			//função de ajax de registrar
			function registroNovoUsuario() {
				el.find(".login .erro").fadeOut('fast');
				el.find(".login button").prop('disabled', false);
				loginEsconderErro();
				var login = el.find(".registroUsuario").val();
				var email = el.find(".registroEmail").val();
				var senha = el.find(".registroSenha").val();
				var nome = el.find(".registroNome").val();
				var dataNascimento = el.find(".registroDataNascimento").val();
				var profissao = el.find(".registroProfissao").val();
				var sexo = el.find(".registroSexoOp").html();
				el.find(".registro button").prop('disabled', true);
				el.find(".registro .loading").show();
				$.ajax({
				    url: window.homepath + "ajax/indexRegistro.php",
				    method: 'POST',
				    dataType: 'json',
			    	data: { login: login, email: email, senha: senha, sexo: sexo, nome: nome, dataNascimento: dataNascimento, profissao: profissao },
				    success: function (data) {
				    	console.log("indexRegistro");
				    	console.log(data);

						if (data.success == "true") {
							el.find(".registro .erro").html("Cadastro Feito com Sucesso!");
							el.find(".registro .erro").fadeIn('fast'); 
							el.find(".registro .loading").hide();
							registroEsconderErro();
							registroEsconderTime = null;

							el.find(".registroUsuario").addClass("backgroundBlue");
							el.find(".registroEmail").addClass("backgroundBlue");
							el.find(".registroSenha").addClass("backgroundBlue");
							el.find(".registroSexoOp").addClass("backgroundBlue");
							el.find(".registroNome").addClass("backgroundBlue");
							el.find(".registroDataNascimento").addClass("backgroundBlue");
							el.find(".registroProfissao").addClass("backgroundBlue");
							el.find(".loginSenha").val(el.find(".registroSenha").val());
							el.find(".loginUsuario").val(el.find(".registroUsuario").val());
							el.find(".loginUsuario").focus();
							setTimeout(function() { 
								el.find(".registroUsuario").removeClass("backgroundBlue");
								el.find(".registroEmail").removeClass("backgroundBlue");
								el.find(".registroSenha").removeClass("backgroundBlue");
								el.find(".registroSexoOp").removeClass("backgroundBlue");
								el.find(".registroNome").removeClass("backgroundBlue");
								el.find(".registroDataNascimento").removeClass("backgroundBlue");
								el.find(".registroProfissao").removeClass("backgroundBlue");
							}, 3000);

						} else {
							el.find(".registro .loading").hide();
							if (registroEsconderTime == null) {
								el.find(".registro .erro").html(data.message);
								el.find(".registro .erro").fadeIn('fast');
								registroEsconderErro();
							}
							el.find(".registroUsuario").addClass("backgroundRed");
							el.find(".registroEmail").addClass("backgroundRed");
							el.find(".registroSenha").addClass("backgroundRed");
							el.find(".registroSexoOp").addClass("backgroundRed");
							el.find(".registroNome").addClass("backgroundRed");
							el.find(".registroDataNascimento").addClass("backgroundRed");
							el.find(".registroProfissao").addClass("backgroundRed");
							setTimeout(function() { 
								el.find(".registroUsuario").removeClass("backgroundRed");
								el.find(".registroEmail").removeClass("backgroundRed");
								el.find(".registroSenha").removeClass("backgroundRed");
								el.find(".registroSexoOp").removeClass("backgroundRed");
								el.find(".registroNome").removeClass("backgroundRed");
								el.find(".registroDataNascimento").removeClass("backgroundRed");
								el.find(".registroProfissao").removeClass("backgroundRed");
							}, 3000);
							el.find(".registroForm")[0].reset();
						}
				    },
				    error: function (data) {
				    	console.log("ERRO:");
				    	console.log(data);
						el.find(".registro .loading").hide();
						el.find(".registro .erro").html("Erro, tente mais tarde!");
						el.find(".registro .erro").fadeIn('fast');
						registroEsconderErro();
				    },
				});
			}

			//////////////////////////////////////////
			//click na div/alert de erro de registro
			$(".registro .erro").click(function() {
					el.find(".login .erro").fadeOut('fast');
					loginEsconderTime = null;
					el.find(".registro .erro").fadeOut('fast');
					el.find(".registro button").prop('disabled', false);
					registroEsconderErro();
			});


			//////////////////////////////////////////
			//click no botão de login
			el.find(".login button").click(function(e) {
				loginUsuario();
				e.preventDefault();
			});

			//////////////////////////////////////////
			//função de ajax de login
			function loginUsuario() {
				el.find(".registro .erro").fadeOut('fast'); 
				el.find(".registro button").prop('disabled', false);
				registroEsconderTime = null;
				registroEsconderErro();
				var loginUsuario = el.find(".loginUsuario").val();
				var loginSenha = el.find(".loginSenha").val();
				el.find(".login button").prop('disabled', true);
				el.find(".login .loading").show();
				$.ajax({
				    url: window.homepath + "ajax/indexLogin.php",
				    method: 'POST',
				    dataType: 'json',
			    	data: { loginUsuario: loginUsuario, loginSenha: loginSenha },
				    success: function (data) {
				    	console.log("indexLogin");
				    	console.log(data);

						if (data.success == "true") {
							el.find(".loginForm").submit();
							el.find(".loginUsuario").addClass("backgroundBlue");
							el.find(".loginSenha").addClass("backgroundBlue");
							setTimeout(function() { 
								el.find(".loginUsuario").removeClass("backgroundBlue");
								el.find(".loginSenha").removeClass("backgroundBlue");
							}, 3000);
						} else {
							el.find(".login .loading").hide();
							if (loginEsconderTime == null) {
								el.find(".login .erro").fadeIn('fast');
								loginEsconderErro();
							}
							el.find(".loginUsuario").addClass("backgroundRed");
							el.find(".loginSenha").addClass("backgroundRed");
							setTimeout(function() { 
								el.find(".loginUsuario").removeClass("backgroundRed");
								el.find(".loginSenha").removeClass("backgroundRed");
							}, 3000);
						}
				    },
				    error: function (data) {
				    	console.log("ERRO:");
				    	console.log(data);
						el.find(".login .loading").hide();
						el.find(".login .erro").html("Erro, tente mais tarde!");
						el.find(".login .erro").fadeIn('fast');
						loginEsconderErro();
				    },
				});
			}


			//////////////////////////////////////////
			//click na div/alert de erro de login
			el.find(".login .erro").click(function() {
					el.find(".registro .erro").fadeOut('fast');
					registroEsconderTime = null;
					el.find(".login .erro").fadeOut('fast');
					el.find(".login button").prop('disabled', false);
					loginEsconderErro();
			});


			//////////////////////////////////////////
			//clicks, hovers e ações do select de sexo
			$(document).click(function() {
				if (el.find('.registroSexo2').is(":visible")) {
					el.find(".registroSexo2").hide();
				}
			});

			el.find("input").focus(function() {
				el.find(".registroSexo2").hide();
			});

			el.find(".login button").click(function() {
				if (el.find('.registroSexo2').is(":visible")) {
					el.find(".registroSexo2").hide();
				}
			});

			el.find(".registroSexo, .registroSexoImg").click(function() {
				el.find(".registroSexo2").toggle();
				event.stopPropagation();
			});

			el.find(".registroSexoMasc").click(function() {
				el.find(".registroSexoOp").html("Masculino");
				el.find(".registroSexo2").hide();
				event.stopPropagation();
			});

			el.find(".registroSexoFem").click(function() {
				el.find(".registroSexoOp").html("Feminino");
				el.find(".registroSexo2").hide();
				event.stopPropagation();
			});

			el.find(".registroSexoFem").hover(function(e) {
				el.find(".registroSexoFem").removeClass('hover');
				el.find(".registroSexoMasc").removeClass('hover');
				el.find(".registroSexoOp").html("Feminino");
			});

			el.find(".registroSexoMasc").hover(function(e) {
				el.find(".registroSexoFem").removeClass('hover');
				el.find(".registroSexoMasc").removeClass('hover');
				el.find(".registroSexoOp").html("Masculino");
			});

			//////////////////////////////////////////
			//teclas de atalho do select de sexo
			//tecla tab
			el.find(".registroProfissao").keydown(function(e) {
				if (e.keyCode == "9") {
					el.find(".registroSexo2").toggle();
					el.find(".registroSexo2").attr("tabindex",-1).focus();
					e.stopPropagation();
					e.preventDefault();
			    }
			});

			//tecla tab + shift
			el.find(".registroEmail").keydown(function(e) {
				if (e.keyCode == "9" && event.shiftKey) {
					el.find(".registroSexo2").toggle();
					el.find(".registroSexo2").attr("tabindex",-1).focus();
					e.stopPropagation();
					e.preventDefault();
			    }
			});

			//tecla tab
			el.find(".registroSexo2").keydown(function(e) {
				if (e.keyCode == "9") {
					el.find(".registroSexo2").hide();
					el.find(".registroEmail").focus();
					e.stopPropagation();
					e.preventDefault();
				}
			});

			//tecla tab + shift
			el.find(".registroSexo2").keydown(function(e) {
				if (e.keyCode == "9" && event.shiftKey) {
					el.find(".registroSexo2").hide();
					el.find(".registroProfissao").focus();
					e.stopPropagation();
					e.preventDefault();
			    }
			});

			$(document).keydown(function(e) {
			    if (el.find(".registroSexo2").is(":visible")) {
					if (e.keyCode == "9") {
						el.find(".registroSexo2").toggle();
						e.stopPropagation();
				    }
					if (e.keyCode == "27") {
						el.find(".registroSexoFem").removeClass('hover');
						el.find(".registroSexoMasc").removeClass('hover');
						el.find(".registroSexo2").hide();
						e.stopPropagation();
				    }
					if (e.keyCode == "40") {
						if (!el.find(".registroSexoMasc").hasClass("hover")) {
							el.find(".registroSexoFem").removeClass('hover');
							el.find(".registroSexoMasc").addClass('hover');
							el.find(".registroSexoOp").html("Masculino");
							e.stopPropagation();
						} else if (!el.find(".registroSexoFem").hasClass("hover")) {
							el.find(".registroSexoMasc").removeClass('hover');
							el.find(".registroSexoFem").addClass('hover');
							el.find(".registroSexoOp").html("Feminino");
							e.stopPropagation();
						}
				    }
				    if (e.keyCode == "38") {
						if (!el.find(".registroSexoMasc").hasClass("hover")) {
							el.find(".registroSexoFem").removeClass('hover');
							el.find(".registroSexoMasc").addClass('hover');
							el.find(".registroSexoOp").html("Masculino");
							e.stopPropagation();
						} else if (!el.find(".registroSexoFem").hasClass("hover")) {
							el.find(".registroSexoMasc").removeClass('hover');
							el.find(".registroSexoFem").addClass('hover');
							el.find(".registroSexoOp").html("Feminino");
							e.stopPropagation();
						}
				    }
				    if (e.keyCode == "32" || e.keyCode == "13") {
				    	if (el.find(".registroSexoMasc").hasClass("hover")) {
							el.find(".registroSexoOp").html("Masculino");
							el.find(".registroSexo2").hide();
							e.stopPropagation();
							return false;
						} else if (el.find(".registroSexoFem").hasClass("hover")) {
							el.find(".registroSexoOp").html("Feminino");
							el.find(".registroSexo2").hide();
							e.stopPropagation();
							return false;
						}
				    }
				}
			}); 

			//////////////////////////////////////////
			//focus e blur nos campos de login e registro
			el.find(".loginUsuario").focus(function() {
				var value = $(this).val();
				if (value == "LOGIN")
				{
					$(this).val('');
				}
			});

			el.find(".loginUsuario").blur(function() {
				var value = $(this).val();
				if (value == "")
				{
					$(this).val('LOGIN');
				}
			});

			el.find(".loginSenha").focus(function() {
				var value = $(this).val();
				if (value == "SENHA")
				{
				   $(this).val('');
				}
			});

			el.find(".loginSenha").blur(function() {
				var value = $(this).val();
				if (value == "")
				{
					$(this).val("SENHA");
				}
			});

			el.find(".registroUsuario").focus(function() {
				var value = $(this).val();
				if (value == "LOGIN")
				{
				   $(this).val('');
				}
			});

			el.find(".registroUsuario").blur(function() {
				var value = $(this).val();
				if (value == "")
				{
					$(this).val("LOGIN");
				}
			});

			el.find(".registroEmail").focus(function() {
				var value = $(this).val();
				if (value == "EMAIL")
				{
				   $(this).val('');
				}
			});

			el.find(".registroEmail").blur(function() {
				var value = $(this).val();
				if (value == "")
				{
					$(this).val("EMAIL");
				}
			});

			el.find(".registroSenha").focus(function() {
				var value = $(this).val();
				if (value == "SENHA")
				{
				   $(this).val('');
				}
			});

			el.find(".registroSenha").blur(function() {
				var value = $(this).val();
				if (value == "")
				{
					$(this).val("SENHA");
				}
			});

			el.find(".registroNome").focus(function() {
				var value = $(this).val();
				if (value == "NOME COMPLETO")
				{
				   $(this).val('');
				}
			});

			el.find(".registroNome").blur(function() {
				var value = $(this).val();
				if (value == "")
				{
					$(this).val("NOME COMPLETO");
				}
			});

			el.find(".registroDataNascimento").focus(function() {
				var value = $(this).val();
				if (value == "DATA DE NASCIMENTO")
				{
				   $(this).val('');
				}
			});

			el.find(".registroDataNascimento").blur(function() {
				var value = $(this).val();
				if (value == "")
				{
					$(this).val("DATA DE NASCIMENTO");
				}
			});

			el.find(".registroProfissao").focus(function() {
				var value = $(this).val();
				if (value == "PROFISSÃO")
				{
				   $(this).val('');
				}
			});

			el.find(".registroProfissao").blur(function() {
				var value = $(this).val();
				if (value == "")
				{
					$(this).val("PROFISSÃO");
				}
			});


		});


        return this;
    }


})(jQuery);