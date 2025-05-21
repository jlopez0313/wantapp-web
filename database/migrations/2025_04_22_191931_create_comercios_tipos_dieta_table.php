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
        Schema::create('comercios_tipos_dieta', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('comercios_id');
            $table->foreign('comercios_id')->references('id')->on('comercios');

            $table->unsignedBigInteger('tipos_dieta_id');
            $table->foreign('tipos_dieta_id')->references('id')->on('tipos_dieta');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comercios_tipos_dieta');
    }
};
