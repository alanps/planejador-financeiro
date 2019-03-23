<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class GeralSeeder extends Seeder
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
                  'data_nascimento'   => 560822400, 
                  'foto'   => "uploads/avatar.jpg", 
                  'api_token' => "NOvgX6zpAh8F0JvZhk2EVV1RxzUk7JDrvJJC2x9lFO3mzz9Lm3rgPGAFyKp6",
                 ];

        $user = new User($input);
        $user->save();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
