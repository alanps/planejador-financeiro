<?php

namespace App\Models;

use Iatstuti\Database\Support\CascadeSoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Movimentacao extends Model
{
    use SoftDeletes;
    
    protected $dateFormat = 'U';
    
    protected $table = 'movimentacoes';
    
    protected $fillable = [
        'usuario_id', 'tipo_movimentacao', 'tipo_valor_tag', 'tipo_valor', 
        'valor_total', 'valor_parcela', 'n_parcelas', 'parcela_atual', 'data_vencimento_parcela', 'entrada_data', 
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
