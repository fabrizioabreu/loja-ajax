package com.fabrizio.demoajax.web.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.fabrizio.demoajax.domain.Categoria;
import com.fabrizio.demoajax.repository.CategoriaRepository;

@Controller
@RequestMapping("/promocao")
public class PromocaoController {

	@Autowired
	private CategoriaRepository categoriaRepository;
	
	@ModelAttribute("categorias")	// Envia a lista de categorias para o promo-add.html
	public List<Categoria> getCategorias() {		
		return categoriaRepository.findAll();
	}
	
	@GetMapping("/add")
	public String abrirCadasro() {
		return "promo-add";
	}
}
