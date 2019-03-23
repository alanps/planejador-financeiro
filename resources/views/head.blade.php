<!DOCTYPE html>
<html id="page-{{$view_name}}">
<head>

	<title>Planejamento Financeiro</title>
	<meta name="author" content="Alan Pardini Sant'Ana" />

	<!-- Meta ===================================================== -->
	<meta charset="utf-8" />
	<meta name="description" content="Planejamento Financeiro - Agência Dream Up">
	<meta name="keywords" content="Planejamento Financeiro, Agência Dream Up">
	<link rel="shortcut icon" type="image/x-icon" href="./images/favicon.ico">
	<link rel="image_src" type="image/jpeg" href="./images/logo.jpg" />

	<!-- Meta Laravel ===================================================== -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

	<!-- Meta Tags de Visualização ===================================================== -->
	<meta property="og:image" content="../images/logo.jpg" />
	<meta property="og:title" content="Planejamento Financeiro - Agência Dream Up" />
	<meta property="og:description" content="Planejamento Financeiro - Agência Dream Up" />

	<!-- visualização mobile ===================================================== -->
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="viewport" content="initial-scale = 1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black">

	<!-- CSS e JS ===================================================== -->
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('css/global.css') }}">
    <link rel="stylesheet" href="{{ asset('fonts/fonts.css') }}">
    <link rel="stylesheet" href="{{ asset('fonts/icomoon/style.css') }}">
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="{{ asset('libs/warp.js') }}"></script>
	<script src="https://momentjs.com/downloads/moment.js" type="text/javascript"></script>

    <?php 
    setlocale(LC_ALL, 'pt_BR', 'pt_BR.utf-8', 'pt_BR.utf-8', 'portuguese');
    date_default_timezone_set('America/Sao_Paulo');
    ?>

</head>

<script>
	//window.homepath = "http://www.agenciadreamup.com.br/planejador/"; //ftp
	window.homepath = "http://localhost/planejador-financeiro/public/"; //localhost
	window.uploadpath = "http://localhost/planejador-financeiro/storage/app/public/"; //localhost
</script>
