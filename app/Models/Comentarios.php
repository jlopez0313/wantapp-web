<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comentarios extends Model
{
    // use SoftDeletes;

    protected $table = 'comentarios';
    protected $guarded = [];

    function respuesta () {
        return $this->hasOne(Respuestas::class, 'comentarios_id', 'id');
    }

    function producto () {
        return $this->hasOne(Productos::class, 'id', 'productos_id');
    }

    function comercio () {
        return $this->hasOne(Comercios::class, 'id', 'comercios_id');
    }
}
