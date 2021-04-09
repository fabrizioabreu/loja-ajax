package com.fabrizio.demoajax.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

	@GetMapping("/")
	public String init() {	// Redireciona para PormocaoController
		return "redirect:/promocao/add";
	}
}
