<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Requests\Objetivo as ObjetivoRequest;
use App\Models\Objetivo;
use App\Helpers\Api;
use App\Helpers\Decorator;

class ObjetivoController extends Controller
{

    public function index(ObjetivoRequest $request)
    {
        $page_size = $request->page_size ?: 10; //para mudar o offset mandar parametro "page": 2

        $decorators = Decorator::decorators(Objetivo::class, $request);
        $objetivos = Objetivo::with($decorators);

        $orderBy = $request->orderBy;
        if ($orderBy == "data_prevista-desc") {
            $objetivos = $objetivos->orderBy("data_prevista", "desc");
        } else if ($orderBy == "data_prevista-asc") {
            $objetivos = $objetivos->orderBy("data_prevista", "asc");
        } else if ($orderBy == "tipo_valor-asc") {
            $objetivos = $objetivos->orderBy("tipo_valor", "asc");
        } else if ($orderBy == "tipo_valor-desc") {
            $objetivos = $objetivos->orderBy("tipo_valor", "desc");
        } else if ($orderBy == "valor_total-asc") {
            $objetivos = $objetivos->orderBy("valor_total", "asc");
        } else if ($orderBy == "valor_total-desc") {
            $objetivos = $objetivos->orderBy("valor_total", "desc");
        } else if ($orderBy == "created_at-asc") {
            $objetivos = $objetivos->orderBy("created_at", "asc");
        } else if ($orderBy == "created_at-desc") {
            $objetivos = $objetivos->orderBy("created_at", "desc");
        }

        $objetivos = $objetivos->paginate($page_size);

        $appends = Decorator::appends(Objetivo::class, $request);
        $objetivos->each(function($item) use ($appends) {
            $item->setAppends($appends);
        });

        return Api::json(true, "Objetivos listados com sucesso!", $objetivos);
    }

    public function show(ObjetivoRequest $request, Objetivo $objetivo)
    {
        $decorators = Decorator::decorators(Objetivo::class, $request);
        $objetivo->load($decorators);

        $appends = Decorator::appends(Objetivo::class, $request);
        $objetivo->setAppends($appends);

        return Api::json(true, "Objetivo listada com sucesso.", $objetivo);
    }

    public function store(ObjetivoRequest $request)
    {
        $input = $request->all();

        $objetivo = new Objetivo($input);
        $objetivo->save();

        $decorators = Decorator::decorators(Objetivo::class, $request);
        $objetivo->load($decorators);

        $appends = Decorator::appends(Objetivo::class, $request);
        $objetivo->setAppends($appends);
        
        return Api::json(true, "Objetivo cadastrado com sucesso.", $objetivo, 201);
    }

    public function update(ObjetivoRequest $request, Objetivo $objetivo)
    {
        $input = $request->all();
        $objetivo->update($input);

        $decorators = Decorator::decorators(Objetivo::class, $request);
        $objetivo->load($decorators);

        $appends = Decorator::appends(Objetivo::class, $request);
        $objetivo->setAppends($appends);

        return Api::json(true, "Objetivo atualizado com sucesso.", $objetivo);
    }

    public function destroy(ObjetivoRequest $request, Objetivo $objetivo)
    {
        $objetivo->delete();

        $decorators = Decorator::decorators(Objetivo::class, $request);
        $objetivo->load($decorators);

        $appends = Decorator::appends(Objetivo::class, $request);
        $objetivo->setAppends($appends);

        return Api::json(true, "Objetivo deletado com sucesso.", $objetivo);
    }


}
