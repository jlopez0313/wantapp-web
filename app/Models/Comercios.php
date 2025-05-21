<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comercios extends Model
{
    use SoftDeletes;

    protected $table = 'comercios';
    protected $guarded = [];

    function localidad () {
        return $this->hasOne(Localidades::class, 'id', 'localidades_id');
    }

    function categorias () {
        return $this->belongsToMany(Categorias::class, 'comercios_categorias', 'comercios_id', 'categorias_id');
    }

    function horarios () {
        return $this->hasMany(Horarios::class, 'comercios_id');
    }
}
