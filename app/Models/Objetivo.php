<?php

namespace App\Models;

use Iatstuti\Database\Support\CascadeSoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Objetivo extends Model
{
    use SoftDeletes;
    
    protected $dateFormat = 'U';
    
    protected $table = 'objetivos';
    
    protected $fillable = [
        'usuario_id', 'tipo_valor_tag', 'tipo_valor', 
        'valor_total', 'data_prevista', 'data_conclusao', 
    ];
    
    protected $hidden = [
        'deleted_at', 'usuario_id', 
    ];


    ///////////////////////
    //decorator
    const decorators = [
        'usuario',
    ];
    
    public function usuario()
    {
        return $this->belongsTo(User::class);
    }


}
