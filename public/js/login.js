(function($) {

    $(document).ready(function(){

        if($("#page-login").length > 0 ) {
            var content = new pageUsers($("#page-login"));
        }

    });


    var pageUsers =  function(el) {

	    $(document).ready(function() {

			console.log("#################################################");
			console.log("Iniciando tela de login do Planejador Financeiro.");
			console.log("#################################################");


            //setando os campos que usam o calendário
            el.find('.registroDataNascimento').datepicker({
                language: 'pt-BR',
                minDate: new Date("1900-01-01"), // Now can select only dates, which goes after today
                maxDate: new Date() // Now can select only dates, which goes after today
            });

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
	            var token = localStorage.getItem('token');
	            var userData = getObject('userData');
	            if(token && userData){
	            	window.location = "aplicativo";
	                return;
	            }
	            
		        carregamento();
	    	});

			$(window).on('resize', function(){
			    carregamento();
			});


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
				el.find("#login").addClass("travado");
				el.find(".login .erro").fadeOut('fast');
				el.find(".login button").prop('disabled', false);
				loginEsconderErro();
				var login = el.find(".registroUsuario").val();
				var email = el.find(".registroEmail").val();
				var password = el.find(".registroSenha").val();
				var nome = el.find(".registroNome").val();
				var dataNascimentoExplode = el.find(".registroDataNascimento").val().split('/');
				var dataNascimento = moment(dataNascimentoExplode[2]+"/"+dataNascimentoExplode[1]+"/"+dataNascimentoExplode[0]).format("X");
				var profissao = el.find(".registroProfissao").val();
				var sexo = el.find(".registroSexoOp").html();
				el.find(".registro button").prop('disabled', true);
				el.find(".registro .loading").show();
				$.ajax({
				    url: window.homepath + "usuarios",
				    method: 'POST',
				    dataType: 'json',
			    	data: { nome: nome, email: email, password: password, sexo: sexo, profissao: profissao, data_nascimento: dataNascimento },
				    success: function (data) {
				    	console.log("indexRegistro");
				    	console.log(data);

						if (data.success == true) {
							el.find(".registro .erro").html("Cadastro Feito com Sucesso!");
							el.find(".registro .erro").fadeIn('fast'); 
							el.find(".registro .loading").hide();
							registroEsconderErro();
							registroEsconderTime = null;

							el.find(".registroForm input").addClass("backgroundBlue");
							el.find(".registroSexoOp").addClass("backgroundBlue");
							el.find(".loginSenha").val(el.find(".registroSenha").val());
							el.find(".loginUsuario").val(el.find(".registroEmail").val());
							el.find(".loginUsuario").focus();
							el.find(".login").addClass("tremer");
							setTimeout(function() { 
								el.find(".registroForm input").removeClass("backgroundBlue");
								el.find(".registroSexoOp").removeClass("backgroundBlue");
								el.find(".login").removeClass("tremer");
							}, 3000);

					    	el.find(".registroForm")[0].reset();
					    	el.find(".registroSexoOp").html("SEXO");
					    	el.find(".registroDataNascimento").val("");

						} else {
							var erro;
							el.find(".registro .loading").hide();
							if (registroEsconderTime == null) {
								$.each(data.message, function(index, value){
								    erro = value[0];
								});
								el.find(".registro .erro").html(erro);
								el.find(".registro .erro").fadeIn('fast');
								registroEsconderErro();
							}
							el.find(".registroForm input").addClass("backgroundRed");
							el.find(".registroSexoOp").addClass("backgroundRed");
							setTimeout(function() { 
								el.find(".registroForm input").removeClass("backgroundRed");
								el.find(".registroSexoOp").removeClass("backgroundRed");
							}, 3000);
						}

						el.find("#login").removeClass("travado");

				    },
				    error: function (data, status, error) {
				    	console.log("ERRO:");
                 		console.log(data);
						el.find(".registro .loading").hide();
						el.find(".registro .erro").html("Erro, tente mais tarde!");
						el.find(".registro .erro").fadeIn('fast');
						registroEsconderErro();
						el.find("#login").removeClass("travado");
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
        		localStorage.setItem('token',null);
        		window.token = null;
        		var userData = setObject('userData', null);
        		window.userData = userData;
				el.find("#login").addClass("travado");
				el.find(".registro .erro").fadeOut('fast');
				el.find(".registro button").prop('disabled', false);
				registroEsconderTime = null;
				registroEsconderErro();
				var loginUsuario = el.find(".loginUsuario").val();
				var loginSenha = el.find(".loginSenha").val();
				el.find(".login button").prop('disabled', true);
				el.find(".login .loading").show();
				$.ajax({
				    url: window.homepath + "login",
				    method: 'POST',
				    dataType: 'json',
			    	data: { email: loginUsuario, password: loginSenha },
				    success: function (data) {
				    	console.log("indexLogin");
				    	console.log(data);

						if (data.success == true) {
							el.find(".loginUsuario").addClass("backgroundBlue");
							el.find(".loginSenha").addClass("backgroundBlue");
							setTimeout(function() { 
								el.find(".loginUsuario").removeClass("backgroundBlue");
								el.find(".loginSenha").removeClass("backgroundBlue");
							}, 3000);
        					window.token = "Bearer " + data.data.api_token;
                    		localStorage.setItem('token', "Bearer " + data.data.api_token);
			        		window.userData = data.data;
			        		userData = setObject('userData', data.data);
							window.location = "aplicativo";
						} else {
							el.find(".login .loading").hide();
							if (loginEsconderTime == null) {
								$.each(data.message, function(index, value){
								    erro = value[0];
								});
								el.find(".login .erro").html(erro);
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
						el.find("#login").removeClass("travado");
				    },
				    error: function (data) {
				    	console.log("ERRO:");
                 		console.log(data);
						el.find(".login .loading").hide();
						el.find(".login .erro").html("Erro, tente mais tarde!");
						el.find(".login .erro").fadeIn('fast');
						loginEsconderErro();
						el.find("#login").removeClass("travado");
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
			el.find(".registroProfissao").keydown(function(e) {
				if (e.keyCode == "9" && event.shiftKey) {
					el.find(".registroSexo2").toggle();
					el.find(".registroSexo2").attr("tabindex",-1);
					el.find(".registroDataNascimento").focus();
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
					el.find(".registroSexo2").attr("tabindex",-1);
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


		});


        return this;
    }


})(jQuery);