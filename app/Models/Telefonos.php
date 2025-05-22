<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Telefonos extends Model
{
    // use SoftDeletes;

    protected $table = 'telefonos';
    protected $guarded = [];
}
