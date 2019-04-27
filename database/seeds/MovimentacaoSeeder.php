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
        $n_parcelas = [5,10,8,6,2,4];
        $data_vencimento_parcela = [strtotime('+1 month',time()),strtotime('+1 week',time()),strtotime('+3 days',time()),strtotime('-3 weeks',time()),strtotime('-2 month',time()),strtotime('-10 days',time()),strtotime('-2 weeks',time())];

        $faker = Faker::create();
    	foreach (range(1,17) as $index) {

			$tipo_valor_key = array_rand($tipo_valor);
			$tipo_valor_tag_entrada_key = array_rand($tipo_valor_tag_entrada);
			$tipo_valor_tag_saida_key = array_rand($tipo_valor_tag_entrada);
			$entrada_data_key = array_rand($entrada_data);
			$tipo_movimentacao_key = array_rand($tipo_movimentacao);
			$n_parcelas_key = array_rand($n_parcelas);
			$data_vencimento_parcela_key = array_rand($data_vencimento_parcela);

			if (rand(0,1) == 0){
		        $input = ['usuario_id' => 1,
		                  'tipo_movimentacao'   => $tipo_movimentacao[$tipo_movimentacao_key], 
		                  'tipo_valor_tag'    => $tipo_valor_tag_entrada[$tipo_valor_tag_entrada_key],
		                  'tipo_valor' => $tipo_valor[$tipo_valor_key],
		                  'valor_total'   => rand(15000,200000),
		                  'entrada_data'   => $entrada_data[$entrada_data_key]
		                 ];
            } else {
            	$parcela_atual_random = rand(1,3);
        		if ($n_parcelas[$n_parcelas_key] > $parcela_atual_random){
            		$parcela_atual = $n_parcelas[$n_parcelas_key] - $parcela_atual_random;
            	} else {
            		$parcela_atual = $parcela_atual_random;
            	}
            	if ($n_parcelas[$n_parcelas_key] - $parcela_atual > 0){
	            	$valor_parcela = rand(5000,50000) / ($n_parcelas[$n_parcelas_key] - $parcela_atual);
	            } else {
	            	$valor_parcela = rand(5000,50000);
	            }
            	$valor_total = $valor_parcela * $n_parcelas[$n_parcelas_key];
            	
		        $input = ['usuario_id' => 1,
		                  'tipo_movimentacao'   => $tipo_movimentacao[$tipo_movimentacao_key], 
		                  'tipo_valor_tag'    => $tipo_valor_tag_entrada[$tipo_valor_tag_entrada_key],
		                  'tipo_valor' => $tipo_valor[$tipo_valor_key],
		                  'valor_total'   => $valor_total,
		                  'entrada_data'   => $entrada_data[$entrada_data_key],
		                  'n_parcelas'   => $n_parcelas[$n_parcelas_key],
		                  'valor_parcela'   => $valor_parcela,
		                  'parcela_atual'   => $parcela_atual,
		                  'data_vencimento_parcela'   => $data_vencimento_parcela[$data_vencimento_parcela_key],
		                 ];
            }

	        $movimentacao = new Movimentacao($input);
	        $movimentacao->save();

		}

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
