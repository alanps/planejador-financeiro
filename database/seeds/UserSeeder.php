<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        User::truncate();

        $input = ['nome' => "Alan Pardini Sant'Ana",
                  'email'   => "alanps2012@gmail.com", 
                  'password'    => bcrypt("123456"),
                  'sexo' => "Masculino",
                  'profissao'   => "Programador", 
                  'data_nascimento'   => 560880000, 
                  'foto'   => "uploads/avatar.jpg", 
                  'api_token' => "QLZv963vvq146kNZXzqSicJik8uzOY8ig3p03urjhYYDPKcgEHgrIjidEq8E",
                 ];

        $user = new User($input);
        $user->save();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
