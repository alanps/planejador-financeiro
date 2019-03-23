<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;
use App\Helpers\Api;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string
     */
    protected function redirectTo($request)
    {
        return route('login');
    }

    public function handle($request, Closure $next, ...$guards)
    {
       if (\Auth::guard('api')->guest()) {
            return Api::json(false, "Acesso negado!", null, 403);
       }

       return $next($request);
    }
}
