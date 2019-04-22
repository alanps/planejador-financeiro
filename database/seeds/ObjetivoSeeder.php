<?php

use Illuminate\Database\Seeder;
use App\Models\Objetivo;
use Faker\Factory as Faker;

class ObjetivoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Objetivo::truncate();

        $tipo_valor = ['Xbox One','Sofá','Geladeira','Microondas','Playstation 4','PC','Pizza','Bônus de Dezembro','Viagem ao Rio de Janeiro'];
        $tipo_valor_tag = ['compra','venda'];
        $data_prevista = ["1566432000","1581681600","1577664000","1559476800"];

        $faker = Faker::create();
    	foreach (range(1,12) as $index) {

			$tipo_valor_key = array_rand($tipo_valor);
			$tipo_valor_tag_key = array_rand($tipo_valor_tag);
			$data_prevista_key = array_rand($data_prevista);

	        $input = ['usuario_id' => 1,
	                  'tipo_valor_tag'    => $tipo_valor_tag[$tipo_valor_tag_key],
	                  'tipo_valor' => $tipo_valor[$tipo_valor_key],
	                  'valor_total'   => rand(15000,200000),
	                  'data_prevista'   => $data_prevista[$data_prevista_key]
	                 ];

	        $objetivo = new Objetivo($input);
	        $objetivo->save();

		}

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
