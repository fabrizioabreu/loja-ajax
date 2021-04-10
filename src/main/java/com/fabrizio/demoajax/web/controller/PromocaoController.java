package com.fabrizio.demoajax.web.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
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
	public ResponseEntity<?> salvarPromocao(@Valid Promocao promocao, BindingResult result) {
		
		// BindingResult = Se um campo não passar na regra de validação, enviamos para o cliente o campo que não passou na regra
		if (result.hasErrors()) {
			Map<String, String> errors = new HashMap<>();
			 for (FieldError error : result.getFieldErrors()) {
				 errors.put(error.getField(), error.getDefaultMessage());
			 }
			 // Retornando um método com http status 422
			 return ResponseEntity.unprocessableEntity().body(errors);
		}
		
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
