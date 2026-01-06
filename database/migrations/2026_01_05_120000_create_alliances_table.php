<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('alliances', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('name'); // Nombre de la empresa/alianza
            $table->string('correlative')->nullable(); // Identificador único
            $table->text('description')->nullable(); // Descripción breve
            $table->string('image')->nullable(); // Logo de la empresa
            $table->string('website')->nullable(); // Sitio web de la empresa
            $table->integer('order')->default(0); // Orden de aparición
            $table->boolean('visible')->default(true);
            $table->boolean('status')->default(true)->nullable();
            $table->uuid('lang_id')->nullable();
            $table->timestamps();

            $table->foreign('lang_id')->references('id')->on('langs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alliances');
    }
};
