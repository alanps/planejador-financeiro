<?php

namespace App\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class User extends FormRequest
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
        $rules["nome"] = ["string"];
        $rules["email"] = ["email"];
        $rules["password"] = ["string", "min:6"];
        $rules["sexo"] = ["string", "in:Masculino,Feminino"];
        $rules["profissao"] = ["string"];
        $rules["data_nascimento"] = ["numeric"];
        $rules["foto"] = ["string"];
        
        //Se inserção de registro: método 'post'
        if ($this->isMethod('post')) {
            $rules["nome"][] = "required";
            $rules["email"][] = "required";
            $rules["email"][] = "unique:users,email";
            $rules["password"][] = "required";
            $rules["sexo"][] = "required";
            $rules["data_nascimento"][] = "required";
        }
      
        //Se atualização de registro: método 'put'
        else if (str_contains(\Route::currentRouteAction(), 'UserController@resetPass') == true) {
            $rules["email"][] = "required";
            $rules["email_confirmacao"][] = "required";
            $rules["email"][] = "same:email_confirmacao";
            $rules["email"][] = "exists:users,email";
        }

        //delete
        else if (str_contains(\Route::currentRouteAction(), 'UserController@changePass') == true) {
            $rules["email"][] = "required";
            $rules["email_confirmacao"][] = "required";
            $rules["email"][] = "same:email_confirmacao";
            $rules["email"][] = "exists:users,email";
            $rules["password"][] = "required";
        }


        return $rules;
    }

    public function messages()
    {
        return [];
    }
}
