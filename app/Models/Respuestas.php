<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Respuestas extends Model
{
    // use SoftDeletes;

    protected $table = 'respuestas';
    protected $guarded = [];

    function comercio () {
        return $this->hasOne(Comercios::class, 'comercios_id', 'id');
    }
}
