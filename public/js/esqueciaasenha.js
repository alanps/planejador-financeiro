(function($) {

    $(document).ready(function(){

        if($("#esqueciaasenha").length > 0 ) {
            var content = new pageUsers($("#esqueciaasenha"));
        }

    });


    var pageUsers =  function(el) {


	    $(document).ready(function() {

			console.log("#################################################");
			console.log("Iniciando tela de recuperar senha do Planejador Financeiro.");
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

			//////////////////////////////////////////
			//timer da div/alert de registro
			var esqueciasenhaEsconderTime = null;
			function esqueciasenhaEsconderErro() {
				if (esqueciasenhaEsconderTime != null) {
					clearTimeout(esqueciasenhaEsconderTime);
					esqueciasenhaEsconderTime = null;
					el.find(".esqueciaasenha button").prop('disabled', false);
				}
				else {
					esqueciasenhaEsconderTime = setTimeout(function() {	
						el.find(".esqueciaasenha .erro").fadeOut('fast'); 
						esqueciasenhaEsconderTime = null;
						el.find(".esqueciaasenha button").prop('disabled', false);
					}, 5000);
				}
			}

			//////////////////////////////////////////////
		    //click no botão de NOVA SENHA
			el.find(".esqueciasenhaForm button").click(function(e) {
				gerarNovaSenha();
				e.preventDefault();
			});

			//////////////////////////////////////////////
		    //função de envio de NOVA SENHA
		    function gerarNovaSenha() {
				el.find(".esqueciaasenha .erro").fadeOut('fast');
				esqueciasenhaEsconderTime = null;
				esqueciasenhaEsconderErro();
				el.find(".esqueciaasenha button").prop('disabled', true);
				el.find(".esqueciaasenha .loading").show();
			    $.ajax({
				    url: window.homepath + "resetPass",
				    method: 'PUT',
				    dataType: 'json',
					data: { email: el.find(".esqueciasenhaEmail").val(), email_confirmacao: el.find(".esqueciasenhaRepetirEmail").val() },
				    success: function (data) {
				    	console.log("indexRecuperarSenha");
				    	console.log(data);

						if (data.success == true) {
							el.find(".esqueciaasenha .erro").html(data.message);
							el.find(".esqueciaasenha .erro").fadeIn('fast');
							el.find(".esqueciaasenha .loading").hide();
							el.find(".esqueciasenhaEmail").addClass("backgroundBlue");
							el.find(".esqueciasenhaRepetirEmail").addClass("backgroundBlue");
							setTimeout(function() {
								el.find(".esqueciasenhaEmail").removeClass("backgroundBlue");
								el.find(".esqueciasenhaRepetirEmail").removeClass("backgroundBlue");
							}, 3000);

						} else {
							var erro;
							$.each(data.message, function(index, value){
							    erro = value[0];
							});
							el.find(".esqueciaasenha .erro").html(erro);
							el.find(".esqueciaasenha .erro").fadeIn('fast');
							el.find(".esqueciaasenha .loading").hide();
							esqueciasenhaEsconderErro();
							el.find(".esqueciasenhaEmail").addClass("backgroundRed");
							el.find(".esqueciasenhaRepetirEmail").addClass("backgroundRed");
							setTimeout(function() { 
								el.find(".esqueciasenhaEmail").removeClass("backgroundRed");
								el.find(".esqueciasenhaRepetirEmail").removeClass("backgroundRed");
							}, 3000);
						}

				    },
				    error: function (data) {
				    	console.log("ERRO:");
				    	console.log(data);
						el.find(".esqueciaasenha .loading").hide();
						if (esqueciasenhaEsconderTime == null) {
							esqueciasenhaEsconderErro();
						}
						el.find(".esqueciaasenha .erro").html("Erro, tente mais tarde!");
						el.find(".esqueciaasenha .erro").fadeIn('fast');
				    },
				});
			}

			//////////////////////////////////////////
			//click na div/alert de erro de login
			el.find(".esqueciaasenha .erro").click(function() {
				el.find(".esqueciaasenha .erro").fadeOut('fast');
				el.find(".esqueciaasenha button").prop('disabled', false);
				esqueciasenhaEsconderErro();
			});

			//////////////////////////////////////////
			//focus e blur nos campos de RECUPERAR SENHA
			el.find(".esqueciasenhaEmail").focus(function() {
				var value = $(this).val();
				if (value == "EMAIL")
				{
					$(this).val('');
				}
			});

			el.find(".esqueciasenhaEmail").blur(function() {
				var value = $(this).val();
				if (value == "")
				{
					$(this).val('EMAIL');
				}
			});

			el.find(".esqueciasenhaRepetirEmail").focus(function() {
				var value = $(this).val();
				if (value == "REPETIR EMAIL")
				{
					$(this).val('');
				}
			});

			el.find(".esqueciasenhaRepetirEmail").blur(function() {
				var value = $(this).val();
				if (value == "")
				{
					$(this).val('REPETIR EMAIL');
				}
			});

		});

        return this;
    }


})(jQuery);