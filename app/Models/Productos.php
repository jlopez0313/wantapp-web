<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Productos extends Model
{
    // use SoftDeletes;

    protected $table = 'productos';
    protected $guarded = [];

    function categoria() {
        return $this->hasOne(Categorias::class, 'id', 'categorias_id');
    }

}
