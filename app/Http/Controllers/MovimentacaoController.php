<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Requests\Movimentacao as MovimentacaoRequest;
use App\Models\Movimentacao;
use App\Helpers\Api;
use App\Helpers\Decorator;

class MovimentacaoController extends Controller
{

    public function index(MovimentacaoRequest $request)
    {
        $page_size = $request->page_size ?: 10; //para mudar o offset mandar parametro "page": 2

        $decorators = Decorator::decorators(Movimentacao::class, $request);
        $movimentacoes = Movimentacao::with($decorators);

        $orderBy = $request->orderBy;
        if ($orderBy == "parcela_atual-desc") {
            $movimentacoes = $movimentacoes->orderBy("parcela_atual", "desc");
        } else if ($orderBy == "parcela_atual-asc") {
            $movimentacoes = $movimentacoes->orderBy("parcela_atual", "asc");
        } else if ($orderBy == "valor_parcela-asc") {
            $movimentacoes = $movimentacoes->orderBy("valor_parcela", "asc");
        } else if ($orderBy == "valor_parcela-desc") {
            $movimentacoes = $movimentacoes->orderBy("valor_parcela", "desc");
        } else if ($orderBy == "tipo_valor-asc") {
            $movimentacoes = $movimentacoes->orderBy("tipo_valor", "asc");
        } else if ($orderBy == "tipo_valor-desc") {
            $movimentacoes = $movimentacoes->orderBy("tipo_valor", "desc");
        } else if ($orderBy == "parcela_atual-asc") {
            $movimentacoes = $movimentacoes->orderBy("parcela_atual", "asc");
        } else if ($orderBy == "parcela_atual-desc") {
            $movimentacoes = $movimentacoes->orderBy("parcela_atual", "desc");
        } else if ($orderBy == "n_parcelas-asc") {
            $movimentacoes = $movimentacoes->orderBy("n_parcelas", "asc");
        } else if ($orderBy == "n_parcelas-desc") {
            $movimentacoes = $movimentacoes->orderBy("n_parcelas", "desc");
        } else if ($orderBy == "valor_total-asc") {
            $movimentacoes = $movimentacoes->orderBy("valor_total", "asc");
        } else if ($orderBy == "valor_total-desc") {
            $movimentacoes = $movimentacoes->orderBy("valor_total", "desc");
        } else if ($orderBy == "entrada_data-asc") {
            $movimentacoes = $movimentacoes->orderBy("entrada_data", "asc");
        } else if ($orderBy == "entrada_data-desc") {
            $movimentacoes = $movimentacoes->orderBy("entrada_data", "desc");
        } else if ($orderBy == "created_at-asc") {
            $movimentacoes = $movimentacoes->orderBy("created_at", "asc");
        } else if ($orderBy == "created_at-desc") {
            $movimentacoes = $movimentacoes->orderBy("created_at", "desc");
        } else {
            $movimentacoes = $movimentacoes->orderBy("created_at", "desc");
        }

        $tipo_movimentacao = $request->tipo_movimentacao;
        if (isset($tipo_movimentacao)) {
            $movimentacoes = $movimentacoes->where("movimentacoes.tipo_movimentacao", "=", $tipo_movimentacao);
        }

        $data_inicio = $request->data_inicio;
        $data_fim = $request->data_fim;
        if (isset($data_inicio) && isset($data_fim)) {
            $movimentacoes = $movimentacoes->whereBetween('created_at', [$data_inicio, $data_fim]);
        }

        $movimentacoes = $movimentacoes->paginate($page_size);

        $appends = Decorator::appends(Movimentacao::class, $request);
        $movimentacoes->each(function($item) use ($appends) {
            $item->setAppends($appends);
        });

        return Api::json(true, "Movimentações listadas com sucesso!", $movimentacoes);
    }

    public function show(MovimentacaoRequest $request, Movimentacao $movimentacao)
    {
        $decorators = Decorator::decorators(Movimentacao::class, $request);
        $movimentacao->load($decorators);

        $appends = Decorator::appends(Movimentacao::class, $request);
        $movimentacao->setAppends($appends);

        return Api::json(true, "Movimentação listada com sucesso.", $movimentacao);
    }

    public function store(MovimentacaoRequest $request)
    {
        $input = $request->all();

        foreach ($input as $key => $value) {
        	if ($value !== 0 && $value != "0"){
        		$inputUpdate[$key] = $value;
        	}
        }

        $movimentacao = new Movimentacao($inputUpdate);
        $movimentacao->save();

        $decorators = Decorator::decorators(Movimentacao::class, $request);
        $movimentacao->load($decorators);

        $appends = Decorator::appends(Movimentacao::class, $request);
        $movimentacao->setAppends($appends);
        
        return Api::json(true, "Movimentação cadastrada com sucesso.", $movimentacao, 201);
    }

    public function update(MovimentacaoRequest $request, Movimentacao $movimentacao)
    {
        $input = $request->all();
        $movimentacao->update($input);

        $decorators = Decorator::decorators(Movimentacao::class, $request);
        $movimentacao->load($decorators);

        $appends = Decorator::appends(Movimentacao::class, $request);
        $movimentacao->setAppends($appends);

        return Api::json(true, "Movimentação atualizada com sucesso.", $movimentacao);
    }

