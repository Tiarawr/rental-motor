<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
       User::updateOrCreate(
    ['email' => 'admin@rental.com'],
    [
        'name' => 'Admin Rental',
        'password' => bcrypt('password'),
        'role' => 'admin'
    ]
);

        // Create Sample Motorcycles
        \App\Models\Motorcycle::create([
            'name' => 'Honda Vario 160',
            'brand' => 'Honda',
            'type' => 'Matic',
            'price_per_day' => 100000,
            'image_url' => 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80',
            'status' => 'available',
            'description' => 'Motor matic responsif dengan performa stabil.'
        ]);

        \App\Models\Motorcycle::create([
            'name' => 'Yamaha NMAX 155',
            'brand' => 'Yamaha',
            'type' => 'Maxi Scooter',
            'price_per_day' => 150000,
            'image_url' => 'https://images.unsplash.com/photo-1568772585407-9361f9bf3c87?auto=format&fit=crop&q=80',
            'status' => 'available',
            'description' => 'Skuter maxi premium nyaman untuk touring.'
        ]);

        \App\Models\Motorcycle::create([
            'name' => 'Honda Beat Street',
            'brand' => 'Honda',
            'type' => 'Matic',
            'price_per_day' => 80000,
            'image_url' => 'https://images.unsplash.com/photo-1568285994269-00fbfef5c4df?auto=format&fit=crop&q=80',
            'status' => 'available',
            'description' => 'Gesit, irit bahan bakar, cocok untuk harian dalam kota.'
        ]);
        \App\Models\Motorcycle::create([
            'name' => 'Yamaha XMAX 250 Connected',
            'brand' => 'Yamaha',
            'type' => 'Maxi Scooter',
            'price_per_day' => 250000,
            'image_url' => 'https://images.unsplash.com/photo-1599386762295-a226b52a514b?auto=format&fit=crop&q=80',
            'status' => 'available',
            'description' => 'Skuter maxi 250cc dengan fitur navigasi dan performa tinggi.'
        ]);

        \App\Models\Motorcycle::create([
            'name' => 'Vespa Sprint 150 I-Get ABS',
            'brand' => 'Piaggio',
            'type' => 'Classic Scooter',
            'price_per_day' => 200000,
            'image_url' => 'https://images.unsplash.com/photo-1593358055110-381dd207ef3a?auto=format&fit=crop&q=80',
            'status' => 'available',
            'description' => 'Desain klasik ikonik berpadu dengan teknologi mesin modern.'
        ]);

        \App\Models\Motorcycle::create([
            'name' => 'Kawasaki Ninja 250 FI',
            'brand' => 'Kawasaki',
            'type' => 'Sport',
            'price_per_day' => 350000,
            'image_url' => 'https://images.unsplash.com/photo-1568772585407-9361f9bf3c87?auto=format&fit=crop&q=80',
            'status' => 'available',
            'description' => 'Motor sport agresif legendaris untuk sensasi berkendara maksimal.'
        ]);

        \App\Models\Motorcycle::create([
            'name' => 'Honda PCX 160 ABS',
            'brand' => 'Honda',
            'type' => 'Maxi Scooter',
            'price_per_day' => 160000,
            'image_url' => 'https://images.unsplash.com/photo-1621255536413-5a04fe202b8b?auto=format&fit=crop&q=80',
            'status' => 'available',
            'description' => 'Elegan dan premium, skuter pilihan elegan menjelajah kota.'
        ]);

        \App\Models\Motorcycle::create([
            'name' => 'Yamaha Fazzio Hybrid',
            'brand' => 'Yamaha',
            'type' => 'Classic Scooter',
            'price_per_day' => 110000,
            'image_url' => 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80',
            'status' => 'available',
            'description' => 'Gaya retro modern dengan mesin hybrid pertama di kelasnya.'
        ]);
    }
}
