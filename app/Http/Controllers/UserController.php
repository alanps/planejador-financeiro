<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Requests\User as UserRequest;
use App\Models\User;
use App\Helpers\Api;
use App\Helpers\Decorator;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMail;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function index(UserRequest $request)
    {
        $page_size = $request->page_size ?: 10; //para mudar o offset mandar parametro "page": 2

        $decorators = Decorator::decorators(User::class, $request);
        $usuarios = User::with($decorators);

        $usuarios = $usuarios->paginate($page_size);

        $appends = Decorator::appends(User::class, $request);
        $usuarios->each(function($item) use ($appends) {
            $item->setAppends($appends);
        });

        return Api::json(true, "Usuários listados com sucesso!", $usuarios);
    }

    public function show(UserRequest $request, User $usuario)
    {
        $decorators = Decorator::decorators(User::class, $request);
        $usuario->load($decorators);

        $appends = Decorator::appends(User::class, $request);
        $usuario->setAppends($appends);

        return Api::json(true, "Usuário listado com sucesso.", $usuario);
    }

    public function store(UserRequest $request)
    {
        $input = $request->all();

        $dataMail = [];
        $dataMail["nome"] = $input["nome"];
        $dataMail["email"] = $input["email"];
        $dataMail["password"] = $input["password"];
        $dataMail["projeto"] = env('APP_NAME');
        $dataMail["site"] = env('FRONTAPP_URL');
        $dataMail["apiurl"] = env('APP_URL');
        $dataMail["subject"] = "Planejador Financeiro - Bem Vindo!";
        $dataMail["view"] = "bemvindo";
        Mail::to($input["email"])->send(new SendMail($dataMail));

        $input["password"] = Hash::make($input["password"]);

        $usuario = new User($input);
        $usuario->save();

        $decorators = Decorator::decorators(User::class, $request);
        $usuario->load($decorators);

        $appends = Decorator::appends(User::class, $request);
        $usuario->setAppends($appends);
        
        return Api::json(true, "Usuário cadastrado com sucesso.", $usuario, 201);
    }

    public function resetPass(UserRequest $request, User $usuario)
    {
        $input = $request->all();
        $usuario_get = User::where('email', '=', $input["email"])->first();

        $password_original = str_random(rand(6,12));
        $usuario_get->password = bcrypt($password_original);

        $dataMail = [];
        $dataMail["nome"] = $usuario_get["nome"];
        $dataMail["email"] = $usuario_get["email"];
        $dataMail["password"] = $password_original;
        $dataMail["projeto"] = env('APP_NAME');
        $dataMail["site"] = env('FRONTAPP_URL');
        $dataMail["apiurl"] = env('APP_URL');
        $dataMail["subject"] = "Planejador Financeiro - Recuperar Senha!";
        $dataMail["view"] = "esqueciasenha";
        Mail::to($usuario_get["email"])->send(new SendMail($dataMail));

        $usuario_get->save();

        $decorators = Decorator::decorators(User::class, $request);
        $usuario_get->load($decorators);

        $appends = Decorator::appends(User::class, $request);
        $usuario_get->setAppends($appends);

        return Api::json(true, "Email enviado com sua nova senha!", $usuario_get);
    }

    public function changePass(UserRequest $request, User $usuario)
    {
        $input = $request->all();
        $usuario_get = User::where('email', '=', $input["email"])->first();

        $usuario_get->password = bcrypt($input["password"]);

        $dataMail = [];
        $dataMail["nome"] = $usuario_get["nome"];
        $dataMail["email"] = $usuario_get["email"];
        $dataMail["password"] = $input["password"];
        $dataMail["projeto"] = env('APP_NAME');
        $dataMail["site"] = env('FRONTAPP_URL');
        $dataMail["apiurl"] = env('APP_URL');
        $dataMail["subject"] = "Planejador Financeiro - Recuperar Senha!";
        $dataMail["view"] = "esqueciasenha";
        Mail::to($usuario_get["email"])->send(new SendMail($dataMail));

        $usuario_get->save();

        $decorators = Decorator::decorators(User::class, $request);
        $usuario_get->load($decorators);

        $appends = Decorator::appends(User::class, $request);
        $usuario_get->setAppends($appends);

        return Api::json(true, "Senha redefinida com sucesso.", $usuario_get);
    }

    public function destroy(UserRequest $request, User $usuario)
    {
        $usuario->delete();

        $decorators = Decorator::decorators(User::class, $request);
        $usuario->load($decorators);

        $appends = Decorator::appends(User::class, $request);
        $usuario->setAppends($appends);

        return Api::json(true, "Usuário deletado com sucesso.", $usuario);
    }

}
