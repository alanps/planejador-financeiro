<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Movimentacao;
use App\Models\Objetivo;
use App\Helpers\Api;
use App\Helpers\Decorator;

class UltimasController extends Controller
{

    public function index(Request $request)
    {
        $page_size = $request->page_size ?: 10; //para mudar o offset mandar parametro "page": 2

        $ultimasMovimentacoes = Movimentacao::select();
        $ultimasObjetivos = Objetivo::select();

        $data_inicio = $request->data_inicio;
        $data_fim = $request->data_fim;
        if (isset($data_inicio) && isset($data_fim)) {
            $ultimasMovimentacoes = $ultimasMovimentacoes->whereBetween('created_at', [$data_inicio, $data_fim]);
            $ultimasObjetivos = $ultimasObjetivos->whereBetween('created_at', [$data_inicio, $data_fim]);
        }

        $ultimasMovimentacoes = $ultimasMovimentacoes->get();
        $ultimasObjetivos = $ultimasObjetivos->get();

        $ultimas = array_merge($ultimasMovimentacoes->toArray(), $ultimasObjetivos->toArray());
        usort($ultimas, function ($a, $b) use(&$name){
            return $a['created_at'] - $b['created_at'];
        });
        $ultimas = array_slice($ultimas, 0, $page_size);

        return Api::json(true, "Últimas listadas com sucesso!", $ultimas);
    }

}
