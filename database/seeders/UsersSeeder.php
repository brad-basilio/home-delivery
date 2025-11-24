<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $deleteUser = User::where('email', 'marketing@nopain.com.pe')->first();
        $deleteUser?->delete();
        User::updateOrCreate([
            'email' => 'admin@mundoweb.pe'
        ], [
            'name' => 'Usuario',
            'lastname' => 'Admin',
            'password' => 'r00tme'
        ])->assignRole('Admin');

         User::updateOrCreate([
            'email' => 'admin@homedelivery.pe'
        ], [
            'name' => 'Home',
            'lastname' => 'Delivery',
            'password' => 'h0m3d3l1v3r10p3ru#2025'
        ])->assignRole('Admin');
       {/* User::updateOrCreate([
            'email' => 'admin@wefem.pe'
        ], [
            'name' => 'Admin',
            'lastname' => 'WeFem',
            'password' => 'wefem0001'
        ])->assignRole('Admin');

        User::updateOrCreate([
            'email' => 'customer@mundoweb.pe'
        ], [
            'name' => 'Usuario',
            'lastname' => 'Customer',
            'password' => 'abcd1234'
        ])->assignRole('Customer'); */}
    }
}
