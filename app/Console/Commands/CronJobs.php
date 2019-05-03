<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Movimentacao;
use App\Models\User;

class CronJobs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'updates:cronjobs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command update data';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {


        //cron para atualizar o banco, atualiza o numero da parcela atual e a data de vencimentoi da parcela
        $nowTimestamp = time();
        $movimentacoesUpdate = Movimentacao::where("movimentacoes.data_vencimento_parcela", "<", $nowTimestamp)->get();

        foreach ($movimentacoesUpdate as $movimentacao) {
            if ($nowTimestamp - $movimentacao["data_vencimento_parcela"] > 0){
                $addMonths2 = $nowTimestamp - $movimentacao["data_vencimento_parcela"];
                $addMonths = floor($addMonths2/2592000);
            } else {
                $addMonths = 0;
            }

            $movimentacaoUpdate = new Movimentacao();
            $movimentacaoUpdate->id = $movimentacao["id"];

            $dataNow = strtotime('+32 days', $nowTimestamp);
            $dataVenc = strtotime('+1 month', $movimentacao["data_vencimento_parcela"]);
            $pTotal = $movimentacao["n_parcelas"];
            $pAtual = $movimentacao["parcela_atual"];
            $vencParc = $movimentacao["data_vencimento_parcela"];
            for ($i=0; $i <= $addMonths; $i++) {
                if ($dataVenc <= $dataNow) {
                    $vencParc = strtotime('+1 month', $vencParc);
                    $movimentacaoUpdate->data_vencimento_parcela = $vencParc;
                    if ($pAtual <= $pTotal) {
                        $pAtual = $pAtual + 1;
                    }
                    $movimentacaoUpdate->parcela_atual = $pAtual;
                } else {
                    $movimentacaoUpdate->parcela_atual = $pAtual;
                }
            }
            $movimentacaoUpdate->exists = true;
            $movimentacaoUpdate->save();
        }
        

    }
}
