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
        Schema::table('messages', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('company')->nullable()->after('phone');
            $table->string('business_sector')->nullable()->after('company');
            $table->string('daily_shipments')->nullable()->after('business_sector');
            $table->string('location_type')->nullable()->after('daily_shipments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['phone', 'company', 'business_sector', 'daily_shipments', 'location_type']);
        });
    }
};
