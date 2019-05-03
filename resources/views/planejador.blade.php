@include('head')

<link rel="stylesheet" href="{{ asset('css/planejador.css') }}">
<link href="https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/css/datepicker.min.css" rel="stylesheet" type="text/css">
<script src="{{ asset('js/planejador.js') }}"></script>
<script src="libs/priceformat/jquery.priceformat.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/js/datepicker.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/air-datepicker/2.2.3/js/i18n/datepicker.pt-BR.js"></script>


<section id="planejador">

	<div class="tela carregando">

			<div class="esquerda">
				<div class="copyright">Criado por <a href="http://www.agenciadreamup.com.br/" target="_blank">Dream Up - Agência Digital</a></div>
				<img class="logo" src="images/logo.jpg">

				<div class="rotulo">Perfil</div>
				<div class="box box_perfil clearfix">
					<div class="foto">Sua Foto</div>
					<div class="flexGroup">
						<span class="nome tooltip" data-title=""></span>
						<span class="idade tooltip" data-title=""></span>
						<span class="profissao tooltip" data-title=""></span>
					</div>
					<div class="editarPerfil">Editar Perfil</div>
					<div class="editarPerfil sair">Sair</div>
				</div>

				<div class="rotulo">Entrada de Valores</div>
				<div class="box clearfix">
					<form class="entradaForm">
						<span class="icon-arrow-down setaEntradaTipoValor"></span>
						<input type="text" class="entradaTipoValor tooltip-alert" maxlength="23" value="Tipo de Valor">
						<span class="tag entradaTipoValorTag"></span>
						<div class="entradaTipoValorSelect selectSpecial">
							<span class="entradaTipoValorSelectOpcao1 opcoes">Salário</span>
							<span class="entradaTipoValorSelectOpcao2 opcoes">Venda</span>
							<span class="entradaTipoValorSelectOpcao3 opcoes">Bônus</span>
							<span class="entradaTipoValorSelectOpcao4 opcoes">Outros</span>
						</div>
						<input type="text" class="entradaParcelas tooltip-alert" value="Parcelas">
						<input type="text" class="entradaValorParcela tooltip-alert" value="Valor das Parcelas" maxlength="13" disabled="disabled">
						<div class="entradaVencimentoParcelaDiv">
							<input type="text" class="entradaVencimentoParcela tooltip-alert" value="Vencimento da 1ª Parcela" maxlength="13" disabled="disabled" readonly>
							<span class="icon-clock2 tooltip entradaHoje disabled" data-title="Hoje"></span>
							<span class="icon-clock22 tooltip entrada30Dias disabled" data-title="Daqui a 30 dias"></span>
						</div>
						<input type="text" class="entradaValor tooltip-alert" maxlength="15" value="Valor Total">
						<button class="entradaAdd tooltip-alert">Adicionar</button>
						<img src="images/loading.svg" class="loading entrada_loading">
					</form>
				</div>

				<div class="rotulo">Saída De Valores</div>
				<div class="box clearfix">
					<form class="saidaForm">
						<span class="icon-arrow-down setaSaidaTipoValor"></span>
						<input type="text" class="saidaTipoValor tooltip-alert" maxlength="23" value="Tipo de Valor">
						<span class="tag saidaTipoValorTag"></span>
						<div class="saidaTipoValorSelect selectSpecial">
							<span class="saidaTipoValorSelectOpcao1 opcoes">Compra</span>
							<span class="saidaTipoValorSelectOpcao2 opcoes">Cartão de Crédito</span>
							<span class="saidaTipoValorSelectOpcao3 opcoes">Empréstimo</span>
							<span class="saidaTipoValorSelectOpcao4 opcoes">Outros</span>
						</div>
						<input type="text" class="saidaParcelas tooltip-alert" value="Parcelas">
						<input type="text" class="saidaValorParcela tooltip-alert" value="Valor das Parcelas" maxlength="13" disabled="disabled">
						<div class="saidaVencimentoParcelaDiv">
							<input type="text" class="saidaVencimentoParcela tooltip-alert" value="Vencimento da 1ª Parcela" maxlength="13" disabled="disabled" readonly>
							<span class="icon-clock2 tooltip saidaHoje disabled" data-title="Hoje"></span>
							<span class="icon-clock22 tooltip saida30Dias disabled" data-title="Daqui a 30 dias"></span>
						</div>
						<input type="text" class="saidaValor tooltip-alert" maxlength="15" value="Valor Total">
						<button class="saidaAdd tooltip-alert">Adicionar</button>
						<img src="images/loading.svg" class="loading saida_loading">
					</form>
				</div>

				<div class="rotulo">Objetivos</div>
				<div class="box clearfix">
					<form class="objetivoForm">
						<span class="icon-arrow-down setaObjetivoTipoValor"></span>
						<input type="text" class="objetivoTipoValor tooltip-alert" maxlength="23" value="Tipo de Objetivo">
						<span class="tag objetivoTipoValorTag"></span>
						<div class="objetivoTipoValorSelect selectSpecial">
							<span class="objetivoTipoValorSelectOpcao1 opcoes">Compra</span>
							<span class="objetivoTipoValorSelectOpcao2 opcoes">Venda</span>
						</div>
						<input type="text" class="objetivoData tooltip-alert" placeholder="Data Prevista" readonly>
						<input type="text" class="objetivoValor tooltip-alert" maxlength="15" placeholder="Valor Total">
						<button class="objetivoAdd tooltip-alert">Adicionar</button>
						<img src="images/loading.svg" class="loading objetivo_loading">
					</form>
				</div>

				<div class="copyright">Todos Os Direitos Reservados.</div>

			</div>

			<div class="direita">
					<div class="data tooltip" data-title="Ir para mês atual">HOJE: 
					<?php 
					setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
					date_default_timezone_set('America/Sao_Paulo');

					$date = date('Y-m-d');
					echo strftime("%d de %B de %Y", strtotime($date));
					?>
					</div>
					
					<div class="ultimas">
						<div class="ultimasRotulo">Últimas</div>
						<div class="ultimasNotificacoes">
							<div class="ultimasNada">Nenhum resultado encontrado!</div>
							<img src="images/loading.svg" class="ultimasNotificacoesCarregando loading_sessions">
						</div>
						<div class="mes">Janeiro / 2016</div>
						<div class="setas">
							<span class="icon-arrow-left setaMes setaMesEsquerda tooltip" data-title="Mês Anterior"></span>
							<span class="icon-arrow-right setaMesDireita setaMes tooltip" data-title="Próximo Mês"></span>
						</div>
						<div class="mostrarTodos">Mostrar Todas as Datas</div>
					</div>

					<div class="flexGroup">
						<div class="salario">
							<div class="rotuloSecao">Salário
								<span class="salarioEditar tooltip" data-title="Editar">
									<span class="icon-write"></span>
								</span>
								<span class="salarioDataValores tooltip"  data-title="Próximo Recebimento"></span>
							</div>
							<div class="salarioMarcacao"></div>
							<hr class="barraVertical">
							<hr class="barraVertical">
							<hr class="barraVertical">
							<table>
								<tr>
									<td>Bruto</td>
									<td>Hora Extra</td>
									<td>Descontos</td>
									<td>Total</td>
								</tr>
								<tr>
								 	<td class="salarioBrutoValores">R$ 2.700,00</td>
								 	<td class="salarioHoraExtraValores">R$ 0,00</td>
								 	<td class="salarioDescontosValores">R$ 50,00</td>
								 	<td class="salarioTotalValores">R$ 2.650,00</td>
								</tr>
							</table>
						</div>

						<div class="poupanca">
							<div class="rotuloSecao">Poupança<span class="salarioEditar tooltip" data-title="Editar"><span class="icon-write"></span></div>
							<div class="poupancaMarcacao"></div>
							<div class="poupancaTotalRotulo">Total</div><div class="poupancaTotal">R$ 00,00</div>
							<hr class="barraVerticalId barraVertical4">
							<div class="poupancaObjetivoRotulo">Objetivo</div><div class="poupancaObjetivo">R$ 10.000,00</div>
						</div>
					</div>

					<div class="inANDout">
						<div class="rotuloSecao"><span class="inANDoutRotulo">Entrada E Saída</span> <span class="inANDoutTotalResultados">Total de 9 item(ns) sendo exibidos de um total de 22 item(ns).</span><span class="inANDoutPaginacao"></span></div>
						<table>
							<tr class="top">
								<td class="dadosOpcoes">
									<span class="label">Opções</span>
								</td>
								<td class="inANDoutTipo">
									<span class="label">Tipo de Valor</span>
									<span class="icon-arrow-up2"></span>
								</td>
								<td class="inANDoutTotal">
									<span class="label">Valor Total</span>
									<span class="icon-arrow-up2"></span>
								</td>
								<td class="inANDoutParcelas">
									<span class="label">Nº de Parcelas</span>
									<span class="icon-arrow-up2"></span>
								</td>
								<td class="inANDoutAtual">
									<span class="label">Parcela Atual</span>
									<span class="icon-arrow-up2"></span>
								</td>
								<td class="inANDoutValor">
									<span class="label">Valor da Parcela</span>
									<span class="icon-arrow-up2"></span>
								</td>
								<td class="inANDoutData">
									<span class="label">Data de Entrada/Saída</span>
									<span class="icon-arrow-up2"></span>
								</td>
								<td class="inANDoutCriadoEm">
									<span class="label">Criado Em</span>
									<span class="icon-arrow-up2"></span>
								</td>
							</tr>
							<tr class="dados template">
								<td class="dadosOpcoes">
									<span class="dadosX tooltip tooltip-alert-top" data-title="Deletar"><span class="icon-trash"></span></span>
									<span class="dadosE tooltip tooltip-alert-top" data-title="Editar"><span class="icon-write"></span></span>
								</td>
								<td class="dadosTipoTd"><span class="dadosTipo"></span></td>
								<td class="dadosTotalTd"><span class="dadosTotal"></span></td>
								<td class="dadosParcelasTd"><span class="dadosParcelas"></span></td>
								<td class="dadosAtualTd"><span class="dadosAtual"></span><span class="icon-notification"></span></td>
								<td class="dadosValorTd"><span class="dadosValor"></span></td>
								<td class="dadosDataTd"><span class="dadosData tooltip" data-title=""></span></td>
								<td class="dadosCriadoEmTd"><span class="dadosCriadoEm tooltip"></span></td>
							</tr>
						</table>
						<div class="inANDoutNada">Nenhum resultado encontrado!</div>
						<img src="images/loading.svg" class="inANDoutCarregando loading_sessions">
					</div>

					<div class="totais">
						<div class="totalDiv totalDivTotal">
							<span class="totalDiv_rotulo">Total Recebido:</span>
							<span class="totalDiv_valor">R$ 2.000,00</span>
						</div>
						<div class="totalDiv totalDivGasto">
							<span class="totalDiv_rotulo">Total Gasto:</span>
							<span class="totalDiv_valor">R$ 2.000,00</span>
						</div>
						<div class="totalDiv totalDivDisponivel">
							<span class="totalDiv_rotulo">Total Disponível:</span>
							<span class="totalDiv_valor">R$ 00,00</span>
						</div>
						<div class="totalDiv totalDivReceber">
							<span class="totalDiv_rotulo">Total à Receber:</span>
							<span class="totalDiv_valor">R$ 00,00</span>
						</div>
						<div class="totalDiv totalDivPagar">
							<span class="totalDiv_rotulo">Total à Pagar:</span>
							<span class="totalDiv_valor">R$ 00,00</span>
						</div>
					</div>

					<div class="flexGroup">
						<div class="objetivos">
							<div class="rotuloSecao"><span class="objetivosRotulo">Objetivos</span> <span class="objetivosTotalResultados">Total de 9 item(ns) sendo exibidos de um total de 22 item(ns).</span><span class="objetivosPaginacao"></span></div>
							<table>
								<tr class="topObjetivos">
									<td class="objetivosOpcoes">
										<span class="label">Opções</span>
									</td>
									<td class="objetivosTipo">
										<span class="label">Tipo de Objetivo</span>
										<span class="icon-arrow-up2"></span>
									</td>
									<td class="objetivosTotal">
										<span class="label">Valor Total</span>
										<span class="icon-arrow-up2"></span>
									</td>
									<td class="objetivosPrazo">
										<span class="label">Prazo</span>
										<span class="icon-arrow-up2"></span>
									</td>
								</tr>
								<tr class="objetivosDados template">
									<td class="objetivosDadosOpcoes">
										<span class="dadosX tooltip tooltip-alert-top" data-title="Deletar"><span class="icon-trash"></span></span>
										<span class="dadosE tooltip tooltip-alert-top" data-title="Editar"><span class="icon-write"></span></span>
										<span class="dadosC tooltip tooltip-alert-top" data-title="Concluir"><span class="icon-checkmark2"></span></span>
									</td>
									<td class="objetivosDadosTipoTd"><span class="objetivosDadosTipo"></span></td>
									<td class="objetivosDadosTotalTd"><span class="objetivosDadosTotal"></span></td>
									<td class="objetivosDadosPrevisaoTd" data-title=""><span class="objetivosDadosPrevisao tooltip"></span></td>
								</tr>
							</table>
							<div class="objetivosNada">Nenhum resultado encontrado!</div>
							<img src="images/loading.svg" class="objetivosCarregando loading_sessions">
						</div>

						<div class="calculadora">
							<div class="rotuloSecao">Calculadora</div>
							<table>
								<tr class="calculadoraResultados">
									<td class="calculadoraResultadosContainer calculadoraNumeros">
										<span class="calculadoraResultadosContainerSpan"></span>
									</td>
								</tr>
								<tr class="calculadoraDados">
									<td class="calculadoraC calculadoraNumeros">C</td>
									<td class="calculadoraInputTd calculadoraNumeros">
										<input class="calculadoraInput calculadoraNumeros" type="text" maxlength="10" value="0">
									</td>
									<td class="calculadoraBackspace calculadoraNumeros"><span class="icon-undo2"></span></td>
								</tr>
								<tr class="calculadoraDados">
									<td class="calculadoraOne calculadoraNumeros">1</td>
									<td class="calculadoraTwo calculadoraNumeros">2</td>
									<td class="calculadoraThree calculadoraNumeros">3</td>
									<td class="calculadoraDivide calculadoraCanto">÷</td>
								</tr>
								<tr class="calculadoraDados">
									<td class="calculadoraFour calculadoraNumeros">4</td>
									<td class="calculadoraFive calculadoraNumeros">5</td>
									<td class="calculadoraSix calculadoraNumeros">6</td>
									<td class="calculadoraMultiply calculadoraCanto">X</td>
								</tr>
								<tr class="calculadoraDados">
									<td class="calculadoraSeven calculadoraNumeros">7</td>
									<td class="calculadoraEight calculadoraNumeros">8</td>
									<td class="calculadoraNine calculadoraNumeros">9</td>
									<td class="calculadoraMinus calculadoraCanto">-</td>
								</tr>
								<tr class="calculadoraDados">
									<td class="calculadoraComma calculadoraNumeros">,</td>
									<td class="calculadoraZero calculadoraNumeros">0</td>
									<td class="calculadoraPercent calculadoraNumeros">%</td>
									<td class="calculadoraMore calculadoraCanto">+</td>
								</tr>
								<tr class="calculadoraDados">
									<td class="calculadoraEqual calculadoraNumeros">=</td>
								</tr>
							</table>
							<div class="copyright"><a href="http://www.agenciadreamup.com.br" target="_blank">www.agenciadreamup.com.br</a></div>
						</div>
					</div>
			</div>
	</div>

	<div class="load">
		<img src="images/load.svg" class="loadimg">
	</div>

	<div class="naodisponivel">
		<span class="icon-lock"></span>
		<span>Site não disponivel para tablet ou smartphone.</span>
	</div>

	<div class="erroNoSistema">
		<span class="icon-confused"></span>
		<span>Erro no sistema, tente mais tarde.</span>
	</div>

	<div class="dialogSimNao">
		<div class="dialogSimNaoBox">
			<div class="textConfirm">Tem Certeza que deseja apagar o item abaixo ?</div>
			<div class="itemConfirm">
				<div class="tipo">Entrada de Valores</div>
				<span class="tag">Cartão de Crédito</span>
				<span class="valor">Mês Corrente</span>
				<div class="value">Valor: <span>R$ 0,00</span></div>
				<div class="date">Cadastrado em: <span>22/05/2018</span></div>
			</div>
			<div class="controls">
				<button class="sim">Sim</button>
				<button class="nao">Não</button>
			</div>
		</div>
	</div>

</section>

@include('footer')