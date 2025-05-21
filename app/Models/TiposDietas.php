<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TiposDietas extends Model
{
    use SoftDeletes;

    protected $table = 'tipos_dieta';
    protected $guarded = [];

}
