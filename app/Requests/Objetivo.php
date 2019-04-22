<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class Objetivo extends FormRequest
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
        $rules["usuario_id"] = ["numeric", "exists:users,id"];
        $rules["tipo_valor_tag"] = ["string", "in:compra,venda"];
        $rules["tipo_valor"] = ["string"];
        $rules["valor_total"] = ["numeric"];
        $rules["data_prevista"] = ["numeric"];
        $rules["data_conclusao"] = ["numeric"];
        
        //Se inserção de registro: método 'post'
        if ($this->isMethod('post')) {
            $rules["usuario_id"][] = "required";
            $rules["tipo_valor_tag"][] = "required";
            $rules["tipo_valor"][] = "required";
            $rules["valor_total"][] = "required";
            $rules["data_prevista"][] = "required";
        }


        return $rules;
    }

    public function messages()
    {
        return [];
    }
}
