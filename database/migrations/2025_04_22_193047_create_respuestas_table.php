<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('respuestas', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('comentarios_id');
            $table->foreign('comentarios_id')->references('id')->on('comentarios');

            $table->unsignedBigInteger('comercios_id');
            $table->foreign('comercios_id')->references('id')->on('comercios');

            $table->text('respuesta');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respuestas');
    }
};
