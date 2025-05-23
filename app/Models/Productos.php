<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Productos extends Model
{
    // use SoftDeletes;

    protected $table = 'productos';
    protected $guarded = [];
    protected $appends = ['rating'];

    function categoria() {
        return $this->hasOne(Categorias::class, 'id', 'categorias_id');
    }

    function comentarios () {
        return $this->hasMany(Comentarios::class, 'productos_id');
    }

    public function getRatingAttribute()
    {
        $promedio = $this->comentarios()->avg('rating');
        return $promedio ? (int) round((float)$promedio) : 0;
    }

}
