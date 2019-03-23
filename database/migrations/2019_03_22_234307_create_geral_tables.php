<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGeralTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('movimentacoes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tipo_movimentacao');
            $table->integer('usuario_id')->unsigned();
            $table->string('tipo_valor_tag');
            $table->string('tipo_valor');
            $table->integer('valor_total')->unsigned();
            $table->integer('valor_parcela')->unsigned()->nullable();
            $table->integer('n_parcelas')->unsigned()->nullable();
            $table->integer('parcela_atual')->unsigned()->nullable();
            $table->integer('data_vencimento_parcela')->unsigned()->nullable();
            $table->integer('entrada_data')->unsigned()->nullable();
            $table->integer('created_at')->nullable();
            $table->integer('updated_at')->nullable();
            $table->integer('deleted_at')->nullable();

            $table->foreign('usuario_id')
                  ->references('id')->on('users');
        });

        Schema::create('objetivos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned();
            $table->string('tipo_valor_tag');
            $table->string('tipo_valor');
            $table->integer('valor_total')->unsigned();
            $table->integer('data_prevista')->unsigned();
            $table->integer('data_conclusao')->unsigned()->nullable();
            $table->integer('created_at')->nullable();
            $table->integer('updated_at')->nullable();
            $table->integer('deleted_at')->nullable();

            $table->foreign('usuario_id')
                  ->references('id')->on('users');
        });

        Schema::create('poupancas', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned();
            $table->integer('total')->unsigned();
            $table->integer('objetivo')->unsigned();
            $table->integer('created_at')->nullable();
            $table->integer('updated_at')->nullable();
            $table->integer('deleted_at')->nullable();

            $table->foreign('usuario_id')
                  ->references('id')->on('users');
        });

        Schema::create('salarios', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('usuario_id')->unsigned();
            $table->integer('bruto')->unsigned();
            $table->integer('hora_extra')->unsigned();
            $table->integer('descontos')->unsigned();
            $table->integer('dia_recebimento')->unsigned();
            $table->integer('created_at')->nullable();
            $table->integer('updated_at')->nullable();
            $table->integer('deleted_at')->nullable();
            
            $table->foreign('usuario_id')
                  ->references('id')->on('users');
        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

        Schema::dropIfExists('salarios');
        Schema::dropIfExists('poupancas');
        Schema::dropIfExists('objetivos');
        Schema::dropIfExists('movimentacoes');

    }

}
