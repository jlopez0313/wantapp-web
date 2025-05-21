<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Localidades extends Model
{
    use SoftDeletes;

    protected $table = 'localidades';
    protected $guarded = [];
}
