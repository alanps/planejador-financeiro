<?php

namespace App\Helpers;

class Decorator {

    //método legado, para as chamadas que utilizam exclusivamente "decorators"
    public static function include($class, $request)
    {
        $result = [];        
        if (defined("{$class}::decorators")) {    
            $all_decorators = $class::decorators;
            if ($request->has('include')) {        
                foreach(explode(',', $request->input('include')) as $inc) {
                    if (in_array($inc, $all_decorators))
                        $result[] = $inc;
                }
            }
        }
        return $result;
    }

    //helper novo para o Eager Loading
    public static function decorators($class, $request)
    {
        $result = [];
        if (defined("{$class}::decorators")) {
            $all_decorators = $class::decorators;
            if ($request->has('include')) {        
                foreach(explode(',', $request->input('include')) as $inc) {
                    if (in_array($inc, $all_decorators))
                        $result[] = $inc;
                }
            }
        }
        return $result;
    }

    //helper novo para Appends
    public static function appends($class, $request)
    {
        $result = [];
        if (defined("{$class}::appends")) {
            $all_appends = $class::appends;
            if ($request->has('include')) {        
                foreach(explode(',', $request->input('include')) as $inc) {
                    if (in_array($inc, $all_appends))
                        $result[] = $inc;
                }
            }
        }
        return $result;
    }
}