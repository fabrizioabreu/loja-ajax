package com.fabrizio.demoajax.service;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import com.fabrizio.demoajax.domain.Promocao;
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
		
		// Recebe o valor digitado no campo imput
		String search = searchBy(request);
		
		// Montar o Objeto de paginação
		Pageable pageable = PageRequest.of(current, lenght, direction, column);
		
		// Incluir método que faça a consulta no banco de dados
		Page<Promocao> page = queryBy(search, repository, pageable);
		
		Map<String, Object> json = new LinkedHashMap<>();
		json.put("draw", draw);	// Incluindo os dados de resposta
		json.put("recordsTotal", page.getTotalElements());	// parâmetro que vai retornar a lista de dados
		json.put("recordsFiltered", page.getTotalElements());
		json.put("data", page.getContent());	// Vai retornar o obj com a lista das promoções
		return json;
	}

	private Page<Promocao> queryBy(String search, PromocaoRepository repository, Pageable pageable) {
		
		if (search.isEmpty()) {
			return repository.findAll(pageable);
		}
		// Teste para verificar se a consulta esta sendo feita pelo preço		https://regex101.com/
		if (search.matches("^[0-9]+([.,][0-9]{2}?$)")) {	// Testando se o valor digitando no campo INPUT é um valor MONETÁRIO
			search = search.replace(",", ".");
			return repository.findByPreco(new BigDecimal(search), pageable);
		}
		return repository.findByTituloOrSiteOrCategoria(search, pageable);
	}
	
	private String searchBy(HttpServletRequest request) {
		// Acessando o parâmetro que traz o valor digitado no campo imput
		return request.getParameter("search[value]").isEmpty()
				? ""
				: request.getParameter("search[value]");
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
