(function($) {

    $(document).ready(function(){

        if($(".page-esqueciasenha").length > 0 ) {
            var content = new pageUsers($(".page-esqueciasenha"));
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
					el.find(".esqueciasenha button").prop('disabled', false);
				}
				else {
					esqueciasenhaEsconderTime = setTimeout(function() {	
						el.find(".esqueciasenha .erro").fadeOut('fast'); 
						esqueciasenhaEsconderTime = null;
						el.find(".esqueciasenha button").prop('disabled', false);
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
				el.find(".esqueciasenha .erro").fadeOut('fast');
				esqueciasenhaEsconderTime = null;
				esqueciasenhaEsconderErro();
				el.find(".esqueciasenha button").prop('disabled', true);
				el.find(".esqueciasenha .loading").show();
			    $.ajax({
				    url: window.homepath + "ajax/indexRecuperarSenha.php",
				    method: 'POST',
				    dataType: 'json',
					data: { email: el.find(".esqueciasenhaEmail").val(), email2: el.find(".esqueciasenhaRepetirEmail").val() },
				    success: function (data) {
				    	console.log("indexRecuperarSenha");
				    	console.log(data);

						if (data.success == "true") {
							el.find(".esqueciasenha .erro").html("Email enviado com sua nova senha!");
							el.find(".esqueciasenha .erro").fadeIn('fast');
							el.find(".esqueciasenha .loading").hide();
							el.find(".esqueciasenhaEmail").addClass("backgroundBlue");
							el.find(".esqueciasenhaRepetirEmail").addClass("backgroundBlue");
							setTimeout(function() {
								el.find(".esqueciasenhaEmail").removeClass("backgroundBlue");
								el.find(".esqueciasenhaRepetirEmail").removeClass("backgroundBlue");
							}, 3000);

						} else {
							el.find(".esqueciasenha .loading").hide();
							el.find(".esqueciasenha .erro").html(data.message);
							el.find(".esqueciasenha .erro").fadeIn('fast');
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
						el.find(".esqueciasenha .loading").hide();
						if (esqueciasenhaEsconderTime == null) {
							esqueciasenhaEsconderErro();
						}
						el.find(".esqueciasenha .erro").html("Erro, tente mais tarde!");
						el.find(".esqueciasenha .erro").fadeIn('fast');
				    },
				});
			}

			//////////////////////////////////////////
			//click na div/alert de erro de login
			el.find(".esqueciasenha .erro").click(function() {
				el.find(".esqueciasenha .erro").fadeOut('fast');
				el.find(".esqueciasenha button").prop('disabled', false);
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