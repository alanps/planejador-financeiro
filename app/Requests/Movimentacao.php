<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class Movimentacao extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    // https://laravel.com/docs/5.7/validation#available-validation-rules
    public function rules()
    {
        //regras gerais
        $rules = [];
        $rules["tipo_movimentacao"] = ["string", "in:entrada,saida"];
        $rules["usuario_id"] = ["numeric", "exists:users,id"];
        $rules["tipo_valor_tag"] = ["string", "in:salario,venda,bonus,compra,cartao,emprestimo,outros"];
        $rules["tipo_valor"] = ["string"];
        $rules["valor_total"] = ["numeric"];
        $rules["n_parcelas"] = ["numeric"];
        $rules["valor_parcela"] = ["numeric"];
        $rules["parcela_atual"] = ["numeric"];
        $rules["data_vencimento_parcela"] = ["numeric"];
        $rules["entrada_data"] = ["numeric"];
        
        //Se inserção de registro: método 'post'
        if ($this->isMethod('post')) {
            $rules["tipo_movimentacao"][] = "required";
            $rules["usuario_id"][] = "required";
            $rules["tipo_valor_tag"][] = "required";
            $rules["tipo_valor"][] = "required";
            $rules["valor_total"][] = "required";
            $rules["valor_parcela"][] = "required_with:n_parcelas";
            $rules["parcela_atual"][] = "required_with:n_parcelas";
            $rules["parcela_atual"][] = "lte:n_parcelas";
            $rules["data_vencimento_parcela"][] = "numeric";
            $rules["data_vencimento_parcela"][] = "required_with:n_parcelas";
        }


        return $rules;
    }

    public function messages()
    {
        return [];
    }
}
