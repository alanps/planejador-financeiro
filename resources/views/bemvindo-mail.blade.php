<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="UTF-8">
</head>
<body style="background-color: #f4f4f4; padding-top:30px; padding-bottom:30px">

<div>
<style>body{ background-color: #f4f4f4; padding-top:30px; padding-bottom:30px}</style>
</div>

<table width="540" align="center" cellpadding="0" cellspacing="0" border="0" style="font-family: 'Verdana'; color:#000000; text-align:center; background-color: #FFFFFF !important; border: 1px solid rgba(0, 0, 0, 0.1);">
		<tbody>
			<tr>
				<td>
					<br><br>
					<a href="{{ $apiurl }}" target="_blank" style="text-decoration: none; border: 0;">
						<img src="{{ $apiurl }}public/images/logo.jpg">
					</a>
					<br><br><br>
				</td>
			</tr>
			<tr>
				<td style="padding-bottom:30px">

					<!-- Código da formatação do texto	!-->
					<center><div style="font-size: 11px;">Olá <span style="color: #487ab9;">{{ $nome }}</span>, seu cadastro foi feito com sucesso!</div></center>
					<br><br>
	  				<center><div style="color: #000000; font-size: 11px; width: 430px; line-height: 19px;">Você pode usar o planejador financeiro quando quiser, ficaremos contentes em ter você como nosso usuário. Esperamos que você goste dos nossos serviços e quando precisar pode contar conosco.</div></center>
					<br><br>
					<div style="font-size: 11px;">Seus dados de acesso são esses:</div>
					<br>
					<table width="465" align="center" cellpadding="0" cellspacing="0" border="0" style="font-family: 'Verdana'; color:#000000; text-align:center; background-color: #f4f4f4 !important; border: 1px solid rgba(0, 0, 0, 0.1);">
						<tbody>
							<tr>
								<td style="padding: 4px;">
								</td>
							</tr>
							<tr>
								<td style="border-bottom: 1px solid rgba(0, 0, 0, 0.10); border-top: 1px solid rgba(0, 0, 0, 0.10); width: 50%; padding: 6px;">
									<div style="font-family: 'Verdana'; font-size: 11px; text-align: right; color: #000000">Email:</div>
								</td>
								<td style="border-bottom: 1px solid rgba(0, 0, 0, 0.10); border-top: 1px solid rgba(0, 0, 0, 0.10); width: 50%; padding: 6px;">
									<div style="font-family: 'Verdana'; font-size: 11px; text-align: left; color: #487ab9">{{ $email }}</div>
								</td>
							</tr>
							<tr>
								<td style="border-bottom: 1px solid rgba(0, 0, 0, 0.10); border-top: 1px solid rgba(0, 0, 0, 0.10); width: 50%; padding: 6px;">
									<div style="font-family: 'Verdana'; font-size: 11px; text-align: right; color: #000000">Senha:</div>
								</td>
								<td style="border-bottom: 1px solid rgba(0, 0, 0, 0.10); border-top: 1px solid rgba(0, 0, 0, 0.10); width: 50%; padding: 6px;">
									<div style="font-family: 'Verdana'; font-size: 11px; text-align: left; color: #487ab9">{{ $password }}</div>
								</td>
							</tr>
							<tr>
								<td style="padding: 4px;">
								</td>
							</tr>
						</tbody>
					</table>
					<br>
					<div style="font-size: 11px; color: #000000">Até mais!</div>
					<!-- Fim do código da formatação do texto	!-->

				</td>
			</tr>
	</tbody>
</table>
<br>

<a href="http://www.agenciadreamup.com.br" target="_blank" style="font-family: 'Verdana'; display: block; text-transform: uppercase; margin: 0 auto; text-align: center; font-size: 12px; color: #487ab9; text-decoration: none; width: 250px;">Dream Up - Agência Digital</a>

</body>
</html>