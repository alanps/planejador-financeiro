<?php

use Illuminate\Database\Seeder;
use App\Models\Movimentacao;
use Faker\Factory as Faker;

class MovimentacaoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Movimentacao::truncate();

        $tipo_valor = ['Xbox One','Sofá','Geladeira','Microondas','Playstation 4','PC','Pizza','Bônus de Dezembro','Viagem ao Rio de Janeiro'];
        $tipo_valor_tag_entrada = ['salario','venda','bonus','outros'];
        $tipo_valor_tag_saida = ['compra','cartao','emprestimo','outros'];
        $entrada_data = ["1555848000","1565827200","1557230400","1582329600"];
        $tipo_movimentacao = ["entrada","saida"];

        $faker = Faker::create();
    	foreach (range(1,8) as $index) {

			$tipo_valor_key = array_rand($tipo_valor);
			$tipo_valor_tag_entrada_key = array_rand($tipo_valor_tag_entrada);
			$tipo_valor_tag_saida_key = array_rand($tipo_valor_tag_entrada);
			$entrada_data_key = array_rand($entrada_data);
			$tipo_movimentacao_key = array_rand($tipo_movimentacao);

	        $input = ['usuario_id' => 1,
	                  'tipo_movimentacao'   => $tipo_movimentacao[$tipo_movimentacao_key], 
	                  'tipo_valor_tag'    => $tipo_valor_tag_entrada[$tipo_valor_tag_entrada_key],
	                  'tipo_valor' => $tipo_valor[$tipo_valor_key],
	                  'valor_total'   => rand(15000,200000),
	                  'entrada_data'   => $entrada_data[$entrada_data_key]
	                 ];

	        $movimentacao = new Movimentacao($input);
	        $movimentacao->save();

			$tipo_valor_tag_entrada_key = array_rand($tipo_valor_tag_entrada);
			$tipo_valor_tag_saida_key = array_rand($tipo_valor_tag_entrada);
			$entrada_data_key = array_rand($entrada_data);
			$tipo_valor_key = array_rand($tipo_valor);
			$tipo_movimentacao_key = array_rand($tipo_movimentacao);

	        $input = ['usuario_id' => 1,
	                  'tipo_movimentacao'   => $tipo_movimentacao[$tipo_movimentacao_key], 
	                  'tipo_valor_tag'    => $tipo_valor_tag_saida[$tipo_valor_tag_saida_key],
	                  'tipo_valor' => $tipo_valor[$tipo_valor_key],
	                  'valor_total'   => rand(15000,200000),
	                  'entrada_data'   => $entrada_data[$entrada_data_key]
	                 ];


	        $movimentacao = new Movimentacao($input);
	        $movimentacao->save();

		}

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
