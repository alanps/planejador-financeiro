<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('login');
})->name("login");

Route::get('/esqueciaasenha', function () {
    return view('esqueciaasenha');
})->name("esqueciaasenha");

Route::get('/aplicativo', function () {
    return view('planejador');
})->name("aplicativo");
