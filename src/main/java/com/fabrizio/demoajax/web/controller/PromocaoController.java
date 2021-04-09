package com.fabrizio.demoajax.web.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fabrizio.demoajax.domain.Categoria;
import com.fabrizio.demoajax.domain.Promocao;
import com.fabrizio.demoajax.repository.CategoriaRepository;
import com.fabrizio.demoajax.repository.PromocaoRepository;

@Controller
@RequestMapping("/promocao")
public class PromocaoController {

	// Imprimindo os log no console
	private static Logger log = LoggerFactory.getLogger(PromocaoController.class);
	
	@Autowired
	private PromocaoRepository promocaoRepository;
	@Autowired
	private CategoriaRepository categoriaRepository;
	
	// Receber a requisição do SUBMIT e salvar dados do formulário no Banco de Dados
	@PostMapping("/save")
	public ResponseEntity<Promocao> salvarPromocao(Promocao promocao) {
		log.info("Promocao {}", promocao.toString());
		promocao.setDtCadastro(LocalDateTime.now());	// Salvando o instante data/hora
		promocaoRepository.save(promocao);
		return ResponseEntity.ok().build();
	}
	
	@ModelAttribute("categorias")	// Envia a lista de categorias para o promo-add.html
	public List<Categoria> getCategorias() {		
		return categoriaRepository.findAll();
	}
	
	@GetMapping("/add")
	public String abrirCadasro() {
		return "promo-add";
	}
}
