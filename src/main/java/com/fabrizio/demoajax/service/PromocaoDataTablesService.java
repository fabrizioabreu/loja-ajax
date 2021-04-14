package com.fabrizio.demoajax.service;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import com.fabrizio.demoajax.repository.PromocaoRepository;

public class PromocaoDataTablesService {

	private String[] cols = {
			"id", "titulo", "site", "linkPromocao", "descricao",
			"linkImagem", "preco", "likes", "dtCadastro", "categoria"
	};
	
	//	repository = para podermos acessar a camada ed persistencia
	//	request = para recuperar as informações que são enviadas pelo cliente
	public Map<String, Object> execute(PromocaoRepository repository, HttpServletRequest request) {
		
		int start = Integer.parseInt(request.getParameter("start"));	// Retorna o número da página.
		int lenght = Integer.parseInt(request.getParameter("length"));	// Qnt de itens que vai ter por página na tabela
		int draw = Integer.parseInt(request.getParameter("draw"));	// Vai ser incrementado a cada requisição
		
		int current = currentPage(start, lenght);	// Identifica qual é a página atual
		
		// Descobrir qual a coluna que a ordenação esta sendo realizada
		String column = columnName(request);
		
		// Identificando se a ordenação é ASCENDENTE ou DESCENDENTE
		Sort.Direction direction = orderBy(request);
		
		// Montar o Objeto de paginação
		Pageable pageable = PageRequest.of(current, lenght, direction, column);
		
		Map<String, Object> json = new LinkedHashMap<>();
		json.put("draw", draw);	// Incluindo os dados de resposta
		json.put("recordsTotal", 0);	// parâmetro que vai retornar a lista de dados
		json.put("recordsFiltered", 0);
		json.put("data", null);
		return json;
	}

	private Direction orderBy(HttpServletRequest request) {
		// Recuperando se a ordenação é ASCENDENTE ou DESCENDENTE
		String order = request.getParameter("order[0][dir]");
		Sort.Direction sort = Sort.Direction.ASC;	// Vinculando o parâmetro com o obj Sort.Directoin 
		if (order.equalsIgnoreCase("desc")) {
			sort = Sort.Direction.DESC;
		}
		return sort;
	}

	// Ordenando a tablela pela coluna clicada
	private String columnName(HttpServletRequest request) {
		int iCol = Integer.parseInt(request.getParameter("order[0][column]"));	// Recuperando o valor da coluna
		return cols[iCol];
	}

	// Identificando qual é a página atual
	private int currentPage(int start, int lenght) {
		// Valores da página	 0  |   1   |   2
		// 						0-9 | 10-19 | 20-29
		return start / lenght;
	}
}
