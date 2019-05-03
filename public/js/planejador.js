//////////////////////////////////////////////
//INICIO DO SCRIPT
(function($) {

    $(document).ready(function(){

        if($("#planejador").length > 0 ) {
            var content = new pageUsers($("#planejador"));
        }

    });


    var pageUsers =  function(el) {

        $(document).ready(function() {

            moment.locale('pt-BR');

            //setando os campos que usam o calendário
            el.find('.saidaVencimentoParcela, .entradaVencimentoParcela, .objetivoData').datepicker({
                language: 'pt-BR',
                minDate: new Date() // Now can select only dates, which goes after today
            });


            //login
            var token = localStorage.getItem('token');
            var userData = getObject('userData');
            if(token && userData){
                localStorage.setItem('token',token);
                window.token = token;
                setObject('userData',userData);
                window.userData = userData;
            }else{
                window.location = window.homepath;
            }

            //////////////////////////////////////////////
            //variaveis carregadas na inicialização
            var carregou = 0;
            var carregouTotal = 6;
            window.ordemObjetivos = "created_at-desc";
            window.pageObjetivos = "1";
            window.itemsPageObjetivos = "8";
            window.ordemEntradaESaida = "created_at-desc";
            window.pageEntradaESaida = "1";
            window.itemsPageEntradaESaida = "10";
            window.firstTimestamp = "82800";
            window.lastTimestamp = "32472144000";
            var meses = new Array("", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro");
            var controle_carregamento = false;

            //////////////////////////////////////////////
            //função que tira o site do status carregando
            /*
                1 - calendario(new Date().getMonth()+1, new Date().getFullYear()); //lerEntradaESaida chamada dentro da função
                2 - lerPerfil();
                3 - lerSalario();
                4 - lerPoupanca();
                5 - lerTotaisEntradaESaida();
                6 - lerObjetivos();
                7 - lerUltimas();
            */
            function carregando(listagem, item_atual) {
                /*if (listagem >= carregouTotal && controle_carregamento == false) {
                    if (el.find('.tela').hasClass("carregando")) {
                        //limpaConsole();
                    }*/
                    el.find('.tela').removeClass('carregando');/*
                    console.log("###########################################");
                    console.log("Planejador Financeiro Iniciado");
                    console.log("###########################################");
                    console.log("");
                    controle_carregamento = true;
                    //console.log = function() {};
                } else {
                    console.log("#### Carregando Item: " + item_atual + " ####");
                }*/
            }

            //////////////////////////////////////////////
            //função inicial de carregamento
            function carregamento() {
                if ($("html").hasClass("smartphone") || $("html").hasClass("tablet")) {
                    naoDisponivel(); //barra entrada em smartphone ou tablet
                } else {
                    //////////////////////////////////////////////
                    //funções carregadas na inicialização
                    carregando(carregou);
                    tooltip();
                    calendario(new Date().getMonth()+1, new Date().getFullYear()); //lerEntradaESaida e lerUltimas chamada dentro da função calendario
                    lerPerfil();
                    //lerSalario();
                    //lerPoupanca();
                    lerTotaisEntradaESaida();
                    lerObjetivos(window.pageObjetivos, window.ordemObjetivos);
                    
                    el.find(".tela").removeClass('desabilitado');
                }
            }

            //////////////////////////////////////////////
            //função do calendario
            function calendario(month, year) {
                if (month != "0" && year != "0") {
                    el.find('.mes').attr("data-mes", month);
                    el.find('.mes').attr("data-ano", year);
                    var mes = el.find('.mes').attr("data-mes");
                    var ano = el.find('.mes').attr("data-ano");
                    if (mes >= 1 && mes <= 12) {
                        el.find('.mes').html(meses[mes] + " / " + ano);
                        el.find('.mes').attr("data-mes-extenso", meses[mes]);
                    }
                    var date = new Date(ano, mes, 0);
                    var d = date.getDate();
                    window.firstTimestamp = moment(ano + '/' + mes + '/' + '01').format("X");
                    window.lastTimestamp = moment(ano + '/' + mes + '/' + d).format("X");
                    window.pageEntradaESaida = "1";
                    lerEntradaESaida(window.pageEntradaESaida, window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
                    lerUltimas();
                } else {
                    el.find('.mes').attr("data-mes", new Date().getMonth()+1);
                    el.find('.mes').attr("data-ano", new Date().getFullYear());
                    var mes = el.find('.mes').attr("data-mes");
                    var ano = el.find('.mes').attr("data-ano");
                    el.find('.mes').html("Todos as datas");
                    el.find('.mes').attr("data-mes-extenso", "Todos");

                    var date = new Date(ano, mes, 0);
                    var d = date.getDate();
                    window.firstTimestamp = "86400";
                    window.lastTimestamp = "4070908800";
                    window.pageEntradaESaida = "1";
                    lerEntradaESaida(window.pageEntradaESaida, window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
                    lerUltimas();
                }
            }

            //////////////////////////////////////////////
            //click na setinha pra diminuir um mes
            $(document).on('click', '.setaMesEsquerda', function(e){
                if (el.find('.mes').attr("data-mes-extenso") == "Todos") {
                    calendario(new Date().getMonth()+1, new Date().getFullYear());
                } else if (el.find('.mes').attr("data-mes") > 1) {
                    calendario(Number(el.find('.mes').attr("data-mes"))-Number(1));
                } else if (el.find('.mes').attr("data-mes") <= 1) {
                    calendario("12", Number(el.find('.mes').attr("data-ano"))-Number(1));
                }
            });

            //////////////////////////////////////////////
            //click na setinha pra aumentar um mes
            $(document).on('click', '.setaMesDireita', function(e){
                if (el.find('.mes').attr("data-mes-extenso") == "Todos") {
                    calendario(new Date().getMonth()+1, new Date().getFullYear());
                } else if (el.find('.mes').attr("data-mes") < 12) {
                    calendario(Number(el.find('.mes').attr("data-mes"))+Number(1));
                } else if (el.find('.mes').attr("data-mes") >= 12) {
                    calendario("1", Number(el.find('.mes').attr("data-ano"))+Number(1));
                }
            });

            //////////////////////////////////////////////
            //click no botão para mostrar todos os meses e anos
            $(document).on('click', '.mostrarTodos', function(e){
                calendario("0", "0");
            });

            //////////////////////////////////////////////
            //click no botão para mostrar a data atual
            $(document).on('click', '.data', function(e){
                calendario(new Date().getMonth()+1, new Date().getFullYear());
            });

            //////////////////////////////////////////////
            //função que barra entrada em smartphone ou tablet
            function naoDisponivel() {
                limpaConsole();
                console.log("###########################################");
                console.log("Barrada entrada de tablet ou smartphone!!!");
                console.log("###########################################");
                console.log(" ");
                console.log = function() {};

                el.addClass('desabilitado');
                var except = el.find('.naodisponivel');
                el.empty().append(except);
            }

            //////////////////////////////////////////////
            //função de ERRO NO SISTEMA (erro nos ajaxs)
            function erroNoSistema(data) {
                //limpaConsole();
                console.log("###########################################");
                console.log("Erro no sistema!");
                console.log("###########################################");
                console.log(" ");

                if (data) {
                    console.log(data);
                }

                //console.log = function() {};

                el.addClass('erroNoSistemaOn');
                var except = el.find('.erroNoSistema');
                el.empty().append(except);
            }

            //////////////////////////////////////////////
            //função de limpeza do CONSOLE do browser
            function limpaConsole() {
                console.API;
                if (typeof console._commandLineAPI !== 'undefined') {
                    console.API = console._commandLineAPI; //chrome
                } else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
                    console.API = console._inspectorCommandLineAPI; //Safari
                } else if (typeof console.clear !== 'undefined') {
                    console.API = console;
                }
                console.API.clear();
            }

            //////////////////////////////////////////////
            //chamada da função inicial de carregamento
            $(document).ready(function() {
                carregamento();
            });

            $(window).on('resize', function(){
                location.reload();
            });

            //////////////////////////////////////////////
            //tooltip
            function tooltip() {

                var fechar = 1;

                $(document).on('mouseover', '.tooltip', function(e){

                    if (fechar == 1) {
                        el.append('<div class="tooltips"></div>');

                        el.find(".tooltips").html($(this).attr("data-title"));


                        var width = el.find('.tooltips').width();
                        var offset = $(this).offset();
                        var container = $(this).width();

                        el.find(".tooltips").show();
                        if (offset.top - 45 >= 1) {
                            el.find(".tooltips").css({
                                top: offset.top - 45, 
                            });
                        } else {
                            el.find(".tooltips").css({
                                top: offset.top + 15, 
                            });
                        }

                        if (offset.left + width >= $(window).width()) {
                            el.find(".tooltips").css({
                                left: offset.left - (width - container) /2 - 20,
                            });
                        } else {
                            el.find(".tooltips").css({
                                left: offset.left - (width - container) /2 - 12,
                            });
                        }
                    }

                });

                $(document).on('mouseout', '.tooltip', function(e){
                    $(this).attr("data-title", el.find(".tooltips").html());

                    el.find(".tooltips").hide();
                    el.find(".tooltips").remove();
                });

                $(document).on('dblclick', '.tooltip', function(e){
                    if ($(this)["0"].className == "dadosData tooltip") {
                        fechar = 0;
                        setTimeout(function() {
                            fechar = 1;
                        }, 300);
                        el.find(".tooltips").hide();
                        el.find(".tooltips").remove();
                    }
                });

            }

            //////////////////////////////////////////////
            //tooltip alert
            function tooltipalert(element, erro) {

                el.find(".tooltip").trigger('mouseout');

                el.append('<div class="tooltips-alertDiv"><div class="tooltips-alert-seta-esquerda"></div><div class="tooltips-alert"></div></div>');
                el.find(".tooltips-alert").html(erro);
                var offset = element.offset();

                el.find(".tooltips-alertDiv").fadeIn( "fast" );
                el.find(".tooltips-alertDiv").css({
                    top: offset.top - 3,
                    left: 307
                });

                el.addClass('travado');
                setTimeout(function() {
                    el.find(".tooltips-alertDiv").fadeOut( "slow" );
                    el.find(".tooltips-alertDiv").remove();
                    el.removeClass('travado');
                }, 3000);

            }

            //////////////////////////////////////////////
            //tooltip alert top
            function tooltipalertTop(element, erro) {

                el.find(".tooltip").trigger('mouseout');

                el.append('<div class="tooltips-alertTopDiv"><div class="tooltips-alert-seta-baixo"></div><div class="tooltips-alert-top"></div></div>');
                el.find(".tooltips-alert-top").html(erro);

                var width = el.find('.tooltips-alertTopDiv').width();
                var offset = element.offset();
                var container = element.width();

                el.find(".tooltips-alertTopDiv").fadeIn( "fast" );
                el.find(".tooltips-alertTopDiv").css({
                    top: offset.top - 55,
                    left: offset.left - (width - container) /2 - 12,
                });

                el.addClass('travado');
                setTimeout(function() {
                    el.find(".tooltips-alertTopDiv").fadeOut( "slow" );
                    el.find(".tooltips-alertTopDiv").remove();
                    el.removeClass('travado');
                }, 3000);

            }

            //fazer logout
            $(document).on("click", ".sair",function(e){
                logout();
            });           

            //função de logout
            function logout() {
                $.ajax({
                    url: window.homepath + "logout",
                    method: 'POST',
                    dataType: 'json',
                    data: {},
                    beforeSend: function (data) {
                        data.setRequestHeader("Authorization", window.token);
                    },
                    success: function (data) {
                        console.log("---------------------------------");
                        console.log("logout");
                        console.log(data);

                        if (data.success == true){
                            window.location = window.homepath;
                        } else {
                            erroNoSistema(data);
                        }

                    },
                    error: function (data, status, error) {
                        console.log("---------------------------------");
                        console.log("logout");
                        console.log("ERRO:");
                        console.log(data, status, error);
                        erroNoSistema(data);
                    },
                });
            }


            //////////////////////////////////////////////
            //eventos pra chamar funções de ação

            //cadastra objetivo
            $(document).on("click", ".objetivoAdd",function(e){
                cadastroObjetivo(e);
            });

            //cadastra entrada
            $(document).on("click", ".entradaAdd",function(e){
                cadastroEntrada(e);
            });
            
            //cadastra saida
            $(document).on("click", ".saidaAdd",function(e){
                cadastroSaida(e);
            });


            //////////////////////////////////////////////
            //CALCULADORA

            //apertar 1 na calculadora
            $(document).on("click", ".calculadoraOne",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length >= 100 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    var count = value.split(",");
                    if (count[1].length >= 2 && !el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                }
                if (value.length == 1 && value == 0) {
                    el.find(".calculadoraInput").val("1");
                    e.preventDefault();
                    return false;
                }
                if (el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val("");
                    el.find(".calculadoraInput").val("1");
                    el.find(".calculadoraInput").focus();
                    el.find(".calculadoraInput").removeClass("zerar");
                    e.preventDefault();
                    return false;
                }

                el.find(".calculadoraInput").val(value + "1");
                el.find(".calculadoraInput").focus();
            });

            //apertar 2 na calculadora
            $(document).on("click", ".calculadoraTwo",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length >= 10 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    var count = value.split(",");
                    if (count[1].length >= 2 && !el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                }
                if (value.length == 1 && value == 0) {
                    el.find(".calculadoraInput").val("2");
                    e.preventDefault();
                    return false;
                }
                if (el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val("");
                    el.find(".calculadoraInput").val("2");
                    el.find(".calculadoraInput").focus();
                    el.find(".calculadoraInput").removeClass("zerar");
                    e.preventDefault();
                    return false;
                }

                el.find(".calculadoraInput").val(value + "2");
                el.find(".calculadoraInput").focus();
            });

            //apertar 3 na calculadora
            $(document).on("click", ".calculadoraThree",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length >= 10 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    var count = value.split(",");
                    if (count[1].length >= 2 && !el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                }
                if (value.length == 1 && value == 0) {
                    el.find(".calculadoraInput").val("3");
                    e.preventDefault();
                    return false;
                }
                if (el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val("");
                    el.find(".calculadoraInput").val("3");
                    el.find(".calculadoraInput").focus();
                    el.find(".calculadoraInput").removeClass("zerar");
                    e.preventDefault();
                    return false;
                }

                el.find(".calculadoraInput").val(value + "3");
                el.find(".calculadoraInput").focus();
            });

            //apertar 4 na calculadora
            $(document).on("click", ".calculadoraFour",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length >= 10 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    var count = value.split(",");
                    if (count[1].length >= 2 && !el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                }
                if (value.length == 1 && value == 0) {
                    el.find(".calculadoraInput").val("4");
                    e.preventDefault();
                    return false;
                }
                if (el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val("");
                    el.find(".calculadoraInput").val("4");
                    el.find(".calculadoraInput").focus();
                    el.find(".calculadoraInput").removeClass("zerar");
                    e.preventDefault();
                    return false;
                }

                el.find(".calculadoraInput").val(value + "4");
                el.find(".calculadoraInput").focus();
            });

            //apertar 5 na calculadora
            $(document).on("click", ".calculadoraFive",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length >= 10 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    var count = value.split(",");
                    if (count[1].length >= 2 && !el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                }
                if (value.length == 1 && value == 0) {
                    el.find(".calculadoraInput").val("5");
                    e.preventDefault();
                    return false;
                }
                if (el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val("");
                    el.find(".calculadoraInput").val("5");
                    el.find(".calculadoraInput").focus();
                    el.find(".calculadoraInput").removeClass("zerar");
                    e.preventDefault();
                    return false;
                }

                el.find(".calculadoraInput").val(value + "5");
                el.find(".calculadoraInput").focus();
            });

            //apertar 6 na calculadora
            $(document).on("click", ".calculadoraSix",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length >= 10 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    var count = value.split(",");
                    if (count[1].length >= 2 && !el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                }
                if (value.length == 1 && value == 0) {
                    el.find(".calculadoraInput").val("6");
                    e.preventDefault();
                    return false;
                }
                if (el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val("");
                    el.find(".calculadoraInput").val("6");
                    el.find(".calculadoraInput").focus();
                    el.find(".calculadoraInput").removeClass("zerar");
                    e.preventDefault();
                    return false;
                }

                el.find(".calculadoraInput").val(value + "6");
                el.find(".calculadoraInput").focus();
            });

            //apertar 7 na calculadora
            $(document).on("click", ".calculadoraSeven",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length >= 10 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    var count = value.split(",");
                    if (count[1].length >= 2 && !el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                }
                if (value.length == 1 && value == 0) {
                    el.find(".calculadoraInput").val("7");
                    e.preventDefault();
                    return false;
                }
                if (el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val("");
                    el.find(".calculadoraInput").val("7");
                    el.find(".calculadoraInput").focus();
                    el.find(".calculadoraInput").removeClass("zerar");
                    e.preventDefault();
                    return false;
                }

                el.find(".calculadoraInput").val(value + "7");
                el.find(".calculadoraInput").focus();
            });

            //apertar 8 na calculadora
            $(document).on("click", ".calculadoraEight",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length >= 10 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    var count = value.split(",");
                    if (count[1].length >= 2 && !el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                }
                if (value.length == 1 && value == 0) {
                    el.find(".calculadoraInput").val("8");
                    e.preventDefault();
                    return false;
                }
                if (el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val("");
                    el.find(".calculadoraInput").val("8");
                    el.find(".calculadoraInput").focus();
                    el.find(".calculadoraInput").removeClass("zerar");
                    e.preventDefault();
                    return false;
                }
                el.find(".calculadoraInput").val(value + "8");
                el.find(".calculadoraInput").focus();
            });

            //apertar 9 na calculadora
            $(document).on("click", ".calculadoraNine",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length >= 10 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    var count = value.split(",");
                    if (count[1].length >= 2 && !el.find(".calculadoraInput").hasClass("zerar") && !el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                }
                if (value.length == 1 && value == 0) {
                    el.find(".calculadoraInput").val("9");
                    e.preventDefault();
                    return false;
                }
                if (el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val("");
                    el.find(".calculadoraInput").val("9");
                    el.find(".calculadoraInput").focus();
                    el.find(".calculadoraInput").removeClass("zerar");
                    e.preventDefault();
                    return false;
                }

                el.find(".calculadoraInput").val(value + "9");
                el.find(".calculadoraInput").focus();
            });

            //apertar 0 na calculadora
            $(document).on("click", ".calculadoraZero",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length >= 10 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    var count = value.split(",");
                    if (count[1] == "0" && count[0] == "0") {
                        e.preventDefault();
                        return false;
                    } else if (count[1].length >= 2 && !el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                }
                if (el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val("");
                    el.find(".calculadoraInput").val("0");
                    el.find(".calculadoraInput").focus();
                    el.find(".calculadoraInput").removeClass("zerar");
                    e.preventDefault();
                    return false;
                }
                if (value.length == 1 && value == "0") {
                    el.find(".calculadoraInput").val("0");
                    el.find(".calculadoraInput").focus();
                } else {
                    el.find(".calculadoraInput").val(value + "0");
                    el.find(".calculadoraInput").focus();
                }
            });

            //apertar , (virgula) na calculadora
            $(document).on("click", ".calculadoraComma",function(e){
                var value = el.find(".calculadoraInput").val();
                if (value.length <= 0) {
                    e.preventDefault();
                    return false;
                }
                if (value.length >= 8 && !el.find(".calculadoraInput").hasClass("zerar")) {
                    e.preventDefault();
                    return false;
                }
                if (value.indexOf(",") !=-1) {
                    e.preventDefault();
                    return false;
                }
                el.find(".calculadoraInput").val(value + ",");
                el.find(".calculadoraInput").focus();
            });

            //apertar C (limpar) na calculadora
            $(document).on("click", ".calculadoraC",function(e){
                el.find(".calculadoraResultadosContainerSpan").html("");
                el.find(".calculadoraInput").removeClass("zerar");
                el.find(".calculadoraInput").val("0");
                el.find(".calculadoraInput").focus();
                window.calculadoraInput = 0;
                window.valueTotal = 0;
                window.operators = "";
                decre = 0;
            });

            //apertar Backspace (voltar) na calculadora
            $(document).on("click", ".calculadoraBackspace",function(e){
                if (!el.find(".calculadoraInput").hasClass("zerar")) {
                    el.find(".calculadoraInput").val(el.find(".calculadoraInput").val().substring(0,el.find(".calculadoraInput").val().length - 1));
                    el.find(".calculadoraInput").focus();
                }
            });

            //apertar C (limpar) na calculadora
            $(document).on("click", ".calculadoraNumeros, .calculadoraCanto", function(e){
                window.calculadoraInput = el.find(".calculadoraInput").val().replace(/,/g, '.');
                window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
            });

            //keyup para salvar variavel do q é digitado na calculadora
            $(document).on("keyup", ".calculadoraInput", function(e){
                window.calculadoraInput = el.find(".calculadoraInput").val().replace(/,/g, '.');
                if (e.keyCode == "187" || e.keyCode == "13"){
                    el.find(".calculadoraEqual").trigger('click');
                } else if (e.keyCode == "107"){
                    el.find(".calculadoraMore").trigger('click');
                    window.operators = "+";
                } else if (e.keyCode == "109"){
                    el.find(".calculadoraMinus").trigger('click');
                    window.operators = "-";
                } else if (e.keyCode == "106"){
                    el.find(".calculadoraMultiply").trigger('click');
                    window.operators = "*";
                } else if (e.keyCode == "111"){
                    el.find(".calculadoraDivide").trigger('click');
                    window.operators = "/";
                } else if (e.keyCode == "27"){
                    el.find(".calculadoraC").trigger('click');
                }
            });

            //variaveis de inicialização da calculadora
            window.calculadoraInput = 0;
            window.valueTotal = 0;
            window.operators = "";
            var decre = 0;

            //função comum entre os sinais da calculadora
            function calc(e, signal) {
                var value = el.find(".calculadoraInput").val();
                var count = el.find(".calculadoraInput").val().split(",");
                var container = el.find(".calculadoraResultadosContainerSpan").html();
                var semFim = el.find(".calculadoraResultadosContainerSpan").html().length;

                if (el.find(".calculadoraResultadosContainerSpan").html().slice(-2) == "+ " || el.find(".calculadoraResultadosContainerSpan").html().slice(-2) == "- " || el.find(".calculadoraResultadosContainerSpan").html().slice(-2) == "* " || el.find(".calculadoraResultadosContainerSpan").html().slice(-2) == "/ ") {
                    el.find(".calculadoraResultadosContainerSpan").html(el.find(".calculadoraResultadosContainerSpan").html().slice(0, semFim-2) + signal + " ");
                }
                if (value == 0 || value == "0,0" ||  value == "0," || value == "0,00" || el.find(".calculadoraInput").hasClass("zerar")) { //se estiver tudo zero cancela click
                    e.preventDefault();
                    return false;
                }
                if (count["1"] && count["1"].length == 1) {//adicionar 1 zero no final se faltar um numero apos a virgula
                    value = value + "0";
                }
                if (!count["1"] && value.indexOf(",") !=-1) {//adicionar 2 zeros no final se faltar dois numero apos a virgula
                    value = value.substring(0, value.length-1);
                }
                if (semFim == 0) {
                    if (decre == 0) {
                        el.find(".calculadoraResultadosContainerSpan").html("<span class='dec"+decre+"'>" + value +"</span> "+ window.operators +" ");
                    } else {
                        el.find(".calculadoraResultadosContainerSpan").html("<span class='dec"+decre+" tooltip' data-title=''>" + value +"</span> "+ window.operators +" ");
                    }
                    el.find(".calculadoraInput").val(value);
                    el.find(".calculadoraInput").addClass("zerar");
                } else {
                    container = container.replace(/,/g, '.');

                    el.find(".calculadoraResultadosContainerSpan").html(container + "<span class='dec"+decre+" tooltip' data-title='Total: "+input+"'>" + value +"</span>");
                    el.find(".calculadoraInput").val(eval(Number(window.valueTotal) + window.operators + Number(window.calculadoraInput)));
                    var input = el.find(".calculadoraInput").val();
                    if (input.indexOf(".") !=-1) {
                        input = Number(input).toFixed(2);
                        input = input.replace(/\./g, ',');
                    }

                    container = container.replace(/\./g, ',');
                    el.find(".calculadoraInput").val(input);
                    if (decre == 0) {
                        el.find(".calculadoraResultadosContainerSpan").html(container + "<span class='dec"+decre+"'>" + value +"</span> " + signal +" ");
                    } else {
                        el.find(".calculadoraResultadosContainerSpan").html(container + "<span class='dec"+decre+" tooltip' data-title='Total: "+input+"'>" + value +"</span> " + signal +" ");
                    }
                    el.find(".calculadoraInput").addClass("zerar");
                }
                if (el.find(".calculadoraInput").val().length > 10) {
                    el.addClass("travado");
                    el.find(".calculadoraInput").addClass("backgroundRed");
                    el.find(".calculadoraResultadosContainerSpan").html("Numeros demais!");
                    el.find(".calculadoraInput").val("0");
                    setTimeout(function() {
                        el.removeClass("travado");
                        el.find(".calculadoraInput").removeClass("backgroundRed");
                        el.find(".calculadoraResultadosContainerSpan").html("");
                        el.find(".calculadoraC").click();
                    }, 5000);
                }


                window.valueTotal = el.find(".calculadoraInput").val().replace(/,/g, '.');
                window.operators = "";
                decre = decre+1;

            }

            //apertar = (igual) na calculadora
            $(document).on("click", ".calculadoraEqual",function(e){
                var countOperators = countOcurrences(el.find(".calculadoraResultadosContainerSpan").text());
                if (countOperators >= 1) {
                    if (el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2] != window.operators) {
                        window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                    }
                    calc(e, window.operators);
                }
            });

            //apertar + (mais) na calculadora
            $(document).on("click", ".calculadoraMore",function(e){
                if (el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2] != "+") {
                    if (el.find(".calculadoraResultadosContainerSpan").text().length >= 1) {
                        window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                    }
                }
                if (countOcurrences(el.find(".calculadoraResultadosContainerSpan").text()) >= 1) {
                    if (window.operators != el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2]) {
                        window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                    }
                } else {
                    window.operators = "+";
                }
                if (el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2] != "+" && el.find(".calculadoraInput").hasClass("zerar") == true) {
                    window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                }
                calc(e, "+");
            });

            //apertar - (menos) na calculadora
            $(document).on("click", ".calculadoraMinus",function(e){
                if (el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2] != "-") {
                    if (el.find(".calculadoraResultadosContainerSpan").text().length >= 1) {
                        window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                    }
                }
                if (countOcurrences(el.find(".calculadoraResultadosContainerSpan").text()) >= 1) {
                    if (window.operators != el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2]) {
                        window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                    }
                } else {
                    window.operators = "-";
                }
                if (el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2] != "-" && el.find(".calculadoraInput").hasClass("zerar") == true) {
                    window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                }
                calc(e, "-");
            });

            //apertar x (multiplicar) na calculadora
            $(document).on("click", ".calculadoraMultiply",function(e){
                if (el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2] != "*") {
                    if (el.find(".calculadoraResultadosContainerSpan").text().length >= 1) {
                        window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                    }
                }
                if (countOcurrences(el.find(".calculadoraResultadosContainerSpan").text()) >= 1) {
                    if (window.operators != el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2]) {
                        window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                    }
                } else {
                    window.operators = "*";
                }
                if (el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2] != "*" && el.find(".calculadoraInput").hasClass("zerar") == true) {
                    window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                }
                calc(e, "*");
            });

            //apertar ÷ (dividir) na calculadora
            $(document).on("click", ".calculadoraDivide",function(e){
                if (el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2] != "/") {
                    if (el.find(".calculadoraResultadosContainerSpan").text().length >= 1) {
                        window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                    }
                }
                if (countOcurrences(el.find(".calculadoraResultadosContainerSpan").text()) >= 1) {
                    if (window.operators != el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2]) {
                        window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                    }
                } else {
                    window.operators = "/";
                }
                if (el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2] != "/" && el.find(".calculadoraInput").hasClass("zerar") == true) {
                    window.operators = el.find(".calculadoraResultadosContainerSpan").text().split(" ")[el.find(".calculadoraResultadosContainerSpan").text().split(" ").length-2];
                }
                calc(e, "/");
            });

            //apertar % (porcentagem) na calculadora
            $(document).on("click", ".calculadoraPercent",function(e){
                var countOperators = countOcurrences(el.find(".calculadoraResultadosContainerSpan").html());
                var value = el.find(".calculadoraInput").val();
                var count = el.find(".calculadoraInput").val().split(",");
                var container = el.find(".calculadoraResultadosContainerSpan").html();
                var semFim = el.find(".calculadoraResultadosContainerSpan").html().length;

                if (countOperators >= 1) {
                    if (window.valueTotal == 0) {
                        window.valueTotal = el.find(".calculadoraInput").val().replace(/,/g, '.');
                    }                   
                    if (value == 0 || value == "0,0" ||  value == "0," || value == "0,00" || el.find(".calculadoraInput").hasClass("zerar")) { //se estiver tudo zero cancela click
                        e.preventDefault();
                        return false;
                    }
                    if (count["1"] && count["1"].length == 1) {//adicionar 1 zero no final se faltar um numero apos a virgula
                        value = value + "0";
                    }
                    if (!count["1"] && value.indexOf(",") !=-1) {//adicionar 2 zeros no final se faltar dois numero apos a virgula
                        value = value + "00";
                    }
                    if (semFim == 0) {
                        if (decre == 0) {
                            el.find(".calculadoraResultadosContainerSpan").html("<span class='dec"+decre+"'>" + value +"</span> "+ window.operators +" ");
                        } else {
                            el.find(".calculadoraResultadosContainerSpan").html("<span class='dec"+decre+" tooltip' data-title=''>" + value +"</span> "+ window.operators +" ");
                        }
                        el.find(".calculadoraInput").val(value);
                        el.find(".calculadoraInput").addClass("zerar");
                    } else {
                        container = container.replace(/,/g, '.');
                        if (window.operators == "+") {
                            var total_ = eval((Number(window.valueTotal) * Number(window.calculadoraInput)) / 100);
                            el.find(".calculadoraInput").val(eval(Number(window.valueTotal) + Number(total_)));
                        } else if  (window.operators == "-") {
                            var total_ = eval((Number(window.valueTotal) * Number(window.calculadoraInput)) / 100);
                            el.find(".calculadoraInput").val(eval(Number(window.valueTotal) - Number(total_)));
                        } else if (window.operators == "*") {
                            var total_ = eval((Number(window.valueTotal) * Number(window.calculadoraInput)) / 100);
                            el.find(".calculadoraInput").val(eval(Number(window.valueTotal) * Number(total_)));
                        } else if (window.operators == "/") {
                            var total_ = eval((Number(window.valueTotal) * Number(window.calculadoraInput)) / 100);
                            el.find(".calculadoraInput").val(eval(Number(window.valueTotal) / Number(total_)));
                        }
                        var input = el.find(".calculadoraInput").val();
                        if (input.indexOf(".") !=-1) {
                            input = Number(input).toFixed(2);
                            input = input.replace(/\./g, ',');
                        }

                        var subPorcentagem = Number(total_);
                        if (el.find(".calculadoraInput").val().indexOf(".") !=-1) {
                            var subPorcentagem = subPorcentagem.toFixed(2);
                            var subPorcentagem = subPorcentagem.replace(/\./g, ',');
                        }
                        var total_ = el.find(".calculadoraInput").val();
                        total_ = Number(total_).toFixed(2);
                        total_ = total_.replace(/\./g, ',');
                        container = container.replace(/\./g, ',');
                        el.find(".calculadoraInput").val(input);

                        window.calculadoraInput = window.calculadoraInput.replace(/\./g, ',');
                        if (window.calculadoraInput.substring(window.calculadoraInput.length, window.calculadoraInput.length-1) == ",") {
                            window.calculadoraInput = window.calculadoraInput.substring(0, window.calculadoraInput.length-1);
                        } else if (window.calculadoraInput.substring(window.calculadoraInput.length - 2, window.calculadoraInput.length-1) == ",") {
                            window.calculadoraInput = window.calculadoraInput + "0";
                        }

                        if (decre == 0) {
                            el.find(".calculadoraResultadosContainerSpan").html(container + "<span class='dec"+decre+"'>"+subPorcentagem+" (" +window.calculadoraInput +" %) </span>" + window.operators +" ");
                        } else {
                            el.find(".calculadoraResultadosContainerSpan").html(container + "<span class='dec"+decre+" tooltip' data-title='Total: "+input+"'>"+subPorcentagem+" (" +window.calculadoraInput +" %) </span>" + window.operators +" ");
                        }
                        el.find(".calculadoraInput").addClass("zerar");
                    }

                    if (el.find(".calculadoraInput").val().length > 10) {
                        el.addClass("travado");
                        el.find(".calculadoraInput").addClass("backgroundRed");
                        el.find(".calculadoraResultadosContainerSpan").html("Numeros demais!");
                        el.find(".calculadoraInput").val("0");
                        setTimeout(function() {
                            el.removeClass("travado");
                            el.find(".calculadoraInput").removeClass("backgroundRed");
                            el.find(".calculadoraResultadosContainerSpan").html("");
                            el.find(".calculadoraC").click();
                        }, 5000);
                    }

                    window.calculadoraInput = window.calculadoraInput.replace(/\,/g, '.');
                    window.valueTotal = el.find(".calculadoraInput").val().replace(/,/g, '.');
                    window.operators = "";
                    decre = decre+1;

                }
            });

            //função para pegar ultimo numero da calculadora
            function countOcurrences(str) {
                var regExp = new RegExp(/[()+\-*/.]/gi);
                return (str.match(regExp) || []).length;
            }

            //focus no input de numeros quando clicar em qualquer botao da calculadora
            $(document).on("click", ".calculadoraNumeros, .calculadoraCanto",function(e){
                el.find(".calculadoraResultadosContainerSpan").animate({scrollLeft: el.find(".calculadoraResultadosContainerSpan")[0].scrollWidth}, 500);
            });


            //digitar na calculadora
            $(document).on("keydown", '.calculadoraInput', function (e) {
                var number = $(this).val();
                var count = $(this).val().split(",");
                var code = e.keyCode;
                console.log("keydown:" + e.keyCode + "  caractere:" + String.fromCharCode(code));
                //48 ao 57 - numeros de 0 a 9 (keypress e keydown)
                //96 a 105 - numero 0 a 9 no numpad (só keydown)
                //8 - backspace (só keydown)
                //188 e 110 - virgula (só keydown)
                //44 - virgula (só keypress)
                if (e.keyCode == "110" || e.keyCode == "188" || e.keyCode == "8" || e.keyCode == "48" || e.keyCode == "49" || e.keyCode == "50" || e.keyCode == "51" || e.keyCode == "52" || e.keyCode == "53" || e.keyCode == "54" || e.keyCode == "55" || e.keyCode == "56" || e.keyCode == "57" || e.keyCode == "96" || e.keyCode == "97" || e.keyCode == "98" || e.keyCode == "99" || e.keyCode == "100" || e.keyCode == "101" || e.keyCode == "102" || e.keyCode == "103" || e.keyCode == "104" || e.keyCode == "105") {
                    if (number.length >= 8 && !el.find(".calculadoraInput").hasClass("zerar") && e.keyCode == "110") { //VIRGULA(188) //se tiver 7 numeros ou mais na calculadora ele não aceita a virgula
                        e.preventDefault();
                        return false;
                    }
                    if (e.keyCode == "8" && el.find(".calculadoraInput").hasClass("zerar")) {
                        e.preventDefault();
                        return false;
                    }
                    if (number.length >= 8 && !el.find(".calculadoraInput").hasClass("zerar") && e.keyCode == "188") { //VIRGULA(188) //se tiver 7 numeros ou mais na calculadora ele não aceita a virgula
                        e.preventDefault();
                        return false;
                    }
                    if (number.indexOf(",") !=-1) {
                        if (count["1"].length >= 2 && e.keyCode != "8") { //BACKSPACE(8) //se tiver 2 numeros depois da virgula e digitar algo diferente de backspace ele cancela a key
                            e.preventDefault();
                            return false;
                        }
                    }
                    if (number.indexOf(",") !=-1 && e.keyCode == "8" && count["1"].length == 1) {//BACKSPACE(8) //se o proximo caractere tiver uma virgula na sequencia e apertar o backspace ele apaga a virgula junto
                        el.find(".calculadoraInput").val(count["0"]);
                        e.preventDefault();
                        return false;
                    }
                    if (el.find(".calculadoraInput").hasClass("zerar") && e.keyCode != "8" && e.keyCode != "188" && e.keyCode != "110") {//zerar se classe zerar tiver ativa
                        el.find(".calculadoraInput").val("");
                        el.find(".calculadoraInput").focus();
                    }
                } else {
                    e.preventDefault();
                    return false;
                }
                el.find(".calculadoraInput").focus();
            });

            //digitar na calculadora
            $(document).on("keyup", '.calculadoraInput', function (e) {
                console.log("keyup:" + e.keyCode + "  caractere:" + String.fromCharCode(code));
                //48 ao 57 - numeros de 0 a 9 (keypress e keydown)
                //96 a 105 - numero 0 a 9 no numpad (só keydown)
                //8 - backspace (só keydown)
                //188 e 110 - virgula (só keydown)
                //44 - virgula (só keypress)
                if (e.keyCode == "110" || e.keyCode == "188" || e.keyCode == "8" || e.keyCode == "48" || e.keyCode == "49" || e.keyCode == "50" || e.keyCode == "51" || e.keyCode == "52" || e.keyCode == "53" || e.keyCode == "54" || e.keyCode == "55" || e.keyCode == "56" || e.keyCode == "57" || e.keyCode == "96" || e.keyCode == "97" || e.keyCode == "98" || e.keyCode == "99" || e.keyCode == "100" || e.keyCode == "101" || e.keyCode == "102" || e.keyCode == "103" || e.keyCode == "104" || e.keyCode == "105") {
                    if (e.keyCode == "96"){
                        var code = 0;
                    } else if (e.keyCode == "97"){
                        var code = 1;
                    } else if (e.keyCode == "98"){
                        var code = 2;
                    } else if (e.keyCode == "99"){
                        var code = 3;
                    } else if (e.keyCode == "100"){
                        var code = 4;
                    } else if (e.keyCode == "101"){
                        var code = 5;
                    } else if (e.keyCode == "102"){
                        var code = 6;
                    } else if (e.keyCode == "103"){
                        var code = 7;
                    } else if (e.keyCode == "104"){
                        var code = 8;
                    } else if (e.keyCode == "105"){
                        var code = 9;
                    }
                    if (el.find(".calculadoraInput").hasClass("zerar") && e.keyCode != "8" && e.keyCode != "188" && e.keyCode != "110") {//zerar se classe zerar tiver ativa
                        el.find(".calculadoraInput").val("");
                        el.find(".calculadoraInput").val(code);
                        el.find(".calculadoraInput").focus();
                        el.find(".calculadoraInput").removeClass("zerar");
                    }
                    if (el.find(".calculadoraInput").val().length >= 10) {
                        e.preventDefault();
                        return false;
                    }
                } 
            });

            //digitar na calculadora
            $(document).on("keypress", '.calculadoraInput', function (e) {
                var number = $(this).val();
                var count = $(this).val().split(",");
                var code = e.keyCode;
                console.log("keypress:" + e.keyCode + "  caractere:" + String.fromCharCode(code));
                //48 ao 57 - numeros de 0 a 9 (keypress e keydown)
                //96 a 105 - numero 0 a 9 no numpad (só keydown)
                //8 - backspace (só keydown)
                //188 e 110 - virgula (só keydown)
                //44 - virgula (só keypress)
                if (e.keyCode == "44" || e.keyCode == "48" || e.keyCode == "49" || e.keyCode == "50" || e.keyCode == "51" || e.keyCode == "52" || e.keyCode == "53" || e.keyCode == "54" || e.keyCode == "55" || e.keyCode == "56" || e.keyCode == "57") {
                    if (number.indexOf(",") !=-1 && e.keyCode == "44") {//VIRGULA(44) //se digitar virgula e se já tiver uma virgula ele cancela a key
                        e.preventDefault();
                        return false;
                    }
                    if (number.length == 0 && e.keyCode == "44") {//VIRGULA(44) //se digitar virgula e não tiver nada ele cancela a key
                        e.preventDefault();
                        return false;
                    }
                    if (number.length == 1 && number == 0 && e.keyCode != "44") {//VIRGULA(44) //se digitar qualquer numero e o zero for o primeiro ele apaga o zero e adiciona o novo numero, se for virgula ele mantam o zero e adiciona a virgula
                        el.find(".calculadoraInput").val("");
                        el.find(".calculadoraInput").val(String.fromCharCode(code));
                        e.preventDefault();
                        return false;
                    }
                    if (count["0"] == 0 && count["1"] == 0 && count["1"].length >= 1 && e.keyCode == "48") {//ZERO(48) //se o primeiro numero depois da virgula for zero e digitar zero ele cancela a key
                        e.preventDefault();
                        return false;
                    }
                } else {
                    e.preventDefault();
                    return false;
                }
                el.find(".calculadoraInput").focus();
            });

            //////////////////////////////////////////////
            //eventos nos inputs gerais
            el.find(".entradaTipoValor").focus(function() {
                var value = $(this).val();
                if (value == "Tipo de Valor")
                {
                    $(this).val("");
                }
            });

            el.find(".entradaTipoValor").blur(function() {
                var value = $(this).val();
                if (value == "")
                {
                    $(this).val("Tipo de Valor");
                }
            });

            el.find(".entradaParcelas").focus(function() {
                var value = $(this).val();
                //$(this).prop("type", "number");
                if (value == "Parcelas")
                {
                    $(this).val("");
                }
            });

            el.find(".entradaVencimentoParcela").blur(function() {
                var value = $(this).val();
                //$(this).prop("type", "text");
                if (value == "")
                {
                    $(this).val("Vencimento da 1ª Parcela");
                }
            });

            el.find(".entradaVencimentoParcela").focus(function() {
                var value = $(this).val();
                if (value == "Vencimento da 1ª Parcela")
                {
                    $(this).val("");
                }
            });

            el.find(".entradaParcelas").blur(function() {
                var value = $(this).val();
                //$(this).prop("type", "text");
                if (value == "")
                {
                    $(this).val("Parcelas");
                    el.find(".entradaValorParcela").prop('disabled', true);
                    el.find(".entradaValor").prop('disabled', false);
                } else if (value <= 0) {
                    $(this).val("Parcelas");
                    el.find(".entradaValorParcela").prop('disabled', true);
                    el.find(".entradaValor").prop('disabled', false);
                }
            });

            el.find(".entradaParcelas").keyup(function(e) {
                if (el.find(".entradaParcelas").val() > 1) {
                    el.find(".entradaValorParcela").prop('disabled', false);
                    el.find(".entradaVencimentoParcela").prop('disabled', false);
                    el.find(".entradaHoje").removeClass('disabled');
                    el.find(".entrada30Dias").removeClass('disabled');
                    el.find(".entradaValor").prop('disabled', true);
                    el.find(".entradaValor").val("Valor Total");
                } else {
                    el.find(".entradaValorParcela").prop('disabled', true);
                    el.find(".entradaVencimentoParcela").prop('disabled', true);
                    el.find(".entradaHoje").addClass('disabled');
                    el.find(".entrada30Dias").addClass('disabled');
                    el.find(".entradaValor").prop('disabled', false);
                    el.find(".entradaValorParcela").val("Valor das Parcelas");
                    el.find(".entradaVencimentoParcela").val("Vencimento da 1ª Parcela");
                }
            });

            el.find(".entradaParcelas").keypress(function(e) {
                if (e.keyCode == "48" || e.keyCode == "49" || e.keyCode == "50" || e.keyCode == "51" || e.keyCode == "52" || e.keyCode == "53" || e.keyCode == "54" || e.keyCode == "55" || e.keyCode == "56" || e.keyCode == "57") {
                } else {
                    e.preventDefault();
                    return false;
                }
            }); 

            el.find(".entradaValorParcela").focus(function() {
                el.find('.entradaValorParcela').priceFormat({
                    prefix: 'R$ ',
                    centsSeparator: ',',
                    thousandsSeparator: '.'
                });
                var value = $(this).val();
                if (value == "Valor das Parcelas")
                {
                    $(this).val("");
                }
            });

            el.find(".entradaValorParcela").blur(function() {
                var value = $(this).val();
                if (value == "")
                {
                    el.find('.entradaValorParcela').unmask();
                    $(this).val("Valor das Parcelas");
                } else if (value == "R$ 0,00") {
                    el.find('.entradaValorParcela').unmask();
                    $(this).val("Valor das Parcelas");
                }
            });

            el.find(".entradaValor").focus(function() {
                el.find('.entradaValor').priceFormat({
                    prefix: 'R$ ',
                    centsSeparator: ',',
                    thousandsSeparator: '.'
                });
                var value = $(this).val();
                if (value == "Valor Total")
                {
                    $(this).val("");
                }
            });

            el.find(".entradaValor").blur(function() {
                var value = $(this).val();
                if (value == "")
                {
                    el.find('.entradaValor').unmask();
                    $(this).val("Valor Total");
                } else if (value == "R$ 0,00") {
                    el.find('.entradaValor').unmask();
                    $(this).val("Valor Total");
                }
            });

            el.find(".entradaVencimentoParcela").blur(function() {
                var value = $(this).val();
                //$(this).prop("type", "text");
                if (value == "")
                {
                    $(this).val("Vencimento da 1ª Parcela");
                }
            });

            el.find(".entradaVencimentoParcela").focus(function() {
                var value = $(this).val();
                if (value == "Vencimento da 1ª Parcela")
                {
                    $(this).val("");
                }
            });


            $(document).on("click", ".entradaHoje",function(e){
                if (!el.find(".entradaHoje").hasClass("disabled")) {
                    var date = ('0' + new Date().getDate()).slice(-2) + "/" + ('0' + eval(new Date().getMonth()+1)).slice(-2) + "/" + new Date().getFullYear();
                    el.find(".entradaVencimentoParcela").val(date);
                }
            });

            $(document).on("click", ".entrada30Dias",function(e){
                if (!el.find(".entrada30Dias").hasClass("disabled")) {
                    var today = new Date();
                    var startDate = new Date(today.getTime() + 30*24*60*60*1000);
                    var dia  = startDate.getDate();
                    if (dia< 10) {
                        dia  = "0" + dia;
                    }
                    var mes  = startDate.getMonth() + 1;
                    if (mes < 10) {
                        mes  = "0" + mes;
                    }
                    var ano  = startDate.getFullYear();
                    dataFormatada = dia + "/" + mes + "/" + ano;

                    el.find(".entradaVencimentoParcela").val(dataFormatada);
                }
            });

            //////////////////////////////////////////////
            //eventos nos inputs gerais
            el.find(".saidaTipoValor").focus(function() {
                var value = $(this).val();
                if (value == "Tipo de Valor")
                {
                    $(this).val("");
                }
            });

            el.find(".saidaTipoValor").blur(function() {
                var value = $(this).val();
                if (value == "")
                {
                    $(this).val("Tipo de Valor");
                }
            });

            el.find(".saidaParcelas").focus(function() {
                var value = $(this).val();
                //$(this).prop("type", "number");
                if (value == "Parcelas")
                {
                    $(this).val("");
                }
            });

            el.find(".saidaParcelas").blur(function() {
                var value = $(this).val();
                //$(this).prop("type", "text");
                if (value == "")
                {
                    $(this).val("Parcelas");
                    el.find(".saidaValorParcela").prop('disabled', true);
                } else if (value <= 0) {
                    $(this).val("Parcelas");
                    el.find(".saidaValorParcela").prop('disabled', true);
                }
            });

            el.find(".saidaParcelas").keypress(function(e) {
                if (e.keyCode == "48" || e.keyCode == "49" || e.keyCode == "50" || e.keyCode == "51" || e.keyCode == "52" || e.keyCode == "53" || e.keyCode == "54" || e.keyCode == "55" || e.keyCode == "56" || e.keyCode == "57") {
                } else {
                    e.preventDefault();
                    return false;
                }
            });


            el.find(".saidaParcelas").keyup(function(e) {
                if (el.find(".saidaParcelas").val() > 1) {
                    el.find(".saidaValorParcela").prop('disabled', false);
                    el.find(".saidaVencimentoParcela").prop('disabled', false);
                    el.find(".saidaHoje").removeClass('disabled');
                    el.find(".saida30Dias").removeClass('disabled');
                    el.find(".saidaValor").prop('disabled', true);
                    el.find(".saidaValor").val("Valor Total");
                } else {
                    el.find(".saidaValorParcela").prop('disabled', true);
                    el.find(".saidaVencimentoParcela").prop('disabled', true);
                    el.find(".saidaHoje").addClass('disabled');
                    el.find(".saida30Dias").addClass('disabled');
                    el.find(".saidaValor").prop('disabled', false);
                    el.find(".saidaValorParcela").val("Valor das Parcelas");
                    el.find(".saidaVencimentoParcela").val("Vencimento da 1ª Parcela");
                }
            });

            el.find(".saidaVencimentoParcela").blur(function() {
                var value = $(this).val();
                //$(this).prop("type", "text");
                if (value == "")
                {
                    $(this).val("Vencimento da 1ª Parcela");
                }
            });

            el.find(".saidaVencimentoParcela").focus(function() {
                var value = $(this).val();
                if (value == "Vencimento da 1ª Parcela")
                {
                    $(this).val("");
                }
            });

            el.find(".saidaValorParcela").focus(function() {
                el.find('.saidaValorParcela').priceFormat({
                    prefix: 'R$ ',
                    centsSeparator: ',',
                    thousandsSeparator: '.'
                });
                var value = $(this).val();
                if (value == "Valor das Parcelas")
                {
                    $(this).val("");
                }
            });

            el.find(".saidaValorParcela").blur(function() {
                var value = $(this).val();
                if (value == "")
                {
                    el.find('.saidaValorParcela').unmask();
                    $(this).val("Valor das Parcelas");
                } else if (value == "R$ 0,00") {
                    el.find('.saidaValorParcela').unmask();
                    $(this).val("Valor das Parcelas");
                }
            });

            el.find(".saidaValor").focus(function() {
                el.find('.saidaValor').priceFormat({
                    prefix: 'R$ ',
                    centsSeparator: ',',
                    thousandsSeparator: '.'
                });
                var value = $(this).val();
                if (value == "Valor Total")
                {
                    $(this).val("");
                }
            });

            el.find(".saidaValor").blur(function() {
                var value = $(this).val();
                if (value == "")
                {
                    $(this).val("Valor Total");
                } else if (value == "R$ 0,00") {
                    el.find('.saidaValor').unmask();
                    $(this).val("Valor Total");
                }
            });

            $(document).on("click", ".saidaHoje",function(e){
                if (!el.find(".saidaHoje").hasClass("disabled")) {
                    var date = ('0' + new Date().getDate()).slice(-2) + "/" + ('0' + eval(new Date().getMonth()+1)).slice(-2) + "/" + new Date().getFullYear();
                    el.find(".saidaVencimentoParcela").val(date);
                }
            });

            $(document).on("click", ".saida30Dias",function(e){
                if (!el.find(".saida30Dias").hasClass("disabled")) {
                    var today = new Date();
                    var startDate = new Date(today.getTime() + 30*24*60*60*1000);
                    var dia  = startDate.getDate();
                    if (dia< 10) {
                        dia  = "0" + dia;
                    }
                    var mes  = startDate.getMonth() + 1;
                    if (mes < 10) {
                        mes  = "0" + mes;
                    }
                    var ano  = startDate.getFullYear();
                    dataFormatada = dia + "/" + mes + "/" + ano;

                    el.find(".saidaVencimentoParcela").val(dataFormatada);
                }
            });

            //////////////////////////////////////////////
            //eventos nos inputs gerais
            el.find(".objetivoTipoValor").focus(function() {
                var value = $(this).val();
                if (value == "Tipo de Objetivo")
                {
                    $(this).val("");
                }
            });

            el.find(".objetivoTipoValor").blur(function() {
                var value = $(this).val();
                if (value == "")
                {
                    $(this).val("Tipo de Objetivo");
                }
            });

            el.find(".objetivoData").focus(function() {
                var value = $(this).val();
                if (value == "Data Prevista")
                {
                    $(this).val("");
                }
            });

            el.find(".objetivoData").blur(function() {
                var value = $(this).val();
                if (value == "")
                {
                    $(this).val("Data Prevista");
                }
            });

            el.find(".objetivoValor").focus(function() {
                el.find('.objetivoValor').priceFormat({
                    prefix: 'R$ ',
                    centsSeparator: ',',
                    thousandsSeparator: '.'
                });
                var value = $(this).val();
                if (value == "Valor Total")
                {
                    $(this).val("");
                }
            });

            el.find(".objetivoValor").blur(function() {
                var value = $(this).val();
                if (value == "")
                {
                    $(this).val("Valor Total");
                } else if (value == "R$ 0,00") {
                    el.find('.objetivoValor').unmask();
                    $(this).val("Valor Total");
                }
            });

            //////////////////////////////////////////////
            //eventos no input tipo de valor em Entradas
            $(document).on("click", ".entradaTipoValor, .setaEntradaTipoValor, .entradaTipoValorSelect",function(e){
                if (!el.find(".entradaTipoValor").hasClass("entradaTipoValor2")) {
                    el.find(".entradaTipoValorSelect").show();
                    el.find(".saidaTipoValorSelect").hide();
                    el.find(".objetivoTipoValorSelect").hide();
                    e.stopPropagation();
                }
            });

            $(document).on("click", ".entradaTipoValorTag",function(e){
                el.find(".entradaTipoValorSelect").show();
                e.stopPropagation();
            });

            $(document).on("click", ".setaEntradaTipoValor",function(e){
                el.find(".entradaTipoValorSelect").show();
                e.stopPropagation();
            });

            $(document).on("click", ".entradaTipoValorSelectOpcao1",function(e){
                el.find(".entradaTipoValorTag").html("Salário");
                el.find(".entradaTipoValorTag").attr("tipo_valor_tag", "salario");
                el.find(".entradaTipoValorTag").show();
                el.find(".entradaTipoValor").addClass("entradaTipoValor2");
                el.find(".entradaTipoValorSelect").hide();
                //el.find(".entradaTipoValor2").val("");
                el.find(".entradaTipoValor2").focus();
                el.find(".entradaTipoValor2").css("width", "13.2em");
                el.find(".entradaTipoValor2").css("padding-left", "5.8em");
                el.find(".entradaTipoValor2").css("padding-right", "3em");
                e.stopPropagation();
            });

            $(document).on("click", ".entradaTipoValorSelectOpcao2",function(e){
                el.find(".entradaTipoValorTag").html("Venda");
                el.find(".entradaTipoValorTag").attr("tipo_valor_tag", "venda");
                el.find(".entradaTipoValorTag").show();
                el.find(".entradaTipoValor").addClass("entradaTipoValor2");
                el.find(".entradaTipoValorSelect").hide();
                //el.find(".entradaTipoValor2").val("");
                el.find(".entradaTipoValor2").focus();
                el.find(".entradaTipoValor2").css("width", "14.3em");
                el.find(".entradaTipoValor2").css("padding-left", "4.7em");
                el.find(".entradaTipoValor2").css("padding-right", "3em");
                e.stopPropagation();
            });

            $(document).on("click", ".entradaTipoValorSelectOpcao3",function(e){
                el.find(".entradaTipoValorTag").html("Bônus");
                el.find(".entradaTipoValorTag").attr("tipo_valor_tag", "bonus");
                el.find(".entradaTipoValorTag").show();
                el.find(".entradaTipoValor").addClass("entradaTipoValor2");
                el.find(".entradaTipoValorSelect").hide();
                //el.find(".entradaTipoValor2").val("");
                el.find(".entradaTipoValor2").focus();
                el.find(".entradaTipoValor2").css("width", "14em");
                el.find(".entradaTipoValor2").css("padding-left", "5em");
                el.find(".entradaTipoValor2").css("padding-right", "3em");
                e.stopPropagation();
            });

            $(document).on("click", ".entradaTipoValorSelectOpcao4",function(e){
                el.find(".entradaTipoValorTag").html("Outros");
                el.find(".entradaTipoValorTag").attr("tipo_valor_tag", "outros");
                el.find(".entradaTipoValorTag").show();
                el.find(".entradaTipoValor").addClass("entradaTipoValor2");
                el.find(".entradaTipoValorSelect").hide();
                //el.find(".entradaTipoValor2").val("");
                el.find(".entradaTipoValor2").focus();
                el.find(".entradaTipoValor2").css("width", "13.5em");
                el.find(".entradaTipoValor2").css("padding-left", "5.5em");
                el.find(".entradaTipoValor2").css("padding-right", "3em");
                e.stopPropagation();
            });

            el.find(".entradaTipoValor").keypress(function(e){
                if (!el.find(".entradaTipoValor").hasClass("entradaTipoValor2")) {
                    el.find(".entradaTipoValor").val("Tipo de Valor");
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            $(document).on("click", ".entradaTipoValor",function(e){
                if (!el.find(".entradaTipoValor").hasClass("entradaTipoValor2")) {
                    el.find(".entradaTipoValor").val("Tipo de Valor");
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            el.find(".entradaParcelas").keypress(function(e){
                if(this.value.length==3) return false;
            });

            el.find('.entradaParcelas').bind("cut copy paste",function(e) {
                e.preventDefault();
            });

            //////////////////////////////////////////////
            //eventos no input tipo de valor em Saídas
            $(document).on("click", ".saidaTipoValor, .setaSaidaTipoValor, .saidaTipoValorSelect",function(e){
                if (!el.find(".saidaTipoValor").hasClass("saidaTipoValor2")) {
                    el.find(".saidaTipoValorSelect").toggle();
                    el.find(".entradaTipoValorSelect").hide();
                    el.find(".objetivoTipoValorSelect").hide();
                    e.stopPropagation();
                }
                e.stopPropagation();
            });

            $(document).on("click", ".saidaTipoValorTag",function(e){
                el.find(".saidaTipoValorSelect").show();
                e.stopPropagation();
            });

            $(document).on("click", ".setaSaidaTipoValor",function(e){
                el.find(".saidaTipoValorSelect").show();
                e.stopPropagation();
            });

            $(document).on("click", ".saidaTipoValorSelectOpcao1",function(e){
                el.find(".saidaTipoValorTag").html("Compra");
                el.find(".saidaTipoValorTag").attr("tipo_valor_tag", "compra");
                el.find(".saidaTipoValorTag").show();
                el.find(".saidaTipoValor").addClass("saidaTipoValor2");
                el.find(".saidaTipoValorSelect").hide();
                //el.find(".saidaTipoValor2").val("");
                el.find(".saidaTipoValor2").focus();
                el.find(".saidaTipoValor2").css("width", "12.7em");
                el.find(".saidaTipoValor2").css("padding-left", "6.3em");
                el.find(".saidaTipoValor2").css("padding-right", "3em");
                e.stopPropagation();
            });

            $(document).on("click", ".saidaTipoValorSelectOpcao2",function(e){
                el.find(".saidaTipoValorTag").html("Cartão de Crédito");
                el.find(".saidaTipoValorTag").attr("tipo_valor_tag", "cartao");
                el.find(".saidaTipoValorTag").show();
                el.find(".saidaTipoValor").addClass("saidaTipoValor2");
                el.find(".saidaTipoValorSelect").hide();
                //el.find(".saidaTipoValor2").val("");
                el.find(".saidaTipoValor2").focus();
                el.find(".saidaTipoValor2").css("width", "7.5em");
                el.find(".saidaTipoValor2").css("padding-left", "11.5em");
                el.find(".saidaTipoValor2").css("padding-right", "3em");
                e.stopPropagation();
            });

            $(document).on("click", ".saidaTipoValorSelectOpcao3",function(e){
                el.find(".saidaTipoValorTag").html("Empréstimo");
                el.find(".saidaTipoValorTag").attr("tipo_valor_tag", "emprestimo");
                el.find(".saidaTipoValorTag").show();
                el.find(".saidaTipoValor").addClass("saidaTipoValor2");
                el.find(".saidaTipoValorSelect").hide();
                //el.find(".saidaTipoValor2").val("");
                el.find(".saidaTipoValor2").focus();
                el.find(".saidaTipoValor2").css("width", "10.7em");
                el.find(".saidaTipoValor2").css("padding-left", "8.3em");
                el.find(".saidaTipoValor2").css("padding-right", "3em");
                e.stopPropagation();
            });

            $(document).on("click", ".saidaTipoValorSelectOpcao4",function(e){
                el.find(".saidaTipoValorTag").html("Outros");
                el.find(".saidaTipoValorTag").attr("tipo_valor_tag", "outros");
                el.find(".saidaTipoValorTag").show();
                el.find(".saidaTipoValor").addClass("saidaTipoValor2");
                el.find(".saidaTipoValorSelect").hide();
                //el.find(".saidaTipoValor2").val("");
                el.find(".saidaTipoValor2").focus();
                el.find(".saidaTipoValor2").css("width", "13.5em");
                el.find(".saidaTipoValor2").css("padding-left", "5.5em");
                el.find(".saidaTipoValor2").css("padding-right", "3em");
                e.stopPropagation();
            });

            el.find(".saidaTipoValor").keypress(function(e){
                if (!el.find(".saidaTipoValor").hasClass("saidaTipoValor2")) {
                    el.find(".saidaTipoValor").val("Tipo de Valor");
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            $(document).on("click", ".saidaTipoValor",function(e){
                if (!el.find(".saidaTipoValor").hasClass("saidaTipoValor2")) {
                    el.find(".saidaTipoValor").val("Tipo de Valor");
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            el.find(".saidaParcelas").keypress(function(e){
                if(this.value.length==3) return false;
            });

            el.find('.saidaParcelas').bind("cut copy paste",function(e) {
                e.preventDefault();
            });

            //////////////////////////////////////////////
            //eventos no input tipo de valor em Objetivos
            $(document).on("click", ".objetivoTipoValor, .setaObjetivoTipoValor, .objetivoTipoValorSelect",function(e){
                if (!el.find(".objetivoTipoValor").hasClass("objetivoTipoValor2")) {
                    el.find(".objetivoTipoValorSelect").toggle();
                    el.find(".saidaTipoValorSelect").hide();
                    el.find(".entradaTipoValorSelect").hide();
                    e.stopPropagation();
                }
            });

            $(document).on("click", ".objetivoTipoValorTag",function(e){
                el.find(".objetivoTipoValorSelect").show();
                e.stopPropagation();
            });

            $(document).on("click", ".setaObjetivoTipoValor",function(e){
                el.find(".objetivoTipoValorSelect").show();
                e.stopPropagation();
            });

            $(document).on("click", ".objetivoTipoValorSelectOpcao1",function(e){
                el.find(".objetivoTipoValorTag").html("Compra");
                el.find(".objetivoTipoValorTag").attr("tipo_valor_tag", "compra");
                el.find(".objetivoTipoValorTag").show();
                el.find(".objetivoTipoValor").addClass("objetivoTipoValor2");
                el.find(".objetivoTipoValorSelect").hide();
                //el.find(".objetivoTipoValor2").val("");
                el.find(".objetivoTipoValor2").focus();
                el.find(".objetivoTipoValor2").css("width", "12.9em");
                el.find(".objetivoTipoValor2").css("padding-left", "6.1em");
                el.find(".objetivoTipoValor2").css("padding-right", "3em");
                e.stopPropagation();
            });

            $(document).on("click", ".objetivoTipoValorSelectOpcao2",function(e){
                el.find(".objetivoTipoValorTag").html("Venda");
                el.find(".objetivoTipoValorTag").attr("tipo_valor_tag", "venda");
                el.find(".objetivoTipoValorTag").show();
                el.find(".objetivoTipoValor").addClass("objetivoTipoValor2");
                el.find(".objetivoTipoValorSelect").hide();
                //el.find(".objetivoTipoValor2").val("");
                el.find(".objetivoTipoValor2").focus();
                el.find(".objetivoTipoValor2").css("width", "14.3em");
                el.find(".objetivoTipoValor2").css("padding-left", "4.7em");
                el.find(".objetivoTipoValor2").css("padding-right", "3em");
                e.stopPropagation();
            });

            el.find(".objetivoTipoValor").keypress(function(e){
                if (!el.find(".objetivoTipoValor").hasClass("objetivoTipoValor2")) {
                    el.find(".objetivoTipoValor").val("Tipo de Objetivo");
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            $(document).on("click", ".objetivoTipoValor",function(e){
                if (!el.find(".objetivoTipoValor").hasClass("objetivoTipoValor2")) {
                    el.find(".objetivoTipoValor").val("Tipo de Objetivo");
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            el.find('.objetivoData').bind("cut copy paste",function(e) {
                e.preventDefault();
            });

            //////////////////////////////////////////////
            //eventos pra fechar os selects
            $(document).on("click", function(e){
                if (el.find('.entradaTipoValorSelect').is(":visible")) {
                    el.find(".entradaTipoValorSelect").hide();
                }
                if (el.find('.saidaTipoValorSelect').is(":visible")) {
                    el.find(".saidaTipoValorSelect").hide();
                }
                if (el.find('.objetivoTipoValorSelect').is(":visible")) {
                    el.find(".objetivoTipoValorSelect").hide();
                }
            });

            //////////////////////////////////////////////
            //função pra ajax de add nova Entrada de Valores
            function cadastroEntrada(e) {
                el.find(".loading.entrada_loading").show();
                el.find(".entradaAdd").addClass("disabled");
                var money = el.find(".entradaValor").val();

                if (el.find(".entradaParcelas").val() > 1) {
                    var nParcelas = el.find(".entradaParcelas").val();
                } else {
                    var nParcelas = 0;
                }
                var moneyParcelas = el.find(".entradaValorParcela").val();
                if (el.find(".entradaValorParcela").val().match(/\./g) !== null) {
                    for (var i = 0; i < el.find(".entradaValorParcela").val().match(/\./g).length; i++) {
                        moneyParcelas = moneyParcelas.replace('R$ ', '').replace(/\./g, '').replace(',', '');
                    }
                } else {
                    moneyParcelas = moneyParcelas.replace('R$ ', '').replace(',', '');
                }
                if (!isNaN(moneyParcelas) == false){
                    moneyParcelas = 0;
                }

                if (el.find(".entradaValor").val().match(/\./g) !== null) {
                    for (var i = 0; i < el.find(".entradaValor").val().match(/\./g).length; i++) {
                        money = money.replace('R$ ', '').replace(/\./g, '').replace(',', '');
                    }
                } else {
                        money = money.replace('R$ ', '').replace(',', '');
                }
                if (nParcelas > 1) {
                    money = moneyParcelas * nParcelas;
                }
                if (el.find(".entradaTipoValor2").val() == "Tipo de Valor") {
                    var entradaTexto = "";
                } else {
                    var entradaTexto = el.find(".entradaTipoValor2").val();
                }
                var entradaTextoTag = el.find(".entradaTipoValorTag").attr("tipo_valor_tag");

                if (nParcelas > 1) {
                    var parcelaAtual = 1;
                } else {
                    var parcelaAtual = 0;
                }

                var entradaData = moment().format("X");

                var dataVencimentoParcelaExplode = el.find(".entradaVencimentoParcela").val().split('/');
                var dataVencimentoParcela = moment(dataVencimentoParcelaExplode[2]+"-"+dataVencimentoParcelaExplode[1]+"-"+dataVencimentoParcelaExplode[0]).format("X");
                if (!isNaN(dataVencimentoParcela) == false){
                    dataVencimentoParcela = 0;
                }

                if (nParcelas >= 2 && el.find(".entradaValorParcela").val()== "Valor das Parcelas" || nParcelas >= 2 && el.find(".entradaValorParcela").val()== "") {
                    el.find(".entradaValorParcela").addClass("backgroundRed");
                    tooltipalert(el.find(".entradaValorParcela"), 'Campo obrigatório!');
                    setTimeout(function() { 
                        el.find(".entradaValorParcela").removeClass("backgroundRed");
                        el.find(".entradaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.entrada_loading").hide();
                } else if (el.find(".entradaParcelas").val() >= 2 && checkDate(el.find(".entradaVencimentoParcela").val().split("/")[0], el.find(".entradaVencimentoParcela").val().split("/")[1], el.find(".entradaVencimentoParcela").val().split("/")[2]) == false) {
                    el.find(".entradaVencimentoParcela").addClass("backgroundRed");
                    tooltipalert(el.find(".entradaVencimentoParcela"), 'Data inválida!');
                    setTimeout(function() { 
                        el.find(".entradaVencimentoParcela").removeClass("backgroundRed");
                        el.find(".entradaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.entrada_loading").hide();
                } else if (!el.find(".entradaTipoValor").hasClass("entradaTipoValor2")) {
                    el.find(".entradaTipoValor").addClass("backgroundRed");
                    tooltipalert(el.find(".entradaTipoValor"), 'Preencha a descrição do valor!');
                    setTimeout(function() { 
                        el.find(".entradaTipoValor").removeClass("backgroundRed");
                        el.find(".entradaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.entrada_loading").hide();
                /*} else if (el.find(".entradaTipoValor2").val() == "" || el.find(".entradaTipoValor2").val() == "Tipo de Valor") {
                    el.find(".entradaTipoValor2").addClass("backgroundRed");
                    tooltipalert(el.find(".entradaTipoValor2"), 'Preencha a descrição do valor!');
                    setTimeout(function() { 
                        el.find(".entradaTipoValor2").removeClass("backgroundRed");
                        el.find(".entradaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.entrada_loading").hide();*/
                } else if (el.find(".entradaTipoValor2").val().length > 23) {
                    el.find(".entradaTipoValor2").addClass("backgroundRed");
                    tooltipalert(el.find(".entradaTipoValor2"), 'Campo com limite de caracteres execidos!');
                    setTimeout(function() { 
                        el.find(".entradaTipoValor2").removeClass("backgroundRed");
                        el.find(".entradaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.entrada_loading").hide();
                } else if (nParcelas >= 2 && el.find(".entradaValorParcela").val().length > 13 && el.find(".entradaValorParcela").val()!= "Valor das Parcelas") {
                    el.find(".entradaValorParcela").addClass("backgroundRed");
                    tooltipalert(el.find(".entradaValorParcela"), 'Campo com limite de caracteres execidos!');
                    setTimeout(function() { 
                        el.find(".entradaValorParcela").removeClass("backgroundRed");
                        el.find(".entradaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.entrada_loading").hide();
                } else if (el.find(".entradaValor").val().length > 15) {
                    el.find(".entradaValor").addClass("backgroundRed");
                    tooltipalert(el.find(".entradaValor"), 'Campo com limite de caracteres execidos!');
                    setTimeout(function() { 
                        el.find(".entradaValor").removeClass("backgroundRed");
                        el.find(".entradaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.entrada_loading").hide();
                } else if (el.find(".entradaParcelas").val() == "" || el.find(".entradaParcelas").val() == "Parcelas") {
                    el.find(".entradaParcelas").addClass("backgroundRed");
                    tooltipalert(el.find(".entradaParcelas"), 'Campo obrigatório!');
                    setTimeout(function() { 
                        el.find(".entradaParcelas").removeClass("backgroundRed");
                        el.find(".entradaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.entrada_loading").hide();
                } else if (nParcelas >= 2 && el.find(".entradaVencimentoParcela").val() == "" || nParcelas >= 2 && el.find(".entradaVencimentoParcela").val() == "Vencimento da 1ª Parcela") {
                    el.find(".entradaVencimentoParcela").addClass("backgroundRed");
                    tooltipalert(el.find(".entradaVencimentoParcela"), 'Campo obrigatório!');
                    setTimeout(function() { 
                        el.find(".entradaVencimentoParcela").removeClass("backgroundRed");
                        el.find(".entradaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.entrada_loading").hide();
                } else if (nParcelas >= 2 && el.find(".entradaValorParcela").val() == "" && el.find(".entradaVencimentoParcela").val() == "" || nParcelas >= 2 && el.find(".entradaValorParcela").val() == "Valor das Parcelas" && el.find(".entradaVencimentoParcela").val() == "Vencimento da 1ª Parcela") { 
                    if (el.find(".entradaValorParcela").val() == "Valor das Parcelas") {
                        el.find(".entradaValorParcela").addClass("backgroundRed");
                        tooltipalert(el.find(".entradaValorParcela"), 'Campo obrigatório!');
                        setTimeout(function() { 
                            el.find(".entradaValorParcela").removeClass("backgroundRed");
                            el.find(".entradaAdd").removeClass("disabled");
                        }, 3000);
                    } else if (el.find(".entradaVencimentoParcela").val() == "Vencimento da 1ª Parcela") {
                        el.find(".entradaVencimentoParcela").addClass("backgroundRed");
                        tooltipalert(el.find(".entradaVencimentoParcela"), 'Campo obrigatório!');
                        setTimeout(function() { 
                            el.find(".entradaVencimentoParcela").removeClass("backgroundRed");
                            el.find(".entradaAdd").removeClass("disabled");
                        }, 3000);
                    }
                    el.find(".loading.entrada_loading").hide();
                } else if (el.find(".entradaValor").val() == "Valor Total" && el.find(".entradaParcelas").val() <= 1) {
                    el.find(".entradaValor").addClass("backgroundRed");
                    tooltipalert(el.find(".entradaValor"), 'Campo obrigatório!');
                    setTimeout(function() { 
                        el.find(".entradaValor").removeClass("backgroundRed");
                        el.find(".entradaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.entrada_loading").hide();
                } else if (el.find(".entradaTipoValorTag").text() != "") {

                    $.ajax({
                        url: window.homepath + "movimentacoes",
                        method: 'POST',
                        dataType: 'json',
                        data: { tipo_movimentacao: "entrada", usuario_id: window.userData.id, tipo_valor_tag: entradaTextoTag, tipo_valor: entradaTexto, valor_total: money, valor_parcela: moneyParcelas, n_parcelas: nParcelas, parcela_atual: parcelaAtual, data_vencimento_parcela: dataVencimentoParcela },
                        beforeSend: function (data) {
                            data.setRequestHeader("Authorization", window.token);
                        },
                        success: function (data) {
                            console.log("---------------------------------");
                            console.log("cadastroentrada");
                            console.log(data);

                            if (data.success == true){
                                el.find('.inANDout .inANDoutNada').addClass("inANDoutNadaOff");

                                el.find(".entradaTipoValorTag").html("");
                                el.find(".entradaTipoValorTag").hide();
                                el.find(".entradaTipoValor").removeClass("entradaTipoValor2");
                                el.find(".entradaTipoValorSelect").hide();
                                el.find(".entradaTipoValor").css("width", "18em");
                                el.find(".entradaTipoValor").css("padding-left", "1em");

                                el.find(".entradaVencimentoParcela").addClass("backgroundBlue");
                                el.find(".entradaTipoValor").addClass("backgroundBlue");
                                el.find(".entradaParcelas").addClass("backgroundBlue");
                                el.find(".entradaValor").addClass("backgroundBlue");
                                el.find(".entradaValorParcela").addClass("backgroundBlue");
                                el.find(".entradaValorParcela").prop('disabled', true);
                                el.find(".entradaVencimentoParcela").prop('disabled', true);
                                el.find(".entradaValor").prop('disabled', false);
                                el.find(".entradaData").prop('disabled', false);
                                el.find(".entradaData").addClass("backgroundBlue");
                                el.find(".entradaHoje").addClass('disabled');
                                el.find(".entrada30Dias").addClass('disabled');
                                el.find(".entradaForm")[0].reset();
                                setTimeout(function() { 
                                    el.find(".entradaVencimentoParcela").removeClass("backgroundBlue");
                                    el.find(".entradaTipoValor").removeClass("backgroundBlue");
                                    el.find(".entradaParcelas").removeClass("backgroundBlue");
                                    el.find(".entradaValor").removeClass("backgroundBlue");
                                    el.find(".entradaData").removeClass("backgroundBlue");
                                    el.find(".entradaValorParcela").removeClass("backgroundBlue");
                                    el.find(".entradaAdd").removeClass("disabled");
                                }, 3000);


                                el.find(".inANDoutData").removeClass("inANDoutDataLoader").removeClass("inANDoutDataDESC").removeClass("inANDoutDataASC");
                                el.find(".inANDoutParcelas").removeClass("inANDoutParcelasLoader").removeClass("inANDoutParcelasDESC").removeClass("inANDoutParcelasASC");
                                el.find(".inANDoutAtual").removeClass("inANDoutAtualLoader").removeClass("inANDoutAtualDESC").removeClass("inANDoutAtualASC");
                                el.find(".inANDoutTipo").removeClass("inANDoutTipoLoader").removeClass("inANDoutTipoDESC").removeClass("inANDoutTipoASC");
                                el.find(".inANDoutValor").removeClass("inANDoutValorLoader").removeClass("inANDoutValorDESC").removeClass("inANDoutValorASC");
                                el.find(".inANDoutValor").removeClass("inANDoutValorLoader").removeClass("inANDoutValorDESC").removeClass("inANDoutValorASC");
                                el.find(".inANDoutTotal").removeClass("inANDoutTotalLoader").removeClass("inANDoutTotalDESC").removeClass("inANDoutTotalASC");

                                $("html, body").animate({ scrollTop: 0 }, "slow");
                                //lerEntradaESaida("1");
                                //lerUltimas();
                                calendario(new Date().getMonth()+1, new Date().getFullYear());


                                /*
                                var template = el.find("tr.dados.template").clone().insertAfter($( ".inANDout table .template")).removeClass("template").addClass("dadosSaida");

                                template.find( ".dadosTotal" ).html(data.data.valorTotal);
                                template.find( ".dadosTotal" ).priceFormat({
                                    prefix: 'R$ ',
                                    centsSeparator: ',',
                                    thousandsSeparator: '.'
                                });

                                template.find( ".dadosTipo" ).html(data.data.tipoValorTag + " " + data.data.tipoValor);
                                template.find( ".dadosParcelas" ).html(data.data.nParcelas);
                                template.find( ".dadosAtual" ).html(data.data.parcelaAtual);
                                template.find( ".dadosValor" ).html(data.data.valorParcela);

                                var dateAdicionado = toDateBR(data.data.dataAdicionado);
                                template.find( ".dadosData" ).html(dateAdicionado);

                                template.attr("id", data.data.id);
                                */

                                el.find(".loading.entrada_loading").hide();
                                //el.fi0].reset();

                            } else {
                                if (typeof(data.message) == "object"){
                                    $.each(data.message, function(i, item) {
                                        tooltipalert(el.find(".entradaAdd"), item);
                                    });
                                } else {
                                    tooltipalert(el.find(".entradaAdd"), data.message);
                                }
                                el.find(".entradaVencimentoParcela").addClass("backgroundBlue");
                                el.find(".entradaTipoValor").addClass("backgroundRed");
                                el.find(".entradaParcelas").addClass("backgroundRed");
                                el.find(".entradaValor").addClass("backgroundRed");
                                el.find(".entradaValorParcela").addClass("backgroundRed");
                                el.find(".entradaValorParcela").prop('disabled', true);
                                el.find(".entradaValor").prop('disabled', false);
                                el.find(".entradaData").addClass("backgroundRed");
                                el.find(".entradaData").prop('disabled', false);
                                setTimeout(function() { 
                                    el.find(".entradaVencimentoParcela").removeClass("backgroundBlue");
                                    el.find(".entradaTipoValor").removeClass("backgroundRed");
                                    el.find(".entradaParcelas").removeClass("backgroundRed");
                                    el.find(".entradaValor").removeClass("backgroundRed");
                                    el.find(".entradaValorParcela").removeClass("backgroundRed");
                                    el.find(".entradaData").removeClass("backgroundRed");
                                    el.find(".entradaAdd").removeClass("disabled");
                                }, 3000);
                                el.find(".loading.entrada_loading").hide();
                            }
                        },
                        error: function (data, status, error) {
                            console.log("---------------------------------");
                            console.log("cadastroEntrada");
                            console.log("ERRO:");
                            console.log(data, status, error);
                            tooltipalert(el.find(".entradaAdd"), 'Erro no sistema, tente mais tarde.');
                            el.find(".entradaVencimentoParcela").addClass("backgroundBlue");
                            el.find(".entradaTipoValor").addClass("backgroundRed");
                            el.find(".entradaParcelas").addClass("backgroundRed");
                            el.find(".entradaValor").addClass("backgroundRed");
                            el.find(".entradaValorParcela").addClass("backgroundRed");
                            el.find(".entradaValorParcela").prop('disabled', true);
                            el.find(".entradaValor").prop('disabled', false);
                            el.find(".entradaData").addClass("backgroundRed");
                            el.find(".entradaData").prop('disabled', false);
                            setTimeout(function() { 
                                el.find(".entradaVencimentoParcela").removeClass("backgroundBlue");
                                el.find(".entradaTipoValor").removeClass("backgroundRed");
                                el.find(".entradaParcelas").removeClass("backgroundRed");
                                el.find(".entradaValor").removeClass("backgroundRed");
                                el.find(".entradaValorParcela").removeClass("backgroundRed");
                                el.find(".entradaData").removeClass("backgroundRed");
                                el.find(".entradaAdd").removeClass("disabled");
                            }, 3000);
                            el.find(".loading.entrada_loading").hide();
                        },
                    });
                }

                e.preventDefault();
                return false;

            }

            //////////////////////////////////////////////
            //função pra ajax de add nova Saída de Valores
            function cadastroSaida(e) {
                el.find(".loading.saida_loading").show();
                el.find(".saidaAdd").addClass("disabled");
                var money = el.find(".saidaValor").val();

                if (el.find(".saidaParcelas").val() > 1) {
                    var nParcelas = el.find(".saidaParcelas").val();
                } else {
                    var nParcelas = 0;
                }
                var moneyParcelas = el.find(".saidaValorParcela").val();
                if (el.find(".saidaValorParcela").val().match(/\./g) !== null) {
                    for (var i = 0; i < el.find(".saidaValorParcela").val().match(/\./g).length; i++) {
                        moneyParcelas = moneyParcelas.replace('R$ ', '').replace(/\./g, '').replace(',', '');
                    }
                } else {
                        moneyParcelas = moneyParcelas.replace('R$ ', '').replace(',', '');
                }
                if (!isNaN(moneyParcelas) == false){
                    moneyParcelas = 0;
                }

                if (el.find(".saidaValor").val().match(/\./g) !== null) {
                    for (var i = 0; i < el.find(".saidaValor").val().match(/\./g).length; i++) {
                        money = money.replace('R$ ', '').replace(/\./g, '').replace(',', '');
                    }
                } else {
                        money = money.replace('R$ ', '').replace(',', '');
                }
                if (nParcelas > 1) {
                    money = moneyParcelas * nParcelas;
                }

                if (el.find(".saidaTipoValor2").val() == "Tipo de Valor") {
                    var saidaTexto = "";
                } else {
                    var saidaTexto = el.find(".saidaTipoValor2").val();
                }
                var saidaTextoTag = el.find(".saidaTipoValorTag").attr("tipo_valor_tag");

                if (nParcelas > 1) {
                    var parcelaAtual = 1;
                } else {
                    var parcelaAtual = 0;
                }

                var saidaData = moment().format("X");

                var dataVencimentoParcelaExplode = el.find(".saidaVencimentoParcela").val().split('/');
                var dataVencimentoParcela = moment(dataVencimentoParcelaExplode[2]+"-"+dataVencimentoParcelaExplode[1]+"-"+dataVencimentoParcelaExplode[0]).format("X");
                if (!isNaN(dataVencimentoParcela) == false){
                    dataVencimentoParcela = 0;
                }


                if (nParcelas >= 2 && el.find(".saidaValorParcela").val()== "Valor das Parcelas" || nParcelas >= 2 && el.find(".saidaValorParcela").val()== "") {
                    el.find(".saidaValorParcela").addClass("backgroundRed");
                    tooltipalert(el.find(".saidaValorParcela"), 'Campo obrigatório!');
                    setTimeout(function() { 
                        el.find(".saidaValorParcela").removeClass("backgroundRed");
                        el.find(".saidaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.saida_loading").hide();
                } else if (el.find(".saidaParcelas").val() >= 2 && checkDate(el.find(".saidaVencimentoParcela").val().split("/")[0], el.find(".saidaVencimentoParcela").val().split("/")[1], el.find(".saidaVencimentoParcela").val().split("/")[2]) == false) {
                    el.find(".saidaVencimentoParcela").addClass("backgroundRed");
                    tooltipalert(el.find(".saidaVencimentoParcela"), 'Data inválida!');
                    setTimeout(function() { 
                        el.find(".saidaVencimentoParcela").removeClass("backgroundRed");
                        el.find(".saidaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.saida_loading").hide();
                } else if (!el.find(".saidaTipoValor").hasClass("saidaTipoValor2")) {
                    el.find(".saidaTipoValor").addClass("backgroundRed");
                    tooltipalert(el.find(".saidaTipoValor"), 'Preencha a descrição do valor!');
                    setTimeout(function() { 
                        el.find(".saidaTipoValor").removeClass("backgroundRed");
                        el.find(".saidaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.saida_loading").hide();
                /*} else if (el.find(".saidaTipoValor2").val() == "" || el.find(".saidaTipoValor2").val() == "Tipo de Valor") {
                    el.find(".saidaTipoValor2").addClass("backgroundRed");
                    tooltipalert(el.find(".saidaTipoValor2"), 'Preencha a descrição do valor!');
                    setTimeout(function() { 
                        el.find(".saidaTipoValor2").removeClass("backgroundRed");
                        el.find(".saidaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.saida_loading").hide();*/
                } else if (el.find(".saidaTipoValor2").val().length > 23) {
                    el.find(".saidaTipoValor2").addClass("backgroundRed");
                    tooltipalert(el.find(".saidaTipoValor2"), 'Campo com limite de caracteres execidos!');
                    setTimeout(function() { 
                        el.find(".saidaTipoValor2").removeClass("backgroundRed");
                        el.find(".saidaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.saida_loading").hide();
                } else if (nParcelas >= 2 && el.find(".saidaValorParcela").val().length > 13 && el.find(".saidaValorParcela").val()!= "Valor das Parcelas") {
                    el.find(".saidaValorParcela").addClass("backgroundRed");
                    tooltipalert(el.find(".saidaValorParcela"), 'Campo com limite de caracteres execidos!');
                    setTimeout(function() { 
                        el.find(".saidaValorParcela").removeClass("backgroundRed");
                        el.find(".saidaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.saida_loading").hide();
                } else if (el.find(".saidaValor").val().length > 15) {
                    el.find(".saidaValor").addClass("backgroundRed");
                    tooltipalert(el.find(".saidaValor"), 'Campo com limite de caracteres execidos!');
                    setTimeout(function() { 
                        el.find(".saidaValor").removeClass("backgroundRed");
                        el.find(".saidaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.saida_loading").hide();
                } else if (el.find(".saidaParcelas").val() == "" || el.find(".saidaParcelas").val() == "Parcelas") {
                    el.find(".saidaParcelas").addClass("backgroundRed");
                    tooltipalert(el.find(".saidaParcelas"), 'Campo obrigatório!');
                    setTimeout(function() { 
                        el.find(".saidaParcelas").removeClass("backgroundRed");
                        el.find(".saidaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.saida_loading").hide();
                } else if (nParcelas >= 2 && el.find(".saidaVencimentoParcela").val() == "" || nParcelas >= 2 && el.find(".saidaVencimentoParcela").val() == "Vencimento da 1ª Parcela") {
                    el.find(".saidaVencimentoParcela").addClass("backgroundRed");
                    tooltipalert(el.find(".saidaVencimentoParcela"), 'Campo obrigatório!');
                    setTimeout(function() { 
                        el.find(".saidaVencimentoParcela").removeClass("backgroundRed");
                        el.find(".saidaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.saida_loading").hide();
                } else if (nParcelas >= 2 && el.find(".saidaValorParcela").val() == "" && el.find(".saidaVencimentoParcela").val() == "" || nParcelas >= 2 && el.find(".saidaValorParcela").val() == "Valor das Parcelas" && el.find(".saidaVencimentoParcela").val() == "Vencimento da 1ª Parcela") { 
                    if (el.find(".saidaValorParcela").val() == "Valor das Parcelas") {
                        el.find(".saidaValorParcela").addClass("backgroundRed");
                        tooltipalert(el.find(".saidaValorParcela"), 'Campo obrigatório!');
                        setTimeout(function() { 
                            el.find(".saidaValorParcela").removeClass("backgroundRed");
                            el.find(".saidaAdd").removeClass("disabled");
                        }, 3000);
                    } else if (el.find(".saidaVencimentoParcela").val() == "Vencimento da 1ª Parcela") {
                        el.find(".saidaVencimentoParcela").addClass("backgroundRed");
                        tooltipalert(el.find(".saidaVencimentoParcela"), 'Campo obrigatório!');
                        setTimeout(function() { 
                            el.find(".saidaVencimentoParcela").removeClass("backgroundRed");
                            el.find(".saidaAdd").removeClass("disabled");
                        }, 3000);
                    }
                    el.find(".loading.saida_loading").hide();
                } else if (el.find(".saidaValor").val() == "Valor Total" && el.find(".saidaParcelas").val() <= 1) {
                    el.find(".saidaValor").addClass("backgroundRed");
                    tooltipalert(el.find(".saidaValor"), 'Campo obrigatório!');
                    setTimeout(function() { 
                        el.find(".saidaValor").removeClass("backgroundRed");
                        el.find(".saidaAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.saida_loading").hide();
                } else if (el.find(".saidaTipoValorTag").text() != "") {
                    $.ajax({
                        url: window.homepath + "movimentacoes",
                        method: 'POST',
                        dataType: 'json',
                        data: { tipo_movimentacao: "saida", usuario_id: window.userData.id, tipo_valor_tag: saidaTextoTag, tipo_valor: saidaTexto, valor_total: money, valor_parcela: moneyParcelas, n_parcelas: nParcelas, parcela_atual: parcelaAtual, data_vencimento_parcela: dataVencimentoParcela },
                        beforeSend: function (data) {
                            data.setRequestHeader("Authorization", window.token);
                        },
                        success: function (data) {
                            console.log("---------------------------------");
                            console.log("cadastroSaida");
                            console.log(data);

                            if (data.success == true){
                                el.find('.inANDout .inANDoutNada').addClass("inANDoutNadaOff");

                                el.find(".saidaTipoValorTag").html("");
                                el.find(".saidaTipoValorTag").hide();
                                el.find(".saidaTipoValor").removeClass("saidaTipoValor2");
                                el.find(".saidaTipoValorSelect").hide();
                                el.find(".saidaTipoValor").css("width", "18em");
                                el.find(".saidaTipoValor").css("padding-left", "1em");

                                el.find(".saidaVencimentoParcela").addClass("backgroundBlue");
                                el.find(".saidaTipoValor").addClass("backgroundBlue");
                                el.find(".saidaParcelas").addClass("backgroundBlue");
                                el.find(".saidaValor").addClass("backgroundBlue");
                                el.find(".saidaValorParcela").addClass("backgroundBlue");
                                el.find(".saidaValorParcela").prop('disabled', true);
                                el.find(".saidaVencimentoParcela").prop('disabled', true);
                                el.find(".saidaValor").prop('disabled', false);
                                el.find(".saidaData").prop('disabled', false);
                                el.find(".saidaData").addClass("backgroundBlue");
                                el.find(".saidaHoje").addClass('disabled');
                                el.find(".saida30Dias").addClass('disabled');
                                el.find(".saidaForm")[0].reset();
                                setTimeout(function() { 
                                    el.find(".saidaVencimentoParcela").removeClass("backgroundBlue");
                                    el.find(".saidaTipoValor").removeClass("backgroundBlue");
                                    el.find(".saidaParcelas").removeClass("backgroundBlue");
                                    el.find(".saidaValor").removeClass("backgroundBlue");
                                    el.find(".saidaData").removeClass("backgroundBlue");
                                    el.find(".saidaValorParcela").removeClass("backgroundBlue");
                                    el.find(".saidaAdd").removeClass("disabled");
                                }, 3000);


                                el.find(".inANDoutData").removeClass("inANDoutDataLoader").removeClass("inANDoutDataDESC").removeClass("inANDoutDataASC");
                                el.find(".inANDoutParcelas").removeClass("inANDoutParcelasLoader").removeClass("inANDoutParcelasDESC").removeClass("inANDoutParcelasASC");
                                el.find(".inANDoutAtual").removeClass("inANDoutAtualLoader").removeClass("inANDoutAtualDESC").removeClass("inANDoutAtualASC");
                                el.find(".inANDoutTipo").removeClass("inANDoutTipoLoader").removeClass("inANDoutTipoDESC").removeClass("inANDoutTipoASC");
                                el.find(".inANDoutValor").removeClass("inANDoutValorLoader").removeClass("inANDoutValorDESC").removeClass("inANDoutValorASC");
                                el.find(".inANDoutValor").removeClass("inANDoutValorLoader").removeClass("inANDoutValorDESC").removeClass("inANDoutValorASC");
                                el.find(".inANDoutTotal").removeClass("inANDoutTotalLoader").removeClass("inANDoutTotalDESC").removeClass("inANDoutTotalASC");

                                $("html, body").animate({ scrollTop: 0 }, "slow");
                                //lerEntradaESaida("1");
                                //lerUltimas();
                                calendario(new Date().getMonth()+1, new Date().getFullYear());


                                /*
                                var template = el.find("tr.dados.template").clone().insertAfter($( ".inANDout table .template")).removeClass("template").addClass("dadosSaida");

                                template.find( ".dadosTotal" ).html(data.data.valorTotal);
                                template.find( ".dadosTotal" ).priceFormat({
                                    prefix: 'R$ ',
                                    centsSeparator: ',',
                                    thousandsSeparator: '.'
                                });

                                template.find( ".dadosTipo" ).html(data.data.tipoValorTag + " " + data.data.tipoValor);
                                template.find( ".dadosParcelas" ).html(data.data.nParcelas);
                                template.find( ".dadosAtual" ).html(data.data.parcelaAtual);
                                template.find( ".dadosValor" ).html(data.data.valorParcela);

                                var dateAdicionado = toDateBR(data.data.dataAdicionado);
                                template.find( ".dadosData" ).html(dateAdicionado);

                                template.attr("id", data.data.id);
                                */

                                el.find(".loading.saida_loading").hide();
                            } else {
                                if (typeof(data.message) == "object"){
                                    $.each(data.message, function(i, item) {
                                        tooltipalert(el.find(".saidaAdd"), item);
                                    });
                                } else {
                                    tooltipalert(el.find(".saidaAdd"), data.message);
                                }
                                el.find(".saidaVencimentoParcela").addClass("backgroundBlue");
                                el.find(".saidaTipoValor").addClass("backgroundRed");
                                el.find(".saidaParcelas").addClass("backgroundRed");
                                el.find(".saidaValor").addClass("backgroundRed");
                                el.find(".saidaValorParcela").addClass("backgroundRed");
                                el.find(".saidaValorParcela").prop('disabled', true);
                                el.find(".saidaValor").prop('disabled', false);
                                el.find(".saidaData").addClass("backgroundRed");
                                el.find(".saidaData").prop('disabled', false);
                                setTimeout(function() { 
                                    el.find(".saidaVencimentoParcela").removeClass("backgroundBlue");
                                    el.find(".saidaTipoValor").removeClass("backgroundRed");
                                    el.find(".saidaParcelas").removeClass("backgroundRed");
                                    el.find(".saidaValor").removeClass("backgroundRed");
                                    el.find(".saidaValorParcela").removeClass("backgroundRed");
                                    el.find(".saidaData").removeClass("backgroundRed");
                                    el.find(".saidaAdd").removeClass("disabled");
                                }, 3000);
                                el.find(".loading.saida_loading").hide();
                            }
                        },
                        error: function (data, status, error) {
                            console.log("---------------------------------");
                            console.log("cadastroSaida");
                            console.log("ERRO:");
                            console.log(data, status, error);
                            tooltipalert(el.find(".saidaAdd"), 'Erro no sistema, tente mais tarde.');
                            el.find(".saidaVencimentoParcela").addClass("backgroundBlue");
                            el.find(".saidaTipoValor").addClass("backgroundRed");
                            el.find(".saidaParcelas").addClass("backgroundRed");
                            el.find(".saidaValor").addClass("backgroundRed");
                            el.find(".saidaValorParcela").addClass("backgroundRed");
                            el.find(".saidaValorParcela").prop('disabled', true);
                            el.find(".saidaValor").prop('disabled', false);
                            el.find(".saidaData").addClass("backgroundRed");
                            el.find(".saidaData").prop('disabled', false);
                            setTimeout(function() { 
                                el.find(".saidaVencimentoParcela").removeClass("backgroundBlue");
                                el.find(".saidaTipoValor").removeClass("backgroundRed");
                                el.find(".saidaParcelas").removeClass("backgroundRed");
                                el.find(".saidaValor").removeClass("backgroundRed");
                                el.find(".saidaValorParcela").removeClass("backgroundRed");
                                el.find(".saidaData").removeClass("backgroundRed");
                                el.find(".saidaAdd").removeClass("disabled");
                            }, 3000);
                            el.find(".loading.saida_loading").hide();
                        },
                    });
                }

                e.preventDefault();
                return false;

            }

            //////////////////////////////////////////////
            //função pra ajax de add novo Objetivo
            function cadastroObjetivo(e) {
                el.find(".loading.objetivo_loading").show();
                el.find(".objetivoAdd").addClass("disabled");
                var money = el.find(".objetivoValor").val();
                if (el.find(".objetivoValor").val().match(/\./g) !== null) {
                    for (var i = 0; i < el.find(".objetivoValor").val().match(/\./g).length; i++) {
                        money = money.replace('R$ ', '').replace(/\./g, '').replace(',', '');
                    }
                } else {
                        money = money.replace('R$ ', '').replace(',', '');
                }
                var objetivoTexto = el.find(".objetivoTipoValor2").val();
                var objetivoTextoTag = el.find(".objetivoTipoValorTag").attr("tipo_valor_tag");
                var arr = el.find('.objetivoData').val().split('/');
                var dataPrevista = moment(arr[2]+"-"+arr[1]+"-"+arr[0]).format("X");


                if (!el.find(".objetivoTipoValor").hasClass("objetivoTipoValor2")) {
                    el.find(".objetivoTipoValor").addClass("backgroundRed");
                    tooltipalert(el.find(".objetivoTipoValor"), 'Preencha a descrição do valor!');
                    setTimeout(function() { 
                        el.find(".objetivoTipoValor").removeClass("backgroundRed");
                        el.find(".objetivoAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.objetivo_loading").hide();
                } else if (el.find(".objetivoTipoValor2").val() == "" || el.find(".objetivoTipoValor2").val() == "Tipo de Objetivo") {
                    el.find(".objetivoTipoValor2").addClass("backgroundRed");
                    tooltipalert(el.find(".objetivoTipoValor2"), 'Preencha a descrição do valor!');
                    setTimeout(function() { 
                        el.find(".objetivoTipoValor2").removeClass("backgroundRed");
                        el.find(".objetivoAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.objetivo_loading").hide();
                } else if (el.find(".objetivoTipoValor2").val().length > 23) {
                    el.find(".objetivoTipoValor2").addClass("backgroundRed");
                    tooltipalert(el.find(".objetivoTipoValor2"), 'Campo com limite de caracteres execidos!');
                    setTimeout(function() { 
                        el.find(".objetivoTipoValor2").removeClass("backgroundRed");
                        el.find(".objetivoAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.objetivo_loading").hide();
                } else if (el.find(".objetivoValor").val().length > 15) {
                    el.find(".objetivoValor").addClass("backgroundRed");
                    tooltipalert(el.find(".objetivoValor"), 'Campo com limite de caracteres execidos!');
                    setTimeout(function() { 
                        el.find(".objetivoValor").removeClass("backgroundRed");
                        el.find(".objetivoAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.objetivo_loading").hide();
                } else if (el.find(".objetivoData").val() != "Data Prevista" && checkDate(el.find(".objetivoData").val().split("/")[0], el.find(".objetivoData").val().split("/")[1], el.find(".objetivoData").val().split("/")[2]) == false) {
                    el.find(".objetivoData").addClass("backgroundRed");
                    tooltipalert(el.find(".objetivoData"), 'Data inválida!');
                    setTimeout(function() { 
                        el.find(".objetivoData").removeClass("backgroundRed");
                        el.find(".objetivoAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.objetivo_loading").hide();
                } else if (el.find(".objetivoData").val() == "" || el.find(".objetivoData").val() == "Data Prevista") {
                    el.find(".objetivoData").addClass("backgroundRed");
                    tooltipalert(el.find(".objetivoData"), 'Campo obrigatório!');
                    setTimeout(function() { 
                        el.find(".objetivoData").removeClass("backgroundRed");
                        el.find(".objetivoAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.objetivo_loading").hide();
                } else if (el.find(".objetivoValor").val() == "" || el.find(".objetivoValor").val() == "Valor Total") {
                    el.find(".objetivoValor").addClass("backgroundRed");
                    tooltipalert(el.find(".objetivoValor"), 'Campo obrigatório!');
                    setTimeout(function() { 
                        el.find(".objetivoValor").removeClass("backgroundRed");
                        el.find(".objetivoAdd").removeClass("disabled");
                    }, 3000);
                    el.find(".loading.objetivo_loading").hide();
                } else if (el.find(".objetivoTipoValorTag").attr("tipo_valor_tag") != "") {
                    $.ajax({
                        url: window.homepath + "objetivos",
                        method: 'POST',
                        dataType: 'json',
                        data: { tipo_valor_tag: objetivoTextoTag, usuario_id: window.userData.id, tipo_valor: objetivoTexto, valor_total: money, data_prevista: dataPrevista },
                        beforeSend: function (data) {
                            data.setRequestHeader("Authorization", window.token);
                        },
                        success: function (data) {
                            console.log("---------------------------------");
                            console.log("cadastroObjetivo");
                            console.log(data);

                            if (data.success == true){
                                el.find('.objetivos .objetivosNada').addClass("objetivosNadaOff");

                                el.find(".objetivoTipoValorTag").html("");
                                el.find(".objetivoTipoValorTag").hide();
                                el.find(".objetivoTipoValor").removeClass("objetivoTipoValor2");
                                el.find(".objetivoTipoValorSelect").hide();
                                el.find(".objetivoTipoValor").css("width", "18em");
                                el.find(".objetivoTipoValor").css("padding-left", "1em");

                                el.find(".objetivoTipoValor").addClass("backgroundBlue");
                                el.find(".objetivoData").addClass("backgroundBlue");
                                el.find(".objetivoValor").addClass("backgroundBlue");
                                el.find(".objetivoForm")[0].reset();
                                setTimeout(function() { 
                                    el.find(".objetivoTipoValor").removeClass("backgroundBlue");
                                    el.find(".objetivoData").removeClass("backgroundBlue");
                                    el.find(".objetivoValor").removeClass("backgroundBlue");
                                    el.find(".objetivoAdd").removeClass("disabled");
                                }, 3000);

                                el.find(".objetivosPrazo").removeClass("objetivosPrazoLoader").removeClass("objetivosPrazoDESC").removeClass("objetivosPrazoASC");
                                el.find(".objetivosTipo").removeClass("objetivosTipoLoader").removeClass("objetivosTipoDESC").removeClass("objetivosTipoASC");
                                el.find(".objetivosTotal").removeClass("objetivosTotalLoader").removeClass("objetivosTotalDESC").removeClass("objetivosTotalASC");

                                lerObjetivos("1");
                                lerUltimas();

                                /*
                                if (data.data.tipoValorTag == "Compra") {
                                    var template = el.find("tr.objetivosDados.template").clone().insertAfter($( ".objetivos table .template")).removeClass("template").addClass("objetivosDadosEntrada");
                                } else if (data.data.tipoValorTag == "Venda") {
                                    var template = el.find("tr.objetivosDados.template").clone().insertAfter($( ".objetivos table .template")).removeClass("template").addClass("objetivosDadosSaida");
                                }

                                template.find( ".objetivosDadosTipo" ).html(data.data.tipoValorTag + " " + data.data.tipoValor);

                                template.find( ".objetivosDadosTotal" ).html(data.data.valorTotal);
                                template.find( ".objetivosDadosTotal" ).priceFormat({
                                    prefix: 'R$ ',
                                    centsSeparator: ',',
                                    thousandsSeparator: '.'
                                });

                                var dataPrevisao = new Date(toDate(data.data.dataPrevista));
                                var dataAtual = new Date();
                                var dataConta = Math.abs(dataAtual.getTime() - dataPrevisao.getTime());
                                var faltam = Math.ceil(dataConta / (1000 * 3600 * 24));
                                template.find( ".objetivosDadosPrevisao" ).html(faltam + " dias");
                                template.find( ".objetivosDadosPrevisao" ).attr("data-title", toDateBR(data.data.dataPrevista));

                                template.attr("id", data.data.id);
                                */

                                el.find(".loading.objetivo_loading").hide();
                                el.find(".objetivoData").attr("value", "Data Prevista");

                            } else {
                                if (typeof(data.message) == "object"){
                                    $.each(data.message, function(i, item) {
                                        tooltipalert(el.find(".objetivoAdd"), item);
                                    });
                                } else {
                                    tooltipalert(el.find(".objetivoAdd"), data.message);
                                }
                                el.find(".objetivoTipoValor").addClass("backgroundRed");
                                el.find(".objetivoValor").addClass("backgroundRed");
                                el.find(".objetivoData").addClass("backgroundRed");
                                setTimeout(function() { 
                                    el.find(".objetivoTipoValor").removeClass("backgroundRed");
                                    el.find(".objetivoValor").removeClass("backgroundRed");
                                    el.find(".objetivoData").removeClass("backgroundRed");
                                    el.find(".objetivoAdd").removeClass("disabled");
                                }, 3000);
                                el.find(".loading.objetivo_loading").hide();
                            }
                        },
                        error: function (data) {
                            console.log("---------------------------------");
                            console.log("cadastroObjetivo");
                            console.log("ERRO:");
                            console.log(data);
                            tooltipalert(el.find(".objetivoAdd"), 'Erro no sistema, tente mais tarde.');
                            el.find(".objetivoTipoValor").addClass("backgroundRed");
                            el.find(".objetivoValor").addClass("backgroundRed");
                            el.find(".objetivoData").addClass("backgroundRed");
                            setTimeout(function() { 
                                el.find(".objetivoTipoValor").removeClass("backgroundRed");
                                el.find(".objetivoValor").removeClass("backgroundRed");
                                el.find(".objetivoData").removeClass("backgroundRed");
                            }, 3000);
                            el.find(".loading.objetivo_loading").hide();
                        },
                    });
                }

                e.preventDefault();
                return false;

            }


            //////////////////////////////////////////////
            //função de preenchimento do PERFIL DO USUARIO
            function lerPerfil() {
                $.ajax({
                    url: window.homepath + "usuarios/" + window.userData.id,
                    method: 'GET',
                    dataType: 'json',
                    beforeSend: function (data) {
                        data.setRequestHeader("Authorization", window.token);
                    },
                    success: function (data) {
                        console.log("---------------------------------");
                        console.log("lerPerfil");
                        console.log(data);

                        if (data.success == true){
                            el.find('.box_perfil .nome').text(data.data.nome);
                            el.find('.box_perfil .nome').attr("data-title", data.data.nome);
                            el.find('.box_perfil .profissao').text(data.data.profissao);
                            el.find('.box_perfil .profissao').attr("data-title", data.data.profissao);
                            if (data.data.foto != null) {
                                el.find('.box_perfil .foto').css("background-image", "url('" + window.uploadpath + data.data.foto + "')");
                                el.find('.box_perfil .foto').html("");
                            }

                            var date = toDate(data.data.data_nascimento);
                            var dob = new Date(date);
                            var today = new Date();
                            var age = Math.floor((today-dob) / (365.25 * 24 * 60 * 60 * 1000));

                            el.find('.box_perfil .idade').text(age + " anos");
                            el.find('.box_perfil .idade').attr("data-title", date);

                            carregou_item = 2;
                            if (carregou < carregouTotal) {
                                carregou = carregou + 1;
                            }
                            carregando(carregou, carregou_item);
                        }
                    },
                    error: function (data) {
                        erroNoSistema(data);
                    },
                });
            }

            //////////////////////////////////////////////
            //função de preenchimento do SALÁRIO
            function lerSalario() {
                $.ajax({
                    url: window.homepath + "ajax/lerSalario.php",
                    method: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        console.log("---------------------------------");
                        console.log("lerSalario");
                        console.log(data);

                        if (data.success == true){
                            var today = new Date();
                            var dd = ("0" + (data.data["0"].diaRecebimento)).slice(-2);
                            var ddNow = ("0" + (today.getMonth())).slice(-2);
                            if (ddNow > dd){
                                var mm = ("0" + (today.getMonth() + 2)).slice(-2);
                            } else {
                                var mm = ("0" + (today.getMonth() + 1)).slice(-2);
                            }
                            var yyyy = today.getFullYear();

                            if (data.data["0"].diaRecebimento) {
                                el.find('.salario .salarioDataValores').text(dd + "/" + mm + "/" + yyyy);
                            }

                            el.find('.salario .salarioBrutoValores').text(data.data["0"].bruto);
                            el.find('.salario .salarioBrutoValores').priceFormat({
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });

                            el.find('.salario .salarioHoraExtraValores').text(data.data["0"].horaExtra);
                            el.find('.salario .salarioHoraExtraValores').priceFormat({
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });
                            
                            el.find('.salario .salarioDescontosValores').text(data.data["0"].descontos);
                            el.find('.salario .salarioDescontosValores').priceFormat({
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });

                            var salario = (Number(data.data["0"].bruto) + Number(data.data["0"].horaExtra)) - Number(data.data["0"].descontos);
                            el.find('.salario .salarioTotalValores').text(salario);
                            el.find('.salario .salarioTotalValores').priceFormat({
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });


                            carregou_item = 3;
                            if (carregou < carregouTotal) {
                                carregou = carregou + 1;
                            }
                            carregando(carregou, carregou_item);
                        } else {
                            erroNoSistema(data);
                        }

                    },
                    error: function (data) {
                        erroNoSistema(data);
                    },
                });
            }

            //////////////////////////////////////////////
            //função de preenchimento da POUPANÇA
            function lerPoupanca() {
                $.ajax({
                    url: window.homepath + "ajax/lerPoupanca.php",
                    method: 'POST',
                    dataType: 'json',
                    success: function (data) {
                        console.log("---------------------------------");
                        console.log("lerPoupanca");
                        console.log(data);

                        if (data.success == true) {
                            el.find('.poupanca .poupancaObjetivo').text(data.data["0"].objetivo);
                            el.find('.poupanca .poupancaObjetivo').priceFormat({
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });

                            el.find('.poupanca .poupancaTotal').text(data.data["0"].total);
                            el.find('.poupanca .poupancaTotal').priceFormat({
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });

                            carregou_item = 4;
                            if (carregou < carregouTotal) {
                                carregou = carregou + 1;
                            }
                            carregando(carregou, carregou_item);

                        } else {
                            erroNoSistema(data);
                        }
                    },
                    error: function (data) {
                        erroNoSistema(data);
                    },
                });
            }

            //////////////////////////////////////////////
            //função de preenchimento das ÚLTIMAS
            function lerUltimas() {
                el.find(".ultimasNotificacoes div").not('.ultimasNotificacoesCarregando').not('img').not('.ultimasNada').remove();
                el.find(".ultimasNada").addClass("ultimasNadaOff");
                el.find(".ultimasNotificacoesCarregando").addClass("loading_waiting");
                $.ajax({
                    url: window.homepath + "ultimas",
                    method: 'GET',
                    dataType: 'json',
                    data: { page_size: 4 },
                    beforeSend: function (data) {
                        data.setRequestHeader("Authorization", window.token);
                    },
                    success: function (data) {
                        console.log("---------------------------------");
                        console.log("lerUltimas");
                        console.log(data);

                        if (data.success == true) {
                            $.each(data.data, function(i, item) {
                                if (data.data[i].tipo_movimentacao == "entrada") {
                                    var tipo_movimentacao = "Recebeu (" + data.data[i].tipo_valor_tag + ")";
                                    var tableUltima = "entradaUltima";
                                    var dataUltima = moment.unix(data.data[i].created_at).fromNow();
                                    var dataUltimaTitle = moment.unix(data.data[i].created_at).format("DD/MM/YY HH:mm:ss");
                                } else if (data.data[i].tipo_movimentacao == "saida") {
                                    var tipo_movimentacao = "Gastou (" + data.data[i].tipo_valor_tag + ")";
                                    var tableUltima = "saidaUltima";
                                    var dataUltima = moment.unix(data.data[i].created_at).fromNow();
                                    var dataUltimaTitle = moment.unix(data.data[i].created_at).format("DD/MM/YY HH:mm:ss");
                                } else if (!data.data[i].tipo_movimentacao) {
                                    if (data.data[i].tipo_valor_tag == "compra") {
                                        var tipo_movimentacao = "Objetivo (Compra)";
                                        var tableUltima = "objetivoCompraUltima";
                                    } else if (data.data[i].tipo_valor_tag == "venda") {
                                        var tipo_movimentacao = "Objetivo (Venda)";
                                        var tableUltima = "objetivoVendaUltima";
                                    }
                                    var dataUltima = moment.unix(data.data[i].created_at).fromNow();
                                    var dataUltimaTitle = moment.unix(data.data[i].created_at).format("DD/MM/YY HH:mm:ss");
                                }

                                el.find(".ultimasNotificacoes").append("<div class='itemUltima'><span class='dataUltima tooltip' data-title='"+dataUltimaTitle+"'>" + dataUltima + "</span><span class='recebeuUltima " + tableUltima + "'>" + tipo_movimentacao + "</span><span class='tipoUltima'>" + data.data[i].tipo_valor + "</span> <span class='valorUltima'>(<span class='valorFormatUltima'>" + data.data[i].valor_total + "</span>)</span></div>");

                                el.find( ".ultimasNotificacoes .valorFormatUltima" ).priceFormat({
                                    prefix: 'R$ ',
                                    centsSeparator: ',',
                                    thousandsSeparator: '.'
                                });

                            });

                            carregou_item = 7;
                            if (carregou < carregouTotal) {
                                carregou = carregou + 1;
                            }
                            carregando(carregou, carregou_item);

                            if (data.data.length >= 1) {
                                el.find(".ultimasNada").addClass("ultimasNadaOff");
                            } else {
                                el.find(".ultimasNada").removeClass("ultimasNadaOff");
                            }

                            el.find(".ultimasNotificacoesCarregando").removeClass("loading_waiting");
                        } else {
                            erroNoSistema(data);
                        }
                    },
                    error: function (data) {
                        erroNoSistema(data);
                    },
                });
            }

            //////////////////////////////////////////////
            //função de ordenação de ENTRADA E SAÍDA pelo valor da parcela
            $(document).on("click", ".inANDoutValor",function(e){
                el.find(".inANDoutValor").addClass("inANDoutValorLoader");
                el.find(".inANDoutData").removeClass("inANDoutDataLoader").removeClass("inANDoutDataDESC").removeClass("inANDoutDataASC");
                el.find(".inANDoutTotal").removeClass("inANDoutTotalLoader").removeClass("inANDoutTotalDESC").removeClass("inANDoutTotalASC");
                el.find(".inANDoutParcelas").removeClass("inANDoutParcelasLoader").removeClass("inANDoutParcelasDESC").removeClass("inANDoutParcelasASC");
                el.find(".inANDoutAtual").removeClass("inANDoutAtualLoader").removeClass("inANDoutAtualDESC").removeClass("inANDoutAtualASC");
                el.find(".inANDoutTipo").removeClass("inANDoutTipoLoader").removeClass("inANDoutTipoDESC").removeClass("inANDoutTipoASC");
                if (el.find(".inANDoutValor").hasClass("inANDoutValorDESC")) {
                    window.ordemEntradaESaida = "valor_parcela-asc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutValor").removeClass("inANDoutValorDESC").addClass("inANDoutValorASC");
                } else {
                    window.ordemEntradaESaida = "valor_parcela-desc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutValor").removeClass("inANDoutValorASC").addClass("inANDoutValorDESC");
                }
                lerEntradaESaida(window.pageEntradaESaida, window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
            });

            //////////////////////////////////////////////
            //função de ordenação de ENTRADA E SAÍDA pelo nome
            $(document).on("click", ".inANDoutTipo",function(e){
                el.find(".inANDoutTipo").addClass("inANDoutTipoLoader");
                el.find(".inANDoutData").removeClass("inANDoutDataLoader").removeClass("inANDoutDataDESC").removeClass("inANDoutDataASC");
                el.find(".inANDoutTotal").removeClass("inANDoutTotalLoader").removeClass("inANDoutTotalDESC").removeClass("inANDoutTotalASC");
                el.find(".inANDoutParcelas").removeClass("inANDoutParcelasLoader").removeClass("inANDoutParcelasDESC").removeClass("inANDoutParcelasASC");
                el.find(".inANDoutAtual").removeClass("inANDoutAtualLoader").removeClass("inANDoutAtualDESC").removeClass("inANDoutAtualASC");
                el.find(".inANDoutValor").removeClass("inANDoutValorLoader").removeClass("inANDoutValorDESC").removeClass("inANDoutValorASC");
                if (el.find(".inANDoutTipo").hasClass("inANDoutTipoDESC")) {
                    window.ordemEntradaESaida = "tipo_valor-desc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutTipo").removeClass("inANDoutTipoDESC").addClass("inANDoutTipoASC");
                } else {
                    window.ordemEntradaESaida = "tipo_valor-asc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutTipo").removeClass("inANDoutTipoASC").addClass("inANDoutTipoDESC");
                }
                lerEntradaESaida(window.pageEntradaESaida, window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
            });

            //////////////////////////////////////////////
            //função de ordenação de ENTRADA E SAÍDA pelo nº da parcela atual
            $(document).on("click", ".inANDoutAtual",function(e){
                el.find(".inANDoutAtual").addClass("inANDoutAtualLoader");
                el.find(".inANDoutData").removeClass("inANDoutDataLoader").removeClass("inANDoutDataDESC").removeClass("inANDoutDataASC");
                el.find(".inANDoutTotal").removeClass("inANDoutTotalLoader").removeClass("inANDoutTotalDESC").removeClass("inANDoutTotalASC");
                el.find(".inANDoutParcelas").removeClass("inANDoutParcelasLoader").removeClass("inANDoutParcelasDESC").removeClass("inANDoutParcelasASC");
                el.find(".inANDoutTipo").removeClass("inANDoutTipoLoader").removeClass("inANDoutTipoDESC").removeClass("inANDoutTipoASC");
                el.find(".inANDoutValor").removeClass("inANDoutValorLoader").removeClass("inANDoutValorDESC").removeClass("inANDoutValorASC");
                if (el.find(".inANDoutAtual").hasClass("inANDoutAtualDESC")) {
                    window.ordemEntradaESaida = "parcela_atual-asc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutAtual").removeClass("inANDoutAtualDESC").addClass("inANDoutAtualASC");
                } else {
                    window.ordemEntradaESaida = "parcela_atual-desc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutAtual").removeClass("inANDoutAtualASC").addClass("inANDoutAtualDESC");
                }
                lerEntradaESaida(window.pageEntradaESaida, window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
            });

            //////////////////////////////////////////////
            //função de ordenação de ENTRADA E SAÍDA pelo nº de parcelas
            $(document).on("click", ".inANDoutParcelas",function(e){
                el.find(".inANDoutParcelas").addClass("inANDoutParcelasLoader");
                el.find(".inANDoutData").removeClass("inANDoutDataLoader").removeClass("inANDoutDataDESC").removeClass("inANDoutDataASC");
                el.find(".inANDoutTotal").removeClass("inANDoutTotalLoader").removeClass("inANDoutTotalDESC").removeClass("inANDoutTotalASC");
                el.find(".inANDoutAtual").removeClass("inANDoutAtualLoader").removeClass("inANDoutAtualDESC").removeClass("inANDoutAtualASC");
                el.find(".inANDoutTipo").removeClass("inANDoutTipoLoader").removeClass("inANDoutTipoDESC").removeClass("inANDoutTipoASC");
                el.find(".inANDoutValor").removeClass("inANDoutValorLoader").removeClass("inANDoutValorDESC").removeClass("inANDoutValorASC");
                if (el.find(".inANDoutParcelas").hasClass("inANDoutParcelasDESC")) {
                    window.ordemEntradaESaida = "n_parcelas-asc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutParcelas").removeClass("inANDoutParcelasDESC").addClass("inANDoutParcelasASC");
                } else {
                    window.ordemEntradaESaida = "n_parcelas-desc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutParcelas").removeClass("inANDoutParcelasASC").addClass("inANDoutParcelasDESC");
                }
                lerEntradaESaida(window.pageEntradaESaida, window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
            });

            //////////////////////////////////////////////
            //função de ordenação de ENTRADA E SAÍDA pelo valor
            $(document).on("click", ".inANDoutTotal",function(e){
                el.find(".inANDoutTotal").addClass("inANDoutTotalLoader");
                el.find(".inANDoutData").removeClass("inANDoutDataLoader").removeClass("inANDoutDataDESC").removeClass("inANDoutDataASC");
                el.find(".inANDoutParcelas").removeClass("inANDoutParcelasLoader").removeClass("inANDoutParcelasDESC").removeClass("inANDoutParcelasASC");
                el.find(".inANDoutAtual").removeClass("inANDoutAtualLoader").removeClass("inANDoutAtualDESC").removeClass("inANDoutAtualASC");
                el.find(".inANDoutTipo").removeClass("inANDoutTipoLoader").removeClass("inANDoutTipoDESC").removeClass("inANDoutTipoASC");
                el.find(".inANDoutValor").removeClass("inANDoutValorLoader").removeClass("inANDoutValorDESC").removeClass("inANDoutValorASC");
                if (el.find(".inANDoutTotal").hasClass("inANDoutTotalDESC")) {
                    window.ordemEntradaESaida = "valor_total-asc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutTotal").removeClass("inANDoutTotalDESC").addClass("inANDoutTotalASC");
                } else {
                    window.ordemEntradaESaida = "valor_total-desc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutTotal").removeClass("inANDoutTotalASC").addClass("inANDoutTotalDESC");
                }
                lerEntradaESaida(window.pageEntradaESaida, window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
            });

            //////////////////////////////////////////////
            //função de ordenação de data de ENTRADA/SAÍDA
            $(document).on("click", ".inANDoutData",function(e){
                el.find(".inANDoutData").addClass("inANDoutDataLoader");
                el.find(".inANDoutTotal").removeClass("inANDoutTotalLoader").removeClass("inANDoutTotalDESC").removeClass("inANDoutTotalASC");
                el.find(".inANDoutParcelas").removeClass("inANDoutParcelasLoader").removeClass("inANDoutParcelasDESC").removeClass("inANDoutParcelasASC");
                el.find(".inANDoutAtual").removeClass("inANDoutAtualLoader").removeClass("inANDoutAtualDESC").removeClass("inANDoutAtualASC");
                el.find(".inANDoutTipo").removeClass("inANDoutTipoLoader").removeClass("inANDoutTipoDESC").removeClass("inANDoutTipoASC");
                el.find(".inANDoutValor").removeClass("inANDoutValorLoader").removeClass("inANDoutValorDESC").removeClass("inANDoutValorASC");
                if (el.find(".inANDoutData").hasClass("inANDoutDataASC")) {
                    window.ordemEntradaESaida = "entrada_data-asc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutData").removeClass("inANDoutDataASC").addClass("inANDoutDataDESC");
                } else {
                    window.ordemEntradaESaida = "entrada_data-desc";
                    if (el.find(".inANDoutPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageEntradaESaida = el.find(".inANDoutPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageEntradaESaida = 1;
                    }
                    el.find(".inANDoutData").removeClass("inANDoutDataDESC").addClass("inANDoutDataASC");
                }
                lerEntradaESaida(window.pageEntradaESaida, window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
            });

            //////////////////////////////////////////////
            //click na paginação de ENTRADA E SAÍDA
            $(document).on("click", ".inANDoutPaginacao span",function(e){
                window.pageEntradaESaida = e.target.innerText;
                lerEntradaESaida(window.pageEntradaESaida, window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
            });

            //////////////////////////////////////////////
            //função de preenchimento de ENTRADA E SAÍDA
            function lerEntradaESaida(pagina, ordenacao = "padrao") {
                if (ordenacao == "padrao") {
                    el.find(".inANDoutTotal").removeClass("inANDoutTotalDESC").removeClass("inANDoutTotalASC");
                    el.find(".inANDoutData").removeClass("inANDoutDataDESC").removeClass("inANDoutDataASC");
                }
                el.find(".dados").not('.template').remove();
                el.find(".inANDoutPaginacao").addClass("paginacaoTravada");
                el.find('.inANDout .inANDoutNada').addClass("inANDoutNadaOff");
                el.find(".inANDoutCarregando").addClass("loading_waiting");
                el.addClass("travado");
                el.find(".inANDoutTotalResultados").slideUp();
                el.find(".inANDoutTotalResultados").promise().done(function(){
                    $.ajax({
                        url: window.homepath + "movimentacoes",
                        method: 'GET',
                        dataType: 'json',
                        data: { page: pagina, page_size: window.itemsPageEntradaESaida, orderBy: ordenacao, data_inicio: window.firstTimestamp, data_fim: window.lastTimestamp },
                        beforeSend: function (data) {
                            data.setRequestHeader("Authorization", window.token);
                        },
                        success: function (data) {
                            console.log("---------------------------------");
                            console.log("lerEntradaESaida");
                            console.log(data);

                            if (data.success == true) {
                                window.pageEntradaESaida = pagina;
                                var paginas = data.pagination.total_pages;
                                if (paginas > 1) {
                                    el.find(".inANDoutPaginacao").html("Página: ");
                                    for (i = 1; i <= paginas; i++) {
                                        if (i < paginas) {
                                            el.find(".inANDoutPaginacao").append("<span id='inANDoutPagina"+i+"'>" + i + "</span>, ");
                                        } else {
                                            el.find(".inANDoutPaginacao").append("<span id='inANDoutPagina"+i+"'>" + i + "</span>");
                                        }
                                        if (pagina == i) {
                                            el.find("#inANDoutPagina"+i).addClass("paginaSelecionada");
                                        }
                                    }
                                } else {
                                    el.find(".inANDoutPaginacao").html("");
                                }

                                el.find(".inANDoutTotalResultados").slideDown();
                                var mes = el.find('.mes').attr("data-mes-extenso");
                                if (data.pagination.total_in_page == "") {
                                    var itens_sendo_exibidos = "0";
                                } else {
                                    var itens_sendo_exibidos = data.pagination.total_in_page;
                                }
                                if (data.pagination.total == "") {
                                    var contagem = "0";
                                } else {
                                    var contagem = data.pagination.total;
                                }

                                if (mes == "Todos") {
                                    var mes_extenso = "de todas as datas.";
                                } else {
                                    var mes_extenso = "do mês de " + mes + ".";
                                }
                                if (itens_sendo_exibidos == 1) {
                                    if (contagem == 1) {
                                        el.find(".inANDoutTotalResultados").html("Total de " + itens_sendo_exibidos + " item sendo exibidos de um total de " + contagem + " item " + mes_extenso);
                                    } else {
                                        el.find(".inANDoutTotalResultados").html("Total de " + itens_sendo_exibidos + " item sendo exibidos de um total de " + contagem + " itens " + mes_extenso);
                                    }
                                } else {
                                    if (contagem == 1) {
                                        el.find(".inANDoutTotalResultados").html("Total de " + itens_sendo_exibidos + " itens sendo exibidos de um total de " + contagem + " item " + mes_extenso);
                                    } else {
                                        el.find(".inANDoutTotalResultados").html("Total de " + itens_sendo_exibidos + " itens sendo exibidos de um total de " + contagem + " itens " + mes_extenso);
                                    }
                                }

                                $.each(data.data, function(i, item) {
                                    if (data.data[i].tipo_movimentacao == "entrada") {
                                        var template = el.find("tr.dados.template").clone().appendTo(el.find( ".inANDout table")).removeClass("template").addClass("dadosEntrada");
                                    } else if (data.data[i].tipo_movimentacao == "saida") {
                                        var template = el.find("tr.dados.template").clone().appendTo(el.find( ".inANDout table")).removeClass("template").addClass("dadosSaida");
                                    }

                                    var totalRes = data.data[i].valor_total;

                                    template.find(".dadosTotal").html(totalRes);
                                    template.find( ".dadosTotal" ).priceFormat({
                                        prefix: 'R$ ',
                                        centsSeparator: ',',
                                        thousandsSeparator: '.'
                                    });

                                    template.find( ".dadosTipo" ).html("<span class='tag'>" + data.data[i].tipo_valor_tag + "</span> <span class='valor'>" + data.data[i].tipo_valor + "</span>");
                                    template.find( ".dadosParcelas" ).html(data.data[i].n_parcelas);


                                    template.find( ".dadosValor" ).html(data.data[i].valor_parcela);
                                    template.find( ".dadosValor" ).priceFormat({
                                        prefix: 'R$ ',
                                        centsSeparator: ',',
                                        thousandsSeparator: '.'
                                    });

                                    var dateCreated = moment.unix(data.data[i].created_at).format("DD/MM/YY");
                                    template.find( ".dadosData" ).html(dateCreated);
                                    var dateCreatedTooltip = moment.unix(data.data[i].created_at).format("DD/MM/YY HH:mm:ss");
                                    template.find( ".dadosData" ).attr("data-title", dateCreatedTooltip);

                                    var dateAdicionado = moment.unix(data.data[i].created_at).format("DD/MM/YY");
                                    template.find( ".dadosCriadoEm" ).html(dateAdicionado);
                                    var dateAdicionadoTooltip = moment.unix(data.data[i].created_at).format("DD/MM/YY");
                                    template.find( ".dadosCriadoEm" ).attr("data-title", dateAdicionadoTooltip);


                                    var parcelaNumero = data.data[i].n_parcelas;
                                    var parcelaAtual = data.data[i].parcela_atual;
                                    var proximoVencimento = moment.unix(data.data[i].data_vencimento_parcela).format("DD/MM/YY");

                                    if (parcelaNumero > 1) {
                                        template.find( ".dadosAtual" ).html(parcelaAtual);
                                    } else {
                                        template.find( ".dadosAtual" ).html("-");
                                        template.find( ".dadosParcelas" ).html("-");
                                        template.find( ".dadosValor" ).html("-");
                                        template.addClass("semParcelas");
                                    }

                                    if (!template.hasClass("semParcelas") && parcelaAtual >= parcelaNumero) {
                                        template.addClass("vencido");
                                        template.find( ".dadosAtual" ).addClass("tooltip").attr("data-title", "Parcelas já finalizadas!");
                                    } else if (!template.hasClass("semParcelas") && parcelaAtual < parcelaNumero) {
                                        template.find( ".dadosAtual" ).addClass("tooltip").attr("data-title", "Próximo vencimento em: " + proximoVencimento);
                                    } else if (template.hasClass("semParcelas")) {
                                        template.find( ".dadosAtual" ).removeClass("tooltip");
                                    }

                                    template.attr("id", data.data[i].id);
                                });

                                carregou_item = 1;
                                if (carregou < carregouTotal) {
                                    carregou = carregou + 1;
                                }
                                carregando(carregou, carregou_item);

                                if (carregou >= carregouTotal) {
                                    lerTotaisEntradaESaida();
                                }

                                if (data.data.length >= 1) {
                                    el.find('.inANDout .inANDoutNada').addClass("inANDoutNadaOff");
                                } else {
                                    el.find('.inANDout .inANDoutNada').removeClass("inANDoutNadaOff");
                                }
                                el.find(".inANDoutCarregando").removeClass("loading_waiting");

                                el.find(".inANDoutData").removeClass("inANDoutDataLoader");
                                el.find(".inANDoutTotal").removeClass("inANDoutTotalLoader");
                                el.find(".inANDoutParcelas").removeClass("inANDoutParcelasLoader");
                                el.find(".inANDoutAtual").removeClass("inANDoutAtualLoader");
                                el.find(".inANDoutValor").removeClass("inANDoutValorLoader");
                                el.find(".inANDoutTipo").removeClass("inANDoutTipoLoader");
                                el.find(".inANDoutPaginacao").removeClass("paginacaoTravada");
                            } else {
                                erroNoSistema(data);
                            }
                        },
                        error: function (data) {
                            erroNoSistema(data);
                        }
                    }).done(function() {
                        el.removeClass("travado");
                    });
                });
            }

            //////////////////////////////////////////////
            //função de preenchimento de TOTAIS em ENTRADA E SAÍDA
            function lerTotaisEntradaESaida() {
                el.find(".totalDiv").slideUp();
                el.find(".totalDiv").promise().done(function(){
                    $.ajax({
                        url: window.homepath + "movimentacoes/totais",
                        method: 'GET',
                        dataType: 'json',
                        data: { page: window.pageEntradaESaida, page_size: window.itemsPageEntradaESaida, data_inicio: window.firstTimestamp, data_fim: window.lastTimestamp },
                        beforeSend: function (data) {
                            data.setRequestHeader("Authorization", window.token);
                        },
                        success: function (data) {
                            console.log("---------------------------------");
                            console.log("lerTotaisEntradaESaida");
                            console.log(data);

                            if (data.success == true) {
                                el.find(".totalDivTotal .totalDiv_valor").html(data.extras.totalValoresEntrada);
                            } else {
                                el.find(".totalDivTotal .totalDiv_valor").html("0");
                            }
                            //TOTAIS
                            el.find(".totalDivTotal .totalDiv_valor").priceFormat({
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });

                            if (data.success == true) {
                                el.find(".totalDivGasto .totalDiv_valor").html(data.extras.totalValoresSaida);
                            } else {
                                el.find(".totalDivGasto .totalDiv_valor").html("0");
                            }
                            //TOTAIS
                            el.find(".totalDivGasto .totalDiv_valor").priceFormat({
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });

                            //TOTAIS
                            var disponivel = data.extras.totalValoresEntrada - data.extras.totalValoresSaida;
                            el.find(".totalDivDisponivel .totalDiv_valor").html(disponivel);
                            el.find(".totalDivDisponivel .totalDiv_valor").priceFormat({
                                allowNegative: true,
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });
                            el.find(".totalDiv").slideDown();

                            if (data.success == true) {
                                el.find(".totalDivReceber .totalDiv_valor").html(data.extras.totalAReceber);
                            } else {
                                el.find(".totalDivReceber .totalDiv_valor").html("0");
                            }
                            //TOTAIS
                            el.find(".totalDivReceber .totalDiv_valor").priceFormat({
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });

                            if (data.success == true) {
                                el.find(".totalDivPagar .totalDiv_valor").html(data.extras.totalAPagar);
                            } else {
                                el.find(".totalDivPagar .totalDiv_valor").html("0");
                            }
                            //TOTAIS
                            el.find(".totalDivPagar .totalDiv_valor").priceFormat({
                                prefix: 'R$ ',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });

                                                        carregou_item = 5;
                            if (carregou < carregouTotal) {
                                carregou = carregou + 1;
                            }
                            carregando(carregou, carregou_item);

                        },
                        error: function (data) {
                            erroNoSistema(data);
                        },
                    });
                });
            }


            //////////////////////////////////////////////
            //função de ordenação de OBJETIVOS pelo prazo
            $(document).on("click", ".objetivosPrazo",function(e){
                el.find(".objetivosPrazo").addClass("objetivosPrazoLoader");
                el.find(".objetivosTotal").removeClass("objetivosTotalLoader").removeClass("objetivosTotalDESC").removeClass("objetivosTotalASC");
                el.find(".objetivosTipo").removeClass("objetivosTipoLoader").removeClass("objetivosTipoDESC").removeClass("objetivosTipoASC");
                if (el.find(".objetivosPrazo").hasClass("objetivosPrazoDESC")) {
                    window.ordemObjetivos = "data_prevista-desc";
                    if (el.find(".objetivosPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageObjetivos = el.find(".objetivosPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageObjetivos = 1;
                    }
                    el.find(".objetivosPrazo").removeClass("objetivosPrazoDESC").addClass("objetivosPrazoASC");
                } else {
                    window.ordemObjetivos = "data_prevista-asc";
                    if (el.find(".objetivosPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageObjetivos = el.find(".objetivosPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageObjetivos = 1;
                    }
                    el.find(".objetivosPrazo").removeClass("objetivosPrazoASC").addClass("objetivosPrazoDESC");
                }
                lerObjetivos(window.pageObjetivos, window.ordemObjetivos);
            });

            //////////////////////////////////////////////
            //função de ordenação de OBJETIVOS pelo tipo
            $(document).on("click", ".objetivosTipo",function(e){
                el.find(".objetivosTipo").addClass("objetivosTipoLoader");
                el.find(".objetivosTotal").removeClass("objetivosTotalLoader").removeClass("objetivosTotalDESC").removeClass("objetivosTotalASC");
                el.find(".objetivosPrazo").removeClass("objetivosPrazoLoader").removeClass("objetivosPrazoDESC").removeClass("objetivosPrazoASC");
                if (el.find(".objetivosTipo").hasClass("objetivosTipoDESC")) {
                    window.ordemObjetivos = "tipo_valor-desc";
                    if (el.find(".objetivosPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageObjetivos = el.find(".objetivosPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageObjetivos = 1;
                    }
                    el.find(".objetivosTipo").removeClass("objetivosTipoDESC").addClass("objetivosTipoASC");
                } else {
                    window.ordemObjetivos = "tipo_valor-asc";
                    if (el.find(".objetivosPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageObjetivos = el.find(".objetivosPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageObjetivos = 1;
                    }
                    el.find(".objetivosTipo").removeClass("objetivosTipoASC").addClass("objetivosTipoDESC");
                }
                lerObjetivos(window.pageObjetivos, window.ordemObjetivos);
            });

            //////////////////////////////////////////////
            //função de ordenação de OBJETIVOS pelo valor
            $(document).on("click", ".objetivosTotal",function(e){
                el.find(".objetivosTotal").addClass("objetivosTotalLoader");
                el.find(".objetivosPrazo").removeClass("objetivosPrazoLoader").removeClass("objetivosPrazoDESC").removeClass("objetivosPrazoASC");
                el.find(".objetivosTipo").removeClass("objetivosTipoLoader").removeClass("objetivosTipoDESC").removeClass("objetivosTipoASC");
                if (el.find(".objetivosTotal").hasClass("objetivosTotalDESC")) {
                    window.ordemObjetivos = "valor_total-asc";
                    if (el.find(".objetivosPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageObjetivos = el.find(".objetivosPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageObjetivos = 1;
                    }
                    el.find(".objetivosTotal").removeClass("objetivosTotalDESC").addClass("objetivosTotalASC");
                } else {
                    window.ordemObjetivos = "valor_total-desc";
                    if (el.find(".objetivosPaginacao span.paginaSelecionada").length >= 1) {
                        window.pageObjetivos = el.find(".objetivosPaginacao span.paginaSelecionada").text();
                    } else {
                        window.pageObjetivos = 1;
                    }
                    el.find(".objetivosTotal").removeClass("objetivosTotalASC").addClass("objetivosTotalDESC");
                }
                lerObjetivos(window.pageObjetivos, window.ordemObjetivos);
            });

            //////////////////////////////////////////////
            //função de click na páginação de OBJETIVOS para ordenação
            $(document).on("click", ".objetivosPaginacao span",function(e){
                window.pageObjetivos = e.target.innerText;
            });

            //////////////////////////////////////////////
            //função de preenchimento de OBJETIVOS
            function lerObjetivos(pagina, ordenacao = "padrao") {
                if (ordenacao == "padrao") {
                    el.find(".objetivosPrazo").removeClass("objetivosPrazoDESC").removeClass("objetivosPrazoASC");
                    el.find(".objetivosTotal").removeClass("objetivosTotalDESC").removeClass("objetivosTotalASC");
                }
                el.find(".objetivosDados").not('.template').remove();
                el.find('.objetivos .objetivosNada').addClass("objetivosNadaOff");
                el.find(".objetivosCarregando").addClass("loading_waiting");
                el.find(".objetivosPaginacao").addClass("objetivosPaginacaoTravada");
                el.addClass("travado");
                el.find(".objetivosTotalResultados").slideUp();
                el.find(".objetivosTotalResultados").promise().done(function(){
                    $.ajax({
                        url: window.homepath + "objetivos",
                        method: 'GET',
                        dataType: 'json',
                        data: { page: pagina, orderBy: ordenacao, page_size: window.itemsPageObjetivos},
                        beforeSend: function (data) {
                            data.setRequestHeader("Authorization", window.token);
                        },
                        success: function (data) {
                            console.log("---------------------------------");
                            console.log("lerObjetivos");
                            console.log(data);


                            if (data.success == true) {
                                window.pageObjetivos = pagina;
                                var paginas = data.pagination.total_pages;
                                if (paginas > 1) {
                                    el.find(".objetivosPaginacao").html("Página: ");
                                    for (i = 1; i <= paginas; i++) {
                                            if (i < paginas) {
                                                el.find(".objetivosPaginacao").append("<span id='objetivosPagina"+i+"'>" + i + "</span>, ");
                                            } else {
                                                el.find(".objetivosPaginacao").append("<span id='objetivosPagina"+i+"'>" + i + "</span>");
                                            }
                                            if (pagina == i) {
                                                el.find("#objetivosPagina"+i).addClass("paginaSelecionada");
                                            }
                                    }
                                } else {
                                    el.find(".objetivosPaginacao").html("");
                                }

                                el.find(".objetivosTotalResultados").slideDown();
                                if (data.pagination.total_in_page == "") {
                                    var itens_sendo_exibidos = "0";
                                } else {
                                    var itens_sendo_exibidos = data.pagination.total_in_page;
                                }
                                if (data.pagination.total == "") {
                                    var contagem = "0";
                                } else {
                                    var contagem = data.pagination.total;
                                }
                                if (itens_sendo_exibidos == 1) {
                                    if (contagem == 1) {
                                        el.find(".objetivosTotalResultados").html("Total de " + itens_sendo_exibidos + " item sendo exibidos de um total de " + contagem + " item.");
                                    } else {
                                        el.find(".objetivosTotalResultados").html("Total de " + itens_sendo_exibidos + " item sendo exibidos de um total de " + contagem + " itens.");
                                    }
                                } else {
                                    if (contagem == 1) {
                                        el.find(".objetivosTotalResultados").html("Total de " + itens_sendo_exibidos + " itens sendo exibidos de um total de " + contagem + " item.");
                                    } else {
                                        el.find(".objetivosTotalResultados").html("Total de " + itens_sendo_exibidos + " itens sendo exibidos de um total de " + contagem + " itens.");
                                    }
                                }

                                $.each(data.data, function(i, item) {

                                    if (data.data[i].tipo_valor_tag == "compra") {
                                        var template = el.find("tr.objetivosDados.template").clone().appendTo(el.find(".objetivos table")).removeClass("template").addClass("objetivosDadosEntrada");
                                    } else if (data.data[i].tipo_valor_tag == "venda") {
                                        var template = el.find("tr.objetivosDados.template").clone().appendTo(el.find(".objetivos table")).removeClass("template").addClass("objetivosDadosSaida");
                                    }

                                    template.find( ".objetivosDadosTipo" ).html("<span class='tag'>" + data.data[i].tipo_valor_tag + "</span> <span class='valor'>" + data.data[i].tipo_valor + "</span>");
                                    template.find( ".objetivosDadosTotal" ).html(data.data[i].valor_total);
                                    template.find( ".objetivosDadosTotal" ).priceFormat({
                                        prefix: 'R$ ',
                                        centsSeparator: ',',
                                        thousandsSeparator: '.'
                                    });

                                    var dataPrevisao = new Date(toDate(data.data[i].data_prevista));
                                    var dataAtual = new Date();
                                    var dataConta = Math.abs(dataAtual.getTime() - dataPrevisao.getTime());
                                    var faltam = Math.ceil(dataConta / (1000 * 3600 * 24));
                                    template.find( ".objetivosDadosPrevisao" ).html(faltam + " dias");
                                    template.find( ".objetivosDadosPrevisao" ).attr("data-title", toDateBR(data.data[i].data_prevista));
                                    template.find( ".objetivosDadosPrevisao" ).attr("date", toDateBR(data.data[i].data_prevista));
                                    
                                    var now = Math.round(+new Date()/1000);
                                    if (data.data[i].data_prevista < now) {
                                        template.find( ".objetivosDadosPrevisao" ).css("color", "red");
                                        template.find( ".objetivosDadosPrevisao" ).html("0 dias <span class='icon-notification'></span>");
                                        template.find( ".dadosC" ).css("pointer-events", "none").css("opacity", "0.5");
                                    }

                                    template.attr("id", data.data[i].id);

                                });

                                carregou_item = 6;
                                if (carregou < carregouTotal) {
                                    carregou = carregou + 1;
                                }
                                carregando(carregou, carregou_item);


                                if (data.data.length >= 1) {
                                    el.find('.objetivos .objetivosNada').addClass("objetivosNadaOff");
                                } else {
                                    el.find('.objetivos .objetivosNada').removeClass("objetivosNadaOff");
                                }
                                el.find(".objetivosCarregando").removeClass("loading_waiting");

                                el.find(".objetivosTipo").removeClass("objetivosTipoLoader");
                                el.find(".objetivosPrazo").removeClass("objetivosPrazoLoader");
                                el.find(".objetivosTotal").removeClass("objetivosTotalLoader");
                                el.find(".objetivosPaginacao").removeClass("objetivosPaginacaoTravada");
                            } else {
                                erroNoSistema(data);
                            }
                        },
                        error: function (data) {
                            erroNoSistema(data);
                        },
                    }).done(function() {
                        el.removeClass("travado");
                    });
                });
            }

            //////////////////////////////////////////////
            //click na paginação de OBJETIVOS
            $(document).on("click", ".objetivosPaginacao span",function(event){
                lerObjetivos($(this).attr("id").replace('objetivosPagina',''), window.ordemObjetivos);
            });

            //////////////////////////////////////////////
            //função de delete de ENTRADA E SAÍDA
            $(document).on("click", ".inANDout .dados:not('.editando') .dadosX",function(e){
                el.find(".tooltip").trigger('mouseout');
                el.find(".dialogSimNao").addClass('active');
                el.find(".dialogSimNao .sim").attr("data-id", $(this).parent().parent().attr("id"));
                el.find(".dialogSimNao .sim").attr("data-class", "movimentacao");
                el.find(".dialogSimNao .itemConfirm .tag").html($(this).parent().parent().find(".dadosTipo .tag").text());
                el.find(".dialogSimNao .itemConfirm .valor").html($(this).parent().parent().find(".dadosTipo .valor").text());
                el.find(".dialogSimNao .itemConfirm .date").html("Cadastrado em: <span>" + $(this).parent().parent().find(".dadosData").attr("data-title") + "</span>");
                el.find(".dialogSimNao .itemConfirm .value span").html($(this).parent().parent().find(".dadosTotal").text());
                if ($(this).parent().parent().hasClass("dadosEntrada")){
                    el.find(".dialogSimNao .itemConfirm .tipo").html("Entrada de Valores");
                } else if ($(this).parent().parent().hasClass("dadosSaida")){
                    el.find(".dialogSimNao .itemConfirm .tipo").html("Saída de Valores");
                }
            });

            $(document).on("click", ".dialogSimNao .nao",function(e){
                el.find(".dialogSimNao").removeClass('active');
            });

            $(document).on("click", ".dialogSimNao .sim",function(e){
                if (el.find(".dialogSimNao .sim").attr("data-class") == "movimentacao"){
                    el.find(".dialogSimNao").removeClass('active');
                    deletarEntradaESaida($(this).attr("data-id"));
                }
            });

            function deletarEntradaESaida(id) {
                $.ajax({
                    url: window.homepath + "movimentacoes/" + id,
                    method: 'DELETE',
                    dataType: 'json',
                    data: {},
                    beforeSend: function (data) {
                        data.setRequestHeader("Authorization", window.token);
                    },
                    success: function (data) {
                        console.log("---------------------------------");
                        console.log("deletarEntradaESaida");
                        console.log(data);

                        if (data.success == true) {
                            if (el.find(".dados").not(".template").length > 1) {
                                lerEntradaESaida(window.pageEntradaESaida, window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
                            } else {
                                lerEntradaESaida("1", window.ordemEntradaESaida, window.firstTimestamp, window.lastTimestamp);
                            }

                            lerUltimas();
                        } else {
                            if (typeof(data.message) == "object"){
                                $.each(data.message, function(i, item) {
                                    tooltipalertTop(el.find("#"+id+" .dadosOpcoes .dadosX"), item);
                                });
                            } else {
                                tooltipalertTop(el.find("#"+id+" .dadosOpcoes .dadosX"), data.message);
                            }
                        }
                    },
                    error: function (data) {
                        console.log("---------------------------------");
                        console.log("deletarEntradaESaida");
                        console.log("ERRO:");
                        console.log(data);
                        tooltipalertTop(el.find("#"+id+" .dadosOpcoes .dadosX"), 'Erro no sistema, tente mais tarde.');
                    },
                });
            }

            //////////////////////////////////////////////
            //função de delete de OBJETIVOS
            $(document).on("click", ".objetivos .objetivosDados:not('.objetivosEditando') .dadosX",function(e){
                el.find(".tooltip").trigger('mouseout');
                el.find(".dialogSimNao").addClass('active');
                el.find(".dialogSimNao .sim").attr("data-id", $(this).parent().parent().attr("id"));
                el.find(".dialogSimNao .sim").attr("data-class", "objetivos");
                el.find(".dialogSimNao .itemConfirm .tag").html($(this).parent().parent().find(".objetivosDadosTipo .tag").text());
                el.find(".dialogSimNao .itemConfirm .valor").html($(this).parent().parent().find(".objetivosDadosTipo .valor").text());
                el.find(".dialogSimNao .itemConfirm .date").html("Prazo termina em: <span>" + $(this).parent().parent().find(".objetivosDadosPrevisao").attr("data-title") + "</span>");
                el.find(".dialogSimNao .itemConfirm .value span").html($(this).parent().parent().find(".objetivosDadosTotal").text());
                el.find(".dialogSimNao .itemConfirm .tipo").html("Objetivos");
            });

            $(document).on("click", ".dialogSimNao .nao",function(e){
                el.find(".dialogSimNao").removeClass('active');
            });

            $(document).on("click", ".dialogSimNao .sim",function(e){
                if (el.find(".dialogSimNao .sim").attr("data-class") == "objetivos"){
                    el.find(".dialogSimNao").removeClass('active');
                    deletarObjetivos($(this).attr("data-id"));
                }
            });

            function deletarObjetivos(id) {
                $.ajax({
                    url: window.homepath + "objetivos/" + id,
                    method: 'DELETE',
                    dataType: 'json',
                    data: {},
                    beforeSend: function (data) {
                        data.setRequestHeader("Authorization", window.token);
                    },
                    success: function (data) {
                        console.log("---------------------------------");
                        console.log("deletarObjetivos");
                        console.log(data);

                        if (data.success == true){
                            if (el.find(".objetivosDados").not(".template").length > 1) {
                                lerObjetivos(window.pageObjetivos, window.ordemObjetivos);
                            } else {
                                lerObjetivos("1", window.ordemObjetivos);
                            }

                            lerUltimas();
                        } else {
                            if (typeof(data.message) == "object"){
                                $.each(data.message, function(i, item) {
                                    tooltipalertTop(el.find("#"+id+" .objetivosDadosOpcoes .dadosX"), item);
                                });
                            } else {
                                tooltipalertTop(el.find("#"+id+" .objetivosDadosOpcoes .dadosX"), data.message);
                            }
                        }
                    },
                    error: function (data) {
                        console.log("---------------------------------");
                        console.log("deletarObjetivos");
                        console.log("ERRO:");
                        console.log(data);
                        tooltipalertTop(el.find("#"+id+" .objetivosDadosOpcoes .dadosX"), 'Erro no sistema, tente mais tarde.');
                    },
                });
            }

            //////////////////////////////////////////////
            //editar item em ENTRADA E SAÍDA
            var dadosInputDadosTipo;
            var tagInputDadosTipo;
            var dadosInputDadosTotal;
            var dadosInputDadosParcelas;
            var dadosInputDadosAtual;
            var dadosInputDadosValor;

            $(document).on("keydown", ".campoEditavel2, .campoEditavel",function(e){
                if (e.keyCode == "27") { //tecla ESC
                    editEntradaESaida(e, $(this).parent().parent().parent(), "esc");
                } else if (e.keyCode == "9" && !e.shiftKey) {
                    el.find(".editando ." + e.currentTarget.classList["0"]).parent().next().children().select();
                    e.preventDefault();
                    return false;
                } else if (e.keyCode == "9" && e.shiftKey) {
                    el.find(".editando ." + e.currentTarget.classList["0"]).parent().prev().children().select();
                    e.preventDefault();
                    return false;
                } else if (e.keyCode == "13") { //tecla ENTER
                    voltandoEditEntradaESaida("no-esc");
                }
            });


            $(document).on("keydown", "html",function(e){
                if (el.find(".editando").length >= 1) {
                    if (e.keyCode == "27") { //tecla ESC
                        editEntradaESaida(e, el.find(".editando"), "esc");
                    } else if (e.keyCode == "13") { //tecla ENTER
                        voltandoEditEntradaESaida("no-esc");
                    }
                }
            });

            $(document).on("click", ".editando .dadosX, .editando .icon-cross",function(e){
                if ($(this)["0"].className == "icon-cross") {
                    editEntradaESaida(e, $(this).parent().parent().parent(), "esc");
                } else {
                    editEntradaESaida(e, $(this).parent().parent(), "esc");
                }
                e.preventDefault();
                return false;
            });

            $(document).on("click", ".editando .dadosE, .editando .icon-floppy-disk",function(e){
                voltandoEditEntradaESaida("no-esc");
                e.preventDefault();
                return false;
            });

            $(document).on("click", ".inANDout .dados:not('.editando') .dadosE",function(e){
                editEntradaESaida(e, $(this).parent().parent(), "no-esc");
                e.preventDefault();
                return false;
            });

            $("html").on("click", function(e) {
                if (el.find(".editando").length >= 1) {
                    if (e.target.parentElement != null) {
                        if (e.target.parentElement.className.indexOf("editando") == -1 && e.target.className.indexOf("campoEditavel") == -1 && e.target.className.indexOf("campoEditavel2") == -1 && e.target.className.indexOf("tag") == -1 && e.target.className.indexOf("dadosE") == -1 && e.target.className.indexOf("dadosX") == -1 && e.target.className.indexOf("icon-cross") == -1 && e.target.className.indexOf("icon-floppy-disk") == -1) {
                            voltandoEditEntradaESaida("no-esc");
                            $("body").find("*").each(function() {
                                $(this).off("click");
                                $(this).unbind('click');
                            });
                            e.stopPropagation();
                            e.preventDefault();
                            return false;
                        }
                    }
                } else {
                    $("body").find("*").each(function() {
                        $(this).on("click");
                        $(this).bind('click');
                    });
                }
            });

            $(document).on('dblclick', '.dados td:not(.dadosOpcoes)', function(e){
                if (el.find(".editando").length < 1) {
                    editEntradaESaida(e, $(this).parent(), "no-esc");
                    e.preventDefault();
                    return false;
                }
            });

            function editEntradaESaida(e, thisId, tecla) {
                var id = thisId["0"].id;

                if (tecla != "esc") {
                    window.voltarDadosInputDadosTipo = el.find("#"+id+" .dadosTipo .valor").text();
                    window.voltarTagInputDadosTipo = el.find("#"+id+" .dadosTipo .tag").text();
                    el.find("#"+id+" .dadosTotal").unpriceFormat();
                    window.voltarDadosInputDadosTotal = el.find("#"+id+" .dadosTotal").text().replace('R$ ', '');
                    window.voltarDadosInputDadosParcelas = el.find("#"+id+" .dadosParcelas").text();
                    window.voltarDadosInputDadosAtual = el.find("#"+id+" .dadosAtual").text();
                    el.find("#"+id+" .dadosValor").unpriceFormat();
                    window.voltarDadosInputDadosValor = el.find("#"+id+" .dadosValor").text().replace('R$ ', '');
                }

                if (tecla == "esc") {
                    console.log(id);
                    el.find(".dados#" + id).addClass("editando");
                    el.find(".editando .dadosTipoEdit").val(window.voltarDadosInputDadosTipo);
                    el.find(".editando .dadosTipo .tag").text(window.voltarTagInputDadosTipo);
                    el.find(".editando .dadosTotalEdit").val(window.voltarDadosInputDadosTotal);
                    el.find(".editando .dadosParcelasEdit").val(window.voltarDadosInputDadosParcelas);
                    el.find(".editando .dadosAtualEdit").val(window.voltarDadosInputDadosAtual);
                    el.find(".editando .dadosValorEdit").val(window.voltarDadosInputDadosValor);
                    voltandoEditEntradaESaida("esc");
                }

                if (el.find(".editando").length >= 1 && tecla != "esc") {
                    voltandoEditEntradaESaida("no-esc");
                } else if (el.find(".editando").length < 1 && tecla != "esc") {
                    //INICIO //////////////////////////////////////////////
                    el.find(".dados#" + id).addClass("editando");
                    //Campo 1 - TIPO DE VALOR
                    dadosInputDadosTipo = el.find(".editando .dadosTipo .valor").text();
                    tagInputDadosTipo = el.find(".editando .dadosTipo .tag").text();
                    el.find(".editando .dadosTipo").html("<span class='tag'>"+tagInputDadosTipo+"</span><input type='text' maxlength='23' class='dadosTipoEdit campoEditavel' value='"+dadosInputDadosTipo+"'>");
                    el.find(".editando .dadosTipoEdit").css("width", "15.8em");
                    //Campo 2 - VALOR TOTAL
                    dadosInputDadosTotal = el.find(".editando .dadosTotal").text().replace('R$ ', '');
                    el.find(".editando .dadosTotal").unpriceFormat();
                    if (el.find(".editando .dadosParcelas").text() <= 1 || el.find(".editando .dadosParcelas").text() == "-") {
                        el.find(".editando .dadosTotal").html("<input type='text' maxlength='12' class='dadosTotalEdit campoEditavel2' value='"+dadosInputDadosTotal+"'>");
                    } else {
                        el.find(".editando .dadosTotal").html("<input type='text' maxlength='12' class='dadosTotalEdit campoEditavel2' value='"+dadosInputDadosTotal+"' disabled>");
                    }
                    el.find(".editando .dadosTotalEdit").priceFormat({
                        prefix: '',
                        centsSeparator: ',',
                        thousandsSeparator: '.'
                    });
                    $(document).on("focusout", ".dadosTotalEdit",function(e){
                        if ($(this).val() == "0,00") {
                            $(this).val(dadosInputDadosTotal);
                        }
                    });
                    el.find(".editando .dadosTotalEdit").css("width", "6.9em");
                    //Campo 3 - Nº DE PARCELAS
                    dadosInputDadosParcelas = el.find(".editando .dadosParcelas").text();
                    if (dadosInputDadosParcelas > 1) {
                        el.find(".editando .dadosParcelas").html("<input type='text' maxlength='3' class='dadosParcelasEdit campoEditavel2' value='"+dadosInputDadosParcelas+"'>");
                        $(document).on("input", ".dadosParcelasEdit, .dadosAtualEdit, .dadosValorEdit",function(e){
                            if (el.find(".editando .dadosParcelasEdit").val() == 1) {
                                el.find(".editando .dadosValorEdit").prop('disabled', true);
                                el.find(".editando .dadosAtualEdit").prop('disabled', true);
                                el.find(".editando .dadosAtualEdit").val(dadosInputDadosAtual);
                                el.find(".editando .dadosValorEdit").val(dadosInputDadosValor);
                                el.find(".editando .dadosTotalEdit").prop('disabled', false);
                                el.find(".editando .dadosTotalEdit").val(dadosInputDadosTotal);
                            } else {
                                el.find(".editando .dadosValorEdit").prop('disabled', false);
                                el.find(".editando .dadosAtualEdit").prop('disabled', false);
                                el.find(".editando .dadosTotalEdit").prop('disabled', true);
                                el.find(".editando .dadosValorEdit").priceFormat({
                                    prefix: '',
                                    centsSeparator: '.',
                                    thousandsSeparator: ''
                                });
                                var dadosInputDadosValorMult = el.find(".editando .dadosValorEdit").val();
                                var dadosInputDadosParcelasMult = el.find(".editando .dadosParcelasEdit").val();
                                el.find(".editando .dadosValorEdit").priceFormat({
                                    prefix: '',
                                    centsSeparator: ',',
                                    thousandsSeparator: '.'
                                });
                                var totalRes = dadosInputDadosValorMult * dadosInputDadosParcelasMult;
                                el.find(".editando .dadosTotalEdit").val(totalRes);
                                if (el.find(".editando .dadosTotalEdit").val().indexOf('.') >= 1) {
                                    var totalRes = totalRes.toFixed(2);
                                    el.find(".editando .dadosTotalEdit").val(totalRes);
                                    var totalRes = el.find(".editando .dadosTotalEdit").val().split('.');
                                    if (totalRes[1]) {
                                        if (totalRes[1].length == 1) {
                                            totalRes[1] = totalRes[1] + "0";
                                        }
                                    }
                                    var totalRes2 = totalRes[0] + "." + totalRes[1];
                                } else {
                                    var totalRes2 = totalRes + ".00";
                                }

                                el.find(".editando .dadosTotalEdit").val(totalRes2);
                                el.find(".editando .dadosTotalEdit").priceFormat({
                                    prefix: '',
                                    centsSeparator: ',',
                                    thousandsSeparator: '.'
                                });
                            }
                        });
                        el.find(".editando .dadosParcelasEdit").mask('zZZ', {
                            translation: {
                                'z': {pattern: /[1-9]/},
                                'Z': {pattern: /[0-9]/},
                            }
                        });
                        $(document).on("keyup", ".dadosParcelasEdit",function(e){
                            if ($(this).val() == "") {
                                $(this).val(dadosInputDadosParcelas);
                            }
                        });
                        el.find(".editando .dadosParcelasEdit").css("width", "2em");
                    }
                    //Campo 4 - PARCELA ATUAL
                    dadosInputDadosAtual = el.find(".editando .dadosAtual").text();
                    if (dadosInputDadosParcelas > 1) {
                        if (el.find(".editando .dadosParcelasEdit").val() == 1) {
                            el.find(".editando .dadosAtual").html("<input type='text' maxlength='3' class='dadosAtualEdit campoEditavel2' value='"+dadosInputDadosAtual+"' disabled>");
                        } else {
                            el.find(".editando .dadosAtual").html("<input type='text' maxlength='3' class='dadosAtualEdit campoEditavel2' value='"+dadosInputDadosAtual+"'>");
                        }
                        el.find(".editando .dadosAtualEdit").mask('zZZ', {
                            translation: {
                                'z': {pattern: /[1-9]/},
                                'Z': {pattern: /[0-9]/},
                            }
                        });
                        $(document).on("keyup", ".dadosAtualEdit",function(e){
                            if ($(this).val() == "") {
                                $(this).val(dadosInputDadosParcelas);
                            }
                        });
                        el.find(".editando .dadosAtualEdit").css("width", "2em");
                        //Campo 5 - VALOR DA PARCELA
                        dadosInputDadosValor = el.find(".editando .dadosValor").text();
                        if (dadosInputDadosParcelas > 1) {
                            el.find(".editando .dadosValor").unpriceFormat();
                            if (el.find(".editando .dadosParcelasEdit").val() == 1) {
                                el.find(".editando .dadosValor").html("<input type='text' maxlength='10' class='dadosValorEdit campoEditavel2' value='0,00' disabled>");
                            } else {
                                el.find(".editando .dadosValor").html("<input type='text' maxlength='10' class='dadosValorEdit campoEditavel2' value='"+dadosInputDadosValor+"'>");
                            }
                            el.find(".editando .dadosValorEdit").priceFormat({
                                prefix: '',
                                centsSeparator: ',',
                                thousandsSeparator: '.'
                            });
                            $(document).on("focusout", ".dadosValorEdit",function(e){
                                if ($(this).val() == "0,00") {
                                    $(this).val(dadosInputDadosValor);
                                }
                            });
                            el.find(".editando .dadosValorEdit").css("width", "6.9em");
                        }
                    }
                    ////////////////////////////////////////////////////
                    el.find(".editando .dadosE span").removeClass("icon-write").addClass("icon-floppy-disk");
                    el.find(".editando .dadosX span").addClass("icon-cross").removeClass("icon-trash");
                    el.find(".tooltips").hide();
                    el.find(".tooltips").remove();
                    el.find(".editando .dadosE").attr("data-title", "Salvar");
                    el.find(".editando .dadosX").attr("data-title", "Cancelar");
                    //FIM //////////////////////////////////////////////
                    if (e.target.classList["0"] == "dadosE" || e.target.classList["0"] == "icon-write" || e.target.classList["0"] == "valor" || e.target.classList["0"] == "tag" || e.target.classList["0"] == "dadosData") {
                        el.find(".editando .dadosTipoEdit").select();
                    } else {
                        el.find(".editando ." + e.target.classList["0"] + "Edit").select();
                    }
                }

            }

            function voltandoEditEntradaESaida(tecla) {
                el.addClass("travado");
                var id = el.find(".editando").attr("id");
                if (el.find(".editando .dadosParcelasEdit").val() == 1) {
                    el.find(".editando .dadosAtualEdit").val("1");
                    el.find(".editando .dadosValorEdit").val("0,00");
                }
                el.find('.editando .dadosTotalEdit').priceFormat({
                    prefix: '',
                    centsSeparator: '',
                    thousandsSeparator: ''
                });
                valorTotalBD = el.find(".editando .dadosTotalEdit").val();
                console.log("valorTotalBD: " + valorTotalBD);
                el.find('.editando .dadosValorEdit').priceFormat({
                    prefix: '',
                    centsSeparator: '',
                    thousandsSeparator: ''
                });
                valorParcelaBD = el.find(".editando .dadosValorEdit").val();
                //INICIO //////////////////////////////////////////////
                if (el.find(".editando").length >= 1 && tecla != "esc") {
                    if (el.find(".editando")[0].className.indexOf("dadosEntrada") > -1) {
                        var tipo_movimentacao = "entrada";
                    } else if (el.find(".editando")[0].className.indexOf("dadosSaida") > -1 && tecla != "esc") {
                        var tipo_movimentacao = "saida";
                    }
                    $.ajax({
                        url: window.homepath + "movimentacoes/" + id,
                        method: 'PUT',
                        dataType: 'json',
                        data: { tipo_movimentacao: tipo_movimentacao, tipo_valor: el.find(".editando .dadosTipoEdit").val(), valor_total: valorTotalBD, n_parcelas: el.find(".editando .dadosParcelasEdit").val(), parcela_atual: el.find(".editando .dadosAtualEdit").val(), valor_parcela: valorParcelaBD },
                        beforeSend: function (data) {
                            data.setRequestHeader("Authorization", window.token);
                        },
                        success: function (data) {
                            console.log("---------------------------------");
                            console.log("editarMovimentação");
                            console.log(data);

                            if (data.success == true){
                                el.find(".dados#" + id).addClass("pisca");
                                setTimeout(function() {
                                    el.find(".dados#" + id).removeClass("pisca");
                                    el.removeClass("travado");
                                }, 1000);
                            } else {
                                erroNoSistema(data);
                            }

                        },
                        error: function (data) {
                            erroNoSistema(data);
                        },
                    });
                } else {
                    el.find(".dados#" + id).addClass("piscaEsc");
                    setTimeout(function() {
                        el.find(".dados#" + id).removeClass("piscaEsc");
                        el.removeClass("travado");
                    }, 1000);
                }
                //Campo 1 - TIPO DE VALOR
                tagInputDadosTipo = el.find(".editando .dadosTipo .tag").text();
                dadosInputDadosTipo = el.find(".editando .dadosTipoEdit").val();
                el.find(".editando .dadosTipo").html("<span class='tag'>"+tagInputDadosTipo+"</span> <span class='valor'>"+dadosInputDadosTipo+"</span>");
                //Campo 2 - VALOR TOTAL
                dadosInputDadosTotal = el.find(".editando .dadosTotalEdit").val();
                el.find(".editando .dadosTotal").html(dadosInputDadosTotal);
                el.find('.editando .dadosTotal').priceFormat({
                    prefix: 'R$ ',
                    centsSeparator: ',',
                    thousandsSeparator: '.'
                });
                //Campo 3 - Nº DE PARCELAS
                dadosInputDadosParcelas = el.find(".editando .dadosParcelasEdit").val();
                if (dadosInputDadosParcelas > 1) {
                    el.find(".editando .dadosParcelas").html(dadosInputDadosParcelas);
                }
                //Campo 4 - PARCELA ATUAL
                dadosInputDadosAtual = el.find(".editando .dadosAtualEdit").val();
                if (dadosInputDadosParcelas > 1) {
                    el.find(".editando .dadosAtual").html(dadosInputDadosAtual);
                }
                //Campo 5 - VALOR DA PARCELA
                dadosInputDadosValor = el.find(".editando .dadosValorEdit").val();
                if (dadosInputDadosParcelas > 1) {
                    el.find(".editando .dadosValor").html(dadosInputDadosValor);
                    el.find('.editando .dadosValor').priceFormat({
                        prefix: 'R$ ',
                        centsSeparator: ',',
                        thousandsSeparator: '.'
                    });
                }
                ////////////////////////////////////////////////////
                el.find(".editando .dadosE span").removeClass("icon-floppy-disk").addClass("icon-write");
                el.find(".editando .dadosX span").removeClass("icon-cross").addClass("icon-trash");
                el.find(".tooltips").hide();
                el.find(".tooltips").remove();
                el.find(".editando .dadosE").attr("data-title", "Editar");
                el.find(".editando .dadosX").attr("data-title", "Deletar");
                el.find(".dados.editando").removeClass("editando");
                lerTotaisEntradaESaida();
                lerUltimas();
                //FIM //////////////////////////////////////////////
            }


            //////////////////////////////////////////////
            //editar item em OBJETIVOS
            var dadosInputDadosTipoObjetivos;
            var tagInputDadosTipoObjetivos;
            var dadosInputDadosTotalObjetivos;
            var dadosInputDadosPrazoObjetivos;

            $(document).on("keydown", ".campoEditavelObjetivos2, .campoEditavelObjetivos",function(e){
                if (e.keyCode == "27") { //tecla ESC
                    editObjetivos(e, el.find(".objetivosEditando"), "esc");
                } else if (e.keyCode == "9" && !e.shiftKey) {
                    el.find(".objetivosEditando ." + e.currentTarget.classList["0"]).parent().next().children().select();
                    e.preventDefault();
                    return false;
                } else if (e.keyCode == "9" && e.shiftKey) {
                    el.find(".objetivosEditando ." + e.currentTarget.classList["0"]).parent().prev().children().select();
                    e.preventDefault();
                    return false;
                } else if (e.keyCode == "13") { //tecla ENTER
                    voltandoEditObjetivos("no-esc");
                }
            });


            $(document).on("keydown", "html",function(e){
                if (el.find(".objetivosEditando").length >= 1) {
                    if (e.keyCode == "27") { //tecla ESC
                        editObjetivos(e, el.find(".objetivosEditando"), "esc");
                    } else if (e.keyCode == "13") { //tecla ENTER
                        voltandoEditObjetivos("no-esc");
                    }
                }
            });

            $(document).on("click", ".objetivosEditando .dadosX, .objetivosEditando .icon-cross",function(e){
                editObjetivos(e, el.find(".objetivosEditando"), "esc");
                e.preventDefault();
                return false;
            });

            $(document).on("click", ".objetivosEditando .dadosE, .objetivosEditando .icon-floppy-disk",function(e){
                voltandoEditObjetivos("no-esc");
                e.preventDefault();
                return false;
            });

            $(document).on("click", ".objetivos .objetivosDados:not('.objetivosEditando') .dadosE",function(e){
                editObjetivos(e, $(this).parent().parent(), "no-esc");
                e.preventDefault();
                return false;
            });

            $("html").on("click", function(e) {
                if (el.find(".objetivosEditando").length >= 1) {
                    if (e.target.parentElement != null) {
                        if (e.target.parentElement.className.indexOf("objetivosEditando") == -1 && e.target.className.indexOf("campoEditavelObjetivos") == -1 && e.target.className.indexOf("campoEditavelObjetivos2") == -1 && e.target.className.indexOf("tag") == -1 && e.target.className.indexOf("dadosE") == -1 && e.target.className.indexOf("dadosX") == -1 && e.target.className.indexOf("icon-cross") == -1 && e.target.className.indexOf("icon-floppy-disk") == -1) {
                            voltandoEditObjetivos("no-esc");
                            $("body").find("*").each(function() {
                                $(this).off("click");
                                $(this).unbind('click');
                            });
                            e.stopPropagation();
                            e.preventDefault();
                            return false;
                        }
                    }
                } else {
                    $("body").find("*").each(function() {
                        $(this).on("click");
                        $(this).bind('click');
                    });
                }
            });


            $(document).on('dblclick', '.objetivosDados td:not(.objetivosDadosOpcoes)', function(e){
                if (el.find(".objetivosEditando").length < 1) {
                    editObjetivos(e, $(this).parent(), "no-esc");
                    e.preventDefault();
                    return false;
                }
            });

            function editObjetivos(e, thisId, tecla) {
                var id = thisId["0"].id;

                console.log(id);

                if (tecla != "esc") {
                    window.voltarObjetivosTipo = el.find("#"+id+" .objetivosDadosTipo .valor").html();
                    el.find("#"+id+" .objetivosDadosTotal").unpriceFormat();
                    window.voltarObjetivosTotal = el.find("#"+id+" .objetivosDadosTotal").html().replace('R$ ', '');
                    window.voltarObjetivosPrevisao = el.find("#"+id+" .objetivosDadosPrevisao").html();
                }

                if (tecla == "esc") {
                    el.find(".objetivosDados#" + id).addClass("objetivosEditando");
                    el.find(".objetivosEditando .objetivosDadosTipoEdit").val(window.voltarObjetivosTipo);
                    el.find(".objetivosEditando .objetivosDadosTotalEdit").val(window.voltarObjetivosTotal);
                    el.find(".objetivosEditando .objetivosDadosPrevisaoEdit").val(window.voltarObjetivosPrevisao);
                    voltandoEditObjetivos("esc");
                }

                if (el.find(".objetivosEditando").length >= 1 && tecla != "esc") {
                    voltandoEditObjetivos("no-esc");
                } else if (el.find(".objetivosEditando").length < 1 && tecla != "esc") {
                    //INICIO //////////////////////////////////////////////
                    el.find(".objetivosDados#" + id).addClass("objetivosEditando");
                    //Campo 1 - TIPO DE VALOR
                    dadosInputDadosTipoObjetivos = el.find(".objetivosEditando .objetivosDadosTipo .valor").text();
                    tagInputDadosTipoObjetivos = el.find(".objetivosEditando .objetivosDadosTipo .tag").text();
                    el.find(".objetivosEditando .objetivosDadosTipo").html("<span class='tag'>"+tagInputDadosTipoObjetivos+"</span><input type='text' maxlength='23' class='objetivosDadosTipoEdit campoEditavelObjetivos' value='"+dadosInputDadosTipoObjetivos+"'>");
                    el.find(".objetivosEditando .objetivosDadosTipoEdit").css("width", "15em");
                    //Campo 2 - VALOR TOTAL
                    dadosInputDadosTotalObjetivos = el.find(".objetivosEditando .objetivosDadosTotal").text().replace('R$ ', '');
                    el.find(".objetivosEditando .objetivosDadosTotal").unpriceFormat();
                    el.find(".objetivosEditando .objetivosDadosTotal").html("<input type='text' maxlength='12' class='objetivosDadosTotalEdit campoEditavelObjetivos2' value='"+dadosInputDadosTotalObjetivos+"'>");
                    el.find(".objetivosEditando .objetivosDadosTotalEdit").priceFormat({
                        prefix: '',
                        centsSeparator: ',',
                        thousandsSeparator: '.'
                    });
                    $(document).on("focusout", ".objetivosDadosTotalEdit",function(e){
                        if ($(this).val() == "0,00") {
                            $(this).val(dadosInputDadosTotalObjetivos);
                        }
                    });
                    el.find(".objetivosEditando .objetivosDadosTotalEdit").css("width", "6.9em");
                    //Campo 3 - PRAZO
                    dadosInputDadosPrazoObjetivos = el.find(".objetivosEditando .objetivosDadosPrevisao").attr("date");
                    el.find(".objetivosEditando .objetivosDadosPrevisao").html("<input type='text' maxlength='12' class='objetivosDadosPrevisaoEdit campoEditavelObjetivos2' value='"+dadosInputDadosPrazoObjetivos+"'>");
                    el.find(".objetivosEditando .objetivosDadosPrevisaoEdit").css("width", "6.5em");
                    ////////////////////////////////////////////////////
                    el.find(".objetivosEditando .dadosE span").removeClass("icon-write").addClass("icon-floppy-disk");
                    el.find(".objetivosEditando .dadosX span").addClass("icon-cross").removeClass("icon-trash");
                    el.find(".objetivosEditando .dadosC").hide();
                    el.find(".tooltips").hide();
                    el.find(".tooltips").remove();
                    el.find(".objetivosEditando .objetivosDadosPrevisao").removeClass("tooltip");
                    el.find(".objetivosEditando .dadosE").attr("data-title", "Salvar");
                    el.find(".objetivosEditando .dadosX").attr("data-title", "Cancelar");
                    //FIM //////////////////////////////////////////////
                    if (e.target.classList["0"] == "dadosE" || e.target.classList["0"] == "icon-write" || e.target.classList["0"] == "valor" || e.target.classList["0"] == "tag" || e.target.classList["0"] == "dadosData") {
                        el.find(".objetivosEditando .objetivosDadosTipoEdit").select();
                    } else {
                        el.find(".objetivosEditando ." + e.target.classList["0"] + "Edit").select();
                    }
                }

            }

            function voltandoEditObjetivos(tecla) {
                el.addClass("travado");
                var id = el.find(".objetivosEditando").attr("id");

                el.find('.objetivosEditando .objetivosDadosTotalEdit').priceFormat({
                    prefix: '',
                    centsSeparator: '',
                    thousandsSeparator: ''
                });
                var valorTotalBD = el.find(".objetivosEditando .objetivosDadosTotalEdit").val();
                var arr = el.find('.objetivosEditando .objetivosDadosPrevisaoEdit').val().split('/');
                var dataPrevista = moment(arr[2] + '/' + arr[1] + '/' + arr[0]).format("X");


                if (checkDate(arr[0], arr[1], arr[2]) === true) {
                    //INICIO //////////////////////////////////////////////
                    if (el.find(".objetivosEditando").length >= 1 && tecla != "esc") {
                        $.ajax({
                            url: window.homepath + "objetivos/" + id,
                            method: 'PUT',
                            dataType: 'json',
                            data: { tipo_valor: el.find(".objetivosEditando .objetivosDadosTipoEdit").val(), valor_total: valorTotalBD, data_prevista: dataPrevista },
                            beforeSend: function (data) {
                                data.setRequestHeader("Authorization", window.token);
                            },
                            success: function (data) {
                                console.log("---------------------------------");
                                console.log("editarObjetivos");
                                console.log(data);

                                if (data.success == true){
                                    el.find(".objetivosDados#" + id).addClass("pisca");
                                    setTimeout(function() {
                                        el.find(".objetivosDados#" + id).removeClass("pisca");
                                        el.removeClass("travado");
                                    }, 1000);
                                } else {
                                    erroNoSistema(data);
                                }

                            },
                            error: function (data) {
                                erroNoSistema(data);
                            },
                        });
                    } else {
                        el.find(".objetivosDados#" + id).addClass("piscaEsc");
                        setTimeout(function() {
                            el.find(".objetivosDados#" + id).removeClass("piscaEsc");
                            el.removeClass("travado");
                        }, 1000);
                    }
                } else {
                    tecla = "esc";
                    el.find(".objetivosDados#" + id).addClass("piscaEsc");
                    setTimeout(function() {
                        el.find(".objetivosDados#" + id).removeClass("piscaEsc");
                        el.removeClass("travado");
                    }, 1000);
                }
                    //Campo 1 - TIPO DE VALOR
                    tagInputObjetivosDadosTipo = el.find(".objetivosEditando .objetivosDadosTipo .tag").text();

                    if (tecla != "esc") {
                        dadosInputObjetivosDadosTipo = el.find(".objetivosEditando .objetivosDadosTipoEdit").val();
                    } else {
                        dadosInputObjetivosDadosTipo = window.voltarObjetivosTipo;
                    }
                    el.find(".objetivosEditando .objetivosDadosTipo").html("<span class='tag'>"+tagInputObjetivosDadosTipo+"</span> <span class='valor'>"+dadosInputObjetivosDadosTipo+"</span>");
                    //Campo 2 - VALOR TOTAL

                    if (tecla != "esc") {
                        dadosInputObjetivosDadosValorTotal = el.find(".objetivosEditando .objetivosDadosTotalEdit").val();
                    } else {
                        dadosInputObjetivosDadosValorTotal = window.voltarObjetivosTotal;
                    }
                    el.find(".objetivosEditando .objetivosDadosTotal").html(dadosInputObjetivosDadosValorTotal);
                    el.find('.objetivosEditando .objetivosDadosTotal').priceFormat({
                        prefix: 'R$ ',
                        centsSeparator: ',',
                        thousandsSeparator: '.'
                    });
                    //Campo 3 - PRAZO
                    if (tecla != "esc") {
                        var valPrevisao = el.find(".objetivosEditando .objetivosDadosPrevisaoEdit").val();
                    } else {
                        var valPrevisao = el.find(".objetivosEditando .objetivosDadosPrevisao").attr("date");
                    }
                    var arr_2 = valPrevisao.split('/');
                    var dadosInputobjetivosDadosPrevisao = moment(arr_2[2] + '/' + arr_2[1] + '/' + arr_2[0]).format("X");
                    var dataPrevisao = new Date(toDate(dadosInputobjetivosDadosPrevisao));
                    var dataAtual = new Date();
                    var dataConta = Math.abs(dataAtual.getTime() - dataPrevisao.getTime());
                    var faltam = Math.ceil(dataConta / (1000 * 3600 * 24));
                    el.find(".objetivosEditando .objetivosDadosPrevisao").html(faltam + " dias");
                    el.find(".objetivosEditando .objetivosDadosPrevisao").attr("data-title", valPrevisao);
                    el.find(".objetivosEditando .objetivosDadosPrevisao").attr("date", valPrevisao);
                    el.find(".objetivosEditando .objetivosDadosPrevisao" ).css("color", "#595c62");
                    var now = Math.round(+new Date()/1000);
                    if (dadosInputobjetivosDadosPrevisao < now) {
                        el.find(".objetivosEditando .objetivosDadosPrevisao" ).css("color", "red");
                        el.find(".objetivosEditando .objetivosDadosPrevisao" ).html("0 dias <span class='icon-notification'></span>");
                        el.find(".objetivosEditando .dadosC" ).css("pointer-events", "none").css("opacity", "0.5");
                    }
                    ////////////////////////////////////////////////////
                    el.find(".objetivosEditando .dadosE span").removeClass("icon-floppy-disk").addClass("icon-write");
                    el.find(".objetivosEditando .dadosX span").removeClass("icon-cross").addClass("icon-trash");
                    el.find(".objetivosEditando .dadosC").show();
                    el.find(".tooltips").hide();
                    el.find(".tooltips").remove();
                    el.find(".objetivosEditando .objetivosDadosPrevisao").addClass("tooltip");
                    el.find(".objetivosEditando .dadosE").attr("data-title", "Editar");
                    el.find(".objetivosEditando .dadosX").attr("data-title", "Deletar");
                    el.find(".objetivosDados").removeClass("objetivosEditando");
                    lerUltimas();
                    //FIM //////////////////////////////////////////////
            }


            //////////////////////////////////////////////
            //UTILITÁRIOS

            //////////////////////////////////////////////
            //função que verifica se data é valida
            function checkDate(day, month, year) {
               if ((month == 4 || month == 6 || month == 9 || month == 11) && day < 30) {
                   return true;
               }
               else if (month == 2 && day <= 28) {
                   return true;
               }
               else if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && day <= 31) {
                   return true;
               }
               else {
                   return false;
               }
            }

            //////////////////////////////////////////////
            //função que converte o timestamp para data
            function toDate(timestamp){
                var theDate = new Date(timestamp * 1000);
                return (theDate.getMonth()+1) + '/' + theDate.getDate() + '/' + theDate.getFullYear();
            }

            //////////////////////////////////////////////
            //função que converte o timestamp para data formato BR
            function toDateBR(timestamp, time = "noTime"){
                if (time == "noTime") {
                    var theDate = new Date(timestamp * 1000);

                    var day = ("0" + (theDate.getDate())).slice(-2);
                    var month = ("0" + (theDate.getMonth() + 1)).slice(-2);
                    var year = theDate.getFullYear();
                    var date = day + "/" + month + "/" + year;

                    return date;
                } else {
                    var theDate = new Date(timestamp * 1000);

                    var day = ("0" + (theDate.getDate())).slice(-2);
                    var month = ("0" + (theDate.getMonth() + 1)).slice(-2);
                    var year = theDate.getFullYear();

                    var hour = ("0" + (theDate.getHours())).slice(-2);;
                    var min = ("0" + (theDate.getMinutes())).slice(-2);;

                    var date = day + "/" + month + "/" + year + " " + hour + ":" + min;

                    return date;
                }
            }


        //////////////////////////////////////////////
        //FINAL DO SCRIPT
        });


        return this;
    }


})(jQuery);