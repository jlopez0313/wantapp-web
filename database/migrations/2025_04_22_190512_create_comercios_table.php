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
        Schema::create('comercios', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('usuarios_id');
            $table->foreign('usuarios_id')->references('id')->on('users');

            $table->unsignedBigInteger('localidades_id');
            $table->foreign('localidades_id')->references('id')->on('localidades');

            $table->string('nombre');
            $table->boolean('verificado');
            $table->string('tipo_suscripcion');
            $table->string('logo')->nullable();
            $table->string('banner')->nullable();
            $table->text('direccion');
            $table->decimal('latitud', 20, 15);
            $table->decimal('longitud', 20, 15);
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comercios');
    }
};
