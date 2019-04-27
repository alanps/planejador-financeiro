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
        $page_size = $request->page_size ?: 4; //para mudar o offset mandar parametro "page": 2

        $ultimasMovimentacoes = Movimentacao::select("usuario_id","tipo_movimentacao","tipo_valor_tag","tipo_valor","tipo_valor_tag","valor_total","valor_parcela","n_parcelas","parcela_atual","data_vencimento_parcela","entrada_data","created_at","id as id_mov");
        $ultimasObjetivos = Objetivo::select("usuario_id","tipo_valor_tag","tipo_valor","tipo_valor_tag",'data_prevista','data_conclusao',"created_at","id as id_obj");

        $data_inicio = $request->data_inicio;
        $data_fim = $request->data_fim;
        if (isset($data_inicio) && isset($data_fim)) {
            $ultimasMovimentacoes = $ultimasMovimentacoes->whereBetween('created_at', [$data_inicio, $data_fim]);
            $ultimasObjetivos = $ultimasObjetivos->whereBetween('created_at', [$data_inicio, $data_fim]);
        }

        $ultimasMovimentacoes = $ultimasMovimentacoes->orderBy("created_at", "asc")->get()->toArray();
        $ultimasObjetivos = $ultimasObjetivos->orderBy("created_at", "asc")->get()->toArray();

        $ultimas = array_merge($ultimasMovimentacoes, $ultimasObjetivos);
        usort($ultimas, function($a, $b) {
            if($a['created_at']==$b['created_at']) return 0;
            return $a['created_at'] < $b['created_at']?1:-1;
        });
        $ultimas = array_slice($ultimas, 0, $page_size);

        return Api::json(true, "Últimas listadas com sucesso!", $ultimas);
    }

}
