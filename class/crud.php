<?php

function json_union($success, $message, $data, $contagem = "", $pagina = "", $itens_por_pagina = "", $itens_sendo_exibidos = "", $totalValoresEntrada = "", $totalValoresSaida = "", $vazio = "") {
    echo json_encode(array('success' => $success, 'message' => $message, 'data' => $data, 'contagem' => $contagem, 'pagina' => $pagina, 'itens_por_pagina' => $itens_por_pagina, 'itens_sendo_exibidos' => $itens_sendo_exibidos, 'totalValoresEntrada' => $totalValoresEntrada, 'totalValoresSaida' => $totalValoresSaida, 'vazio' => $vazio));
    exit;
}

function json_simple($success, $message, $data) {
    echo json_encode(array('success' => $success, 'message' => $message, 'data' => $data));
    exit;
}

class Crud {

	public $db_host = "localhost";
	public $db_name = "agen5851_planejador";
	public $db_user = "agen5851_alanps";
	public $db_pass = "mxk8mxk9";


	public function insert($arrayDados, $table) {

		try {

			// Loop para montar a instrução com os campos e valores
			foreach($arrayDados as $chave => $valor):
				$campos .= $chave . ', ';
				$valores .= '"' . $valor . '"' . ', ';
			endforeach;

			// Retira vírgula do final da string
			$campos = (substr($campos, -2) == ', ') ? trim(substr($campos, 0, (strlen($campos) - 2))) : $campos ;
			$valores = (substr($valores, -2) == ', ') ? trim(substr($valores, 0, (strlen($valores) - 2))) : $valores ;

	        $pdo = new PDO('mysql:host='.$this->db_host.';dbname='.$this->db_name, $this->db_user, $this->db_pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
			$pdo->exec("set names utf8");
	        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$stmt = $pdo->prepare('INSERT INTO '.$table.' (' . $campos . ') VALUES (' . $valores . ')');
			$stmt->execute();
			
			$id = $pdo->lastInsertId();
			$arrayDados['id'] = $id;

			if ($stmt) { 
				json_simple("true", "Cadastro feito com sucesso!", $arrayDados);
			} else {
				json_simple("false", "Erro no cadastro no banco de dados!", $arrayDados);
			}


		} catch(PDOException $e) {
			echo 'Error: ' . $e->getMessage();
		}

	}

   	public function update($arrayDados, $arrayCondicao, $table) {

		try {
			
			// Loop para montar a instrução com os campos e valores
			foreach($arrayDados as $chave => $valor):
				$valCampos .= $chave . '= "' .$valor . '", ';
			endforeach;
			      
			// Loop para montar a condição WHERE
			foreach($arrayCondicao as $chave => $valor):
				$valCondicao .= $chave . '= "' .$valor . '" AND ';
			endforeach;

			// Retira vírgula do final da string
			$valCampos = (substr($valCampos, -2) == ', ') ? trim(substr($valCampos, 0, (strlen($valCampos) - 2))) : $valCampos ;
			$valCondicao = (substr($valCondicao, -4) == 'AND ') ? trim(substr($valCondicao, 0, (strlen($valCondicao) - 4))) : $valCondicao ;

			$pdo = new PDO('mysql:host='.$this->db_host.';dbname='.$this->db_name, $this->db_user, $this->db_pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
			$pdo->exec("set names utf8");
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		    $stmt = $pdo->prepare('UPDATE '.$table.' SET ' . $valCampos . ' WHERE ' . $valCondicao);
			$stmt->execute();

			if ($stmt) { 
				json_simple("true", "Cadastro atualizado com sucesso!", $arrayDados);
			} else {
				json_simple("false", "Erro no cadastro no banco de dados!", $arrayDados);
			}

		} catch(PDOException $e) {
			echo 'Error: ' . $e->getMessage();
		}

	}


	public function delete($arrayCondicao, $table) {

		try {
						      
			// Loop para montar a condição WHERE
			foreach($arrayCondicao as $chave => $valor):
				$valCondicao .= $chave . '= "' .$valor . '" AND ';
			endforeach;

			// Retira vírgula do final da string
			$valCondicao = (substr($valCondicao, -4) == 'AND ') ? trim(substr($valCondicao, 0, (strlen($valCondicao) - 4))) : $valCondicao ;

			$pdo = new PDO('mysql:host='.$this->db_host.';dbname='.$this->db_name, $this->db_user, $this->db_pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		   

			$stmt = $pdo->prepare('DELETE FROM '.$table.' WHERE ' . $valCondicao);
			$stmt->execute();
			
			if ($stmt) { 
				json_simple("true", "Excluido com sucesso!", $arrayCondicao);
			} else {
				json_simple("false", "Erro no cadastro no banco de dados!", $arrayCondicao);
			}

		} catch(PDOException $e) {
			echo 'Error: ' . $e->getMessage();
		}

	}

	public function read_simple($arrayCondicao, $order, $table, $itens_por_pagina = "10", $pagina = "1", $type = "json") {

		try {

			$inicio = ($itens_por_pagina * $pagina) - $itens_por_pagina;

			if (!empty($arrayCondicao) >= 1) {
				// Loop para montar a condição WHERE
				foreach($arrayCondicao as $chave => $valor):
					$valCondicao .= $chave . '= "' .$valor . '" AND ';
				endforeach;

				// Retira vírgula do final da string
				$valCondicao = (substr($valCondicao, -4) == 'AND ') ? trim(substr($valCondicao, 0, (strlen($valCondicao) - 4))) : $valCondicao ;
			}

	        $pdo = new PDO('mysql:host='.$this->db_host.';dbname='.$this->db_name, $this->db_user, $this->db_pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
	        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		   
			if (!empty($arrayCondicao)) {
				if (!empty($order)) {
					$stmt = $pdo->prepare('SELECT * FROM ' .$table. ' WHERE ' . $valCondicao . ' ORDER BY ' . $order . ' LIMIT ' . $inicio. ', ' . $itens_por_pagina);
				} else {
					$stmt = $pdo->prepare('SELECT * FROM ' .$table. ' WHERE ' . $valCondicao);
				}
			} else {
				$count = $pdo->prepare('SELECT * FROM ' .$table . ' LIMIT ' . $inicio. ', ' . $itens_por_pagina);
			}

			$stmt->execute();
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

			/////////////////////////////////
			//Itens sendo exibidos
			$itens_sendo_exibidos = $stmt->rowCount();
			
			/////////////////////////////////
			//Contagem de RESULTADOS
			$count = $pdo->prepare('SELECT * FROM ' .$table. ' WHERE ' . $valCondicao);
			$count->execute();
			$contagem = $count->rowCount();

/*
			if($type == "json")
		    	echo json_encode($result);
		    else
		    	return $result;
*/
			if( $result ) {
				json_union("true", "Dados retornados com sucesso!", $result, "$contagem", "$pagina", "$itens_por_pagina", "$itens_sendo_exibidos");
			} else {
				json_union("false", "Erro na leitura do banco de dados!", $result);
			}
		  
		} catch(PDOException $e) {
			echo 'Error: ' . $e->getMessage();
		}

	}

	public function read_union($arrayCondicao, $order, $table, $itens_por_pagina = "10", $pagina = "1", $type = "json") {

		try {

			$inicio = ($itens_por_pagina * $pagina) - $itens_por_pagina;

			if (!empty($arrayCondicao) >= 1) {
				// Loop para montar a condição WHERE
				foreach($arrayCondicao as $chave => $valor):
					$valCondicao .= $chave . ' = "' .$valor. '"';
				endforeach;

				// Retira vírgula do final da string
				$valCondicao = (substr($valCondicao, -4) == 'OR ') ? trim(substr($valCondicao, 0, (strlen($valCondicao) - 4))) : $valCondicao ;
			}

	        $pdo = new PDO('mysql:host='.$this->db_host.';dbname='.$this->db_name, $this->db_user, $this->db_pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
	        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


	        if (count($table) == 3) {
				$stmt = $pdo->prepare('(SELECT idUsuario, tipoValorTag, tipoValor, valorTotal, dataAdicionado, "'.$table[0].'" as table1 FROM '.$table[0].' WHERE '.$valCondicao.') UNION ALL (SELECT idUsuario, tipoValorTag, tipoValor, valorTotal, dataAdicionado, "'.$table[1].'" as table1 FROM '.$table[1].' WHERE '.$valCondicao.') UNION ALL (SELECT idUsuario, tipoValorTag, tipoValor, valorTotal, dataAdicionado, "'.$table[2].'" as table1 FROM '.$table[2].' WHERE '.$valCondicao.') ORDER BY ' . $order . ' LIMIT ' . $inicio. ', ' . $itens_por_pagina);
	        } else {
				if (!empty($arrayCondicao)) {
					if (!empty($order)) {
						$stmt = $pdo->prepare('(SELECT *, "'.$table[0].'" as table1 FROM '.$table[0].' WHERE '.$valCondicao.') UNION (SELECT *, "'.$table[1].'" as table1 FROM '.$table[1].' WHERE '.$valCondicao.') ORDER BY ' . $order . ' LIMIT ' . $inicio. ', ' . $itens_por_pagina);
					} else {
						$stmt = $pdo->prepare('(SELECT *, "'.$table[0].'" as table1 FROM '.$table[0].' WHERE '.$valCondicao.') UNION (SELECT *, "'.$table[1].'" as table1 FROM '.$table[1].' WHERE '.$valCondicao.') ORDER BY ' . $order . ' LIMIT ' . $inicio. ', ' . $itens_por_pagina);
					}
				} else {
					$stmt = $pdo->prepare('(SELECT *, "'.$table[0].'" as table1 FROM '.$table[0].') UNION (SELECT *, "'.$table[1].'" as table1 FROM '.$table[1].') ORDER BY ' . $order . ' LIMIT ' . $inicio. ', ' . $itens_por_pagina);
				}
			}

			$stmt->execute();
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

			/////////////////////////////////
			//Itens sendo exibidos
			$itens_sendo_exibidos = $stmt->rowCount();

			/////////////////////////////////
			//Contagem de RESULTADOS
			$count = $pdo->prepare('(SELECT *, "'.$table[0].'" as table1 FROM '.$table[0].' WHERE '.$valCondicao.') UNION (SELECT *, "'.$table[1].'" as table1 FROM '.$table[1].' WHERE '.$valCondicao.')');
			$count->execute();
			$contagem = $count->rowCount();

			/////////////////////////////////
			//Soma dos valores de ENTRADA
			$countvaloresEntrada = $pdo->prepare('SELECT * FROM ' .$table[0]. ' WHERE ' . $valCondicao . 'ORDER BY ' . $order);
			$countvaloresEntrada->execute();
			$valoresEntrada = 0;
			foreach ($countvaloresEntrada as $row) {
				$valoresEntrada = $valoresEntrada + $row["valorTotal"];
			}

			/////////////////////////////////
			//Soma dos valores de SAIDA
			$countvaloresSaida = $pdo->prepare('SELECT * FROM ' .$table[1]. ' WHERE ' . $valCondicao . 'ORDER BY ' . $order);
			$countvaloresSaida->execute();
			$valoresSaida = 0;
			foreach ($countvaloresSaida as $row) {
				$valoresSaida = $valoresSaida + $row["valorTotal"];
			}

/*
			if($type == "json")
		    	echo json_encode($result);
		    else
		    	return $result;
*/
			if( $result ) {
				json_union("true", "Dados retornados com sucesso!", $result, "$contagem", "$pagina", "$itens_por_pagina", "$itens_sendo_exibidos", "$valoresEntrada", "$valoresSaida");
			} else {
				json_union("false", "Erro na leitura do banco de dados!", $result);
			}
		  
		} catch(PDOException $e) {
			echo 'Error: ' . $e->getMessage();
		}

	}

	public function read_between($arrayCondicao, $order, $table, $itens_por_pagina, $pagina, $vazio = false, $type = "json") {

		try {

			$itens_por_pagina = (int)$itens_por_pagina;
			$pagina = (int)$pagina;
			$indice = ($itens_por_pagina * $pagina) - $itens_por_pagina;
			$indice = (int)$indice;

	        $pdo = new PDO('mysql:host='.$this->db_host.';dbname='.$this->db_name, $this->db_user, $this->db_pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
	        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	        if (count($table) == 2) {
				$stmt = $pdo->prepare("(SELECT *, '".$table[0]."' as table1 FROM `".$table[0]."` WHERE `dataAdicionado` BETWEEN ".$arrayCondicao['dataAdd']." AND ".$arrayCondicao['dataFim']." AND `idUsuario` = ".$arrayCondicao['idUsuario'].") UNION (SELECT *, '".$table[1]."' as table1 FROM `".$table[1]."` WHERE `dataAdicionado` BETWEEN ".$arrayCondicao['dataAdd']." AND ".$arrayCondicao['dataFim']." AND `idUsuario` = ".$arrayCondicao['idUsuario'].") ORDER BY ". $order ." LIMIT ". $indice .", ".$itens_por_pagina);
			} else if (count($table) == 3) {
				$stmt = $pdo->prepare("(SELECT id, idUsuario, tipoValorTag, tipoValor, valorTotal, dataAdicionado, dataModificado, '".$table[0]."' as table1 FROM `".$table[0]."` WHERE `dataAdicionado` BETWEEN ".$arrayCondicao['dataAdd']." AND ".$arrayCondicao['dataFim']." AND `idUsuario` = ".$arrayCondicao['idUsuario'].") UNION (SELECT id, idUsuario, tipoValorTag, tipoValor, valorTotal, dataAdicionado, dataModificado, '".$table[1]."' as table1 FROM `".$table[1]."` WHERE `dataAdicionado` BETWEEN ".$arrayCondicao['dataAdd']." AND ".$arrayCondicao['dataFim']." AND `idUsuario` = ".$arrayCondicao['idUsuario'].") UNION (SELECT id, idUsuario, tipoValorTag, tipoValor, valorTotal, dataAdicionado, dataModificado, '".$table[2]."' as table1 FROM `".$table[2]."` WHERE `dataAdicionado` BETWEEN ".$arrayCondicao['dataAdd']." AND ".$arrayCondicao['dataFim']." AND `idUsuario` = ".$arrayCondicao['idUsuario'].") ORDER BY ". $order ." LIMIT ". $indice .", ".$itens_por_pagina);
			}

			$stmt->execute();
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);


			/////////////////////////////////
			//Itens sendo exibidos
			$itens_sendo_exibidos = $stmt->rowCount();

			/////////////////////////////////
			//Contagem de RESULTADOS
			$count = $pdo->prepare("(SELECT *, '".$table[0]."' as table1 FROM `".$table[0]."` WHERE `dataAdicionado` BETWEEN ".$arrayCondicao['dataAdd']." AND ".$arrayCondicao['dataFim']." AND `idUsuario` = ".$arrayCondicao['idUsuario'].") UNION (SELECT *, '".$table[1]."' as table1 FROM `".$table[1]."` WHERE `dataAdicionado` BETWEEN ".$arrayCondicao['dataAdd']." AND ".$arrayCondicao['dataFim']." AND `idUsuario` = ".$arrayCondicao['idUsuario'].")");

			$count->execute();
			$contagem = $count->rowCount();

			/////////////////////////////////
			//Soma dos valores de ENTRADA
			$countvaloresEntrada = $pdo->prepare("SELECT * FROM ".$table[0]." WHERE `dataAdicionado` BETWEEN ".$arrayCondicao['dataAdd']." AND ".$arrayCondicao['dataFim']." AND `idUsuario` = ".$arrayCondicao['idUsuario']);
			$countvaloresEntrada->execute();
			$valoresEntrada = 0;
			foreach ($countvaloresEntrada as $row) {
				$valoresEntrada = $valoresEntrada + $row["valorTotal"];
			}

			/////////////////////////////////
			//Soma dos valores de SAIDA
			$countvaloresSaida = $pdo->prepare("SELECT * FROM ".$table[1]." WHERE `dataAdicionado` BETWEEN ".$arrayCondicao['dataAdd']." AND ".$arrayCondicao['dataFim']." AND `idUsuario` = ".$arrayCondicao['idUsuario']);
			$countvaloresSaida->execute();
			$valoresSaida = 0;
			foreach ($countvaloresSaida as $row) {
				$valoresSaida = $valoresSaida + $row["valorTotal"];
			}

/*
			if($type == "json")
		    	echo json_encode($result);
		    else
		    	return $result;
*/
			if( $result ) {
				//json_union("true", "Dados retornados com sucesso!", $result, "50", "$pagina", "$itens_por_pagina", "$itens_sendo_exibidos", "$valoresEntrada", "$valoresSaida");
				if ($vazio != true) {
					json_union("true", "Dados retornados com sucesso!", $result, "$contagem", "$pagina", "$itens_por_pagina", "$itens_sendo_exibidos", "$valoresEntrada", "$valoresSaida", false);
				} else {
					json_union("true", "Dados retornados com sucesso!", $result, "$contagem", "$pagina", "$itens_por_pagina", "$itens_sendo_exibidos", "$valoresEntrada", "$valoresSaida", true);
				}
			} else {
				json_union("false", "Erro na leitura do banco de dados!", $result);
			}
		  
		} catch(PDOException $e) {
			echo 'Error: ' . $e->getMessage();
		}

	}

}

?>