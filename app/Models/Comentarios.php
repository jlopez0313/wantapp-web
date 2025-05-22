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
}
