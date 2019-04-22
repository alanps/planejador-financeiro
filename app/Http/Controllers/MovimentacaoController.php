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
        	if ($input[$key] !== 0){
        		$inputUpdate[$key] = $input[$key];
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
        $movimentacoes_entrada = $movimentacoes_entrada->where("movimentacoes.tipo_movimentacao", "=", "entrada")->get()->toArray();

        //////////////////////////////
        $movimentacoes_saida = Movimentacao::select()->where("movimentacoes.usuario_id", "=", $user->id);
        if (isset($data_inicio) && isset($data_fim)) {
            $movimentacoes_saida = $movimentacoes_saida->whereBetween('created_at', [$data_inicio, $data_fim]);
        }
        $movimentacoes_saida = $movimentacoes_saida->where("movimentacoes.tipo_movimentacao", "=", "saida")->get()->toArray();
        
        //////////////////////////////
        $movimentacoes_geral = Movimentacao::select()->where("movimentacoes.usuario_id", "=", $user->id);
        if (isset($data_inicio) && isset($data_fim)) {
            $movimentacoes_geral = $movimentacoes_geral->whereBetween('created_at', [$data_inicio, $data_fim]);
        }
        $movimentacoes_geral = $movimentacoes_geral->get()->toArray();


        //////////////////////////////
        $extras = array();
        $extras["totalValoresEntrada"] = array_sum(array_column($movimentacoes_entrada, "valor_total"));
        $extras["totalValoresSaida"] = array_sum(array_column($movimentacoes_saida, "valor_total"));
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
