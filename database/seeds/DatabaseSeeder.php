<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        $this->call(UserSeeder::class);
        $this->call(MovimentacaoSeeder::class);
        $this->call(ObjetivoSeeder::class);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
