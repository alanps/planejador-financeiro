<?php

use Illuminate\Http\Request;

//Auth
Route::post('login', 'Auth\LoginController@login');
Route::post('logout', 'Auth\LoginController@logout');
Route::post('usuarios', 'UserController@store');
Route::put('resetPass', 'UserController@resetPass');
Route::put('changePass', 'UserController@changePass');

Route::group(['middleware'=>'auth:api'], function() {

	//Usuários
	Route::get('usuarios', 'UserController@index');
	Route::get('usuarios/{usuario}', 'UserController@show');
	Route::delete('usuarios/{usuario}', 'UserController@destroy');

	//Movimentações
	Route::get('movimentacoes/totais', 'MovimentacaoController@totais');
	Route::get('movimentacoes', 'MovimentacaoController@index');
	Route::get('movimentacoes/{movimentacao}', 'MovimentacaoController@show');
	Route::post('movimentacoes', 'MovimentacaoController@store');
	Route::put('movimentacoes/{movimentacao}', 'MovimentacaoController@update');
	Route::delete('movimentacoes/{movimentacao}', 'MovimentacaoController@destroy');

	//Últimas
	Route::get('ultimas', 'UltimasController@index');

	//Objetivos
	Route::get('objetivos', 'ObjetivoController@index');
	Route::get('objetivos/{objetivo}', 'ObjetivoController@show');
	Route::post('objetivos', 'ObjetivoController@store');
	Route::put('objetivos/{objetivo}', 'ObjetivoController@update');
	Route::delete('objetivos/{objetivo}', 'ObjetivoController@destroy');


});