    public function destroy(MovimentacaoRequest $request, Movimentacao $movimentacao)
    {
        $movimentacao->delete();

        $decorators = Decorator::decorators(Movimentacao::class, $request);
        $movimentacao->load($decorators);

        $appends = Decorator::appends(Movimentacao::class, $request);
        $movimentacao->setAppends($appends);

        return Api::json(true, "Movimentação deletada com sucesso.", $movimentacao);
    }

    public function totais(Request $request)
    {
        $page_size = $request->page_size ?: 10; //para mudar o offset mandar parametro "page": 2

        $user = auth('api')->user();

        $data_inicio = $request->data_inicio;
        $data_fim = $request->data_fim;

        //////////////////////////////
        $movimentacoes_entrada = Movimentacao::select()->where("movimentacoes.usuario_id", "=", $user->id);
        if (isset($data_inicio) && isset($data_fim)) {
            $movimentacoes_entrada = $movimentacoes_entrada->whereBetween('created_at', [$data_inicio, $data_fim]);
        }
        $movimentacoes_entrada = $movimentacoes_entrada->where("movimentacoes.tipo_movimentacao", "=", "entrada")->where("movimentacoes.n_parcelas", "=", null)->get()->toArray();

        //////////////////////////////
        $movimentacoes_saida = Movimentacao::select()->where("movimentacoes.usuario_id", "=", $user->id);
        if (isset($data_inicio) && isset($data_fim)) {
            $movimentacoes_saida = $movimentacoes_saida->whereBetween('created_at', [$data_inicio, $data_fim]);
        }
        $movimentacoes_saida = $movimentacoes_saida->where("movimentacoes.tipo_movimentacao", "=", "saida")->where("movimentacoes.n_parcelas", "=", null)->get()->toArray();

        //////////////////////////////
        $movimentacoes_a_receber = Movimentacao::select()->where("movimentacoes.usuario_id", "=", $user->id);
        if (isset($data_inicio) && isset($data_fim)) {
            $movimentacoes_a_receber = $movimentacoes_a_receber->whereBetween('created_at', [$data_inicio, $data_fim]);
        }
        $movimentacoes_a_receber = $movimentacoes_a_receber->where("movimentacoes.tipo_movimentacao", "=", "entrada")->where("movimentacoes.n_parcelas", "<>", null)->get()->toArray();

        //////////////////////////////
        $movimentacoes_a_pagar = Movimentacao::select()->where("movimentacoes.usuario_id", "=", $user->id);
        if (isset($data_inicio) && isset($data_fim)) {
            $movimentacoes_a_pagar = $movimentacoes_a_pagar->whereBetween('created_at', [$data_inicio, $data_fim]);
        }
        $movimentacoes_a_pagar = $movimentacoes_a_pagar->where("movimentacoes.tipo_movimentacao", "=", "saida")->where("movimentacoes.n_parcelas", "<>", null)->get()->toArray();

        //////////////////////////////
        $movimentacoes_geral = Movimentacao::select()->where("movimentacoes.usuario_id", "=", $user->id);
        if (isset($data_inicio) && isset($data_fim)) {
            $movimentacoes_geral = $movimentacoes_geral->whereBetween('created_at', [$data_inicio, $data_fim]);
        }
        $movimentacoes_geral = $movimentacoes_geral->orderBy("created_at", "desc")->get()->toArray();


        //////////////////////////////
        $extras = array();
        //////////////////////////////
        $extras["totalValoresEntrada"] = array_sum(array_column($movimentacoes_entrada, "valor_total")) + array_sum(array_column($movimentacoes_a_receber, "valor_parcela"));
        //////////////////////////////
        $extras["totalValoresSaida"] = array_sum(array_column($movimentacoes_saida, "valor_total")) + array_sum(array_column($movimentacoes_a_pagar, "valor_parcela"));
        //////////////////////////////
        $calcTotalAReceber = 0;
        foreach ($movimentacoes_a_receber as $aReceber) {
            $calcParcelaAtualAReceber = $aReceber["parcela_atual"];
            $calcNParcelasAReceber = $aReceber["n_parcelas"];
            $calcParcelasAReceber = $aReceber["n_parcelas"] - $aReceber["parcela_atual"];
            $calcValorParcela = $aReceber["valor_parcela"];
            $calcAReceber = $calcParcelasAReceber * $calcValorParcela;
            $calcTotalAReceber += $calcAReceber;
        }
        $extras["totalAReceber"] = $calcTotalAReceber;
        //////////////////////////////
        $calcTotalApagar = 0;
        foreach ($movimentacoes_a_pagar as $aPagar) {
            $calcParcelaAtualApagar = $aPagar["parcela_atual"];
            $calcNParcelasApagar = $aPagar["n_parcelas"];
            $calcParcelasApagar = $aPagar["n_parcelas"] - $aPagar["parcela_atual"];
            $calcValorParcela = $aPagar["valor_parcela"];
            $calcApagar = $calcParcelasApagar * $calcValorParcela;
            $calcTotalApagar += $calcApagar;
        }
        $extras["totalAPagar"] = $calcTotalApagar;
        //////////////////////////////
        $extras["itens_por_pagina"] = $page_size;
        $extras["itens_sendo_exibidos"] = $page_size;
        $extras["pagina"] = $request->page ?: 1;
        if (isset($data_inicio) && isset($data_fim)) {
            $extras["vazio"] = false;
        } else {
            $extras["vazio"] = true;
        }

        return Api::json(true, "Movimentações listadas com sucesso!", $movimentacoes_geral, 200, $extras);
    }

}
