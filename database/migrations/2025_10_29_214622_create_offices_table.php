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
        Schema::create('offices', function (Blueprint $table) {
             $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('name');
            $table->enum('type', ['oficina_principal', 'oficina', 'almacen'])->default('oficina');
            $table->string('address');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('description')->nullable();
            $table->string('ubigeo', 6)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('manager')->nullable();
            $table->integer('capacity')->nullable();
            $table->string('link')->nullable();
            $table->json('business_hours')->nullable();
            $table->string('image')->nullable();
            $table->boolean('visible')->default(true);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offices');
    }
};
