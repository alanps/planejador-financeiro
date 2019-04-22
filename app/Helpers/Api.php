<?php

namespace App\Helpers;

use \Illuminate\Pagination\LengthAwarePaginator;

class Api {

    public static function json($success=true, $message=null, $data=null, $code=200, $extras=null)
    {

        $conteudo = ['success' => $success];

        if (isset($message)){
            $conteudo += ['message' => $message];
        } else if ($success == false){
            $conteudo += ['message' => "Erro na requisição."];
        } else {
            $conteudo += ['message' => "Sucesso na requisição!"];
        }

        //se for LengthAwarePaginator, ajustar a saída deste componente
        //separar o 'data' dos demais atributos do componente
        if ($data instanceof LengthAwarePaginator) {
            $data_arr = $data->toArray();
            $data = $data_arr['data'];
            $pagination = array_except($data_arr, 'data');
            $conteudo += ['pagination' => $pagination];
            if ($pagination['current_page'] == $pagination['last_page']){
                $total_in_page = $pagination['total'] - $pagination['per_page'];
                $conteudo['pagination'] += ['total_in_page' => $total_in_page];
            } else {
                $conteudo['pagination'] += ['total_in_page' => (int) $pagination['per_page']];
            }
            $conteudo['pagination'] += ['total_pages' => ceil($pagination['total'] / $pagination['per_page'])];
        }

        if (isset($data)){
            $conteudo += ['data' => $data];
        }

        if (isset($extras)){
            $conteudo += ['extras' => $extras];
        }
        
        
        return response()->json($conteudo, $code);
    }
}
