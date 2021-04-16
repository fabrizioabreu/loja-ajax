package com.fabrizio.demoajax.web.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.fabrizio.demoajax.domain.Categoria;
import com.fabrizio.demoajax.domain.Promocao;
import com.fabrizio.demoajax.repository.CategoriaRepository;
import com.fabrizio.demoajax.repository.PromocaoRepository;
import com.fabrizio.demoajax.service.PromocaoDataTablesService;

@Controller
@RequestMapping("/promocao")
public class PromocaoController {

	// Imprimindo os log no console
	private static Logger log = LoggerFactory.getLogger(PromocaoController.class);
	
	@Autowired
	private PromocaoRepository promocaoRepository;
	@Autowired
	private CategoriaRepository categoriaRepository;
	
	// ====================================== DATATABLES =====================================
	
	// Método responsável por abrir a página para nós
	@GetMapping("/tabela")
	public String showTabela() {
		return "promo-datatables";
	}
	
	// Receber e responder a requisição AJAX que criamos para o Datatables.
	
	@GetMapping("/datatables/server")
	public ResponseEntity<?> datatables(HttpServletRequest request) {
		Map<String, Object> data = new PromocaoDataTablesService().execute(promocaoRepository, request);
		return ResponseEntity.ok(data);
	}
	
	// Método que vai fazer a exclusão
	@GetMapping("/delete/{id}")
	public ResponseEntity<?> excluirPromocao(@PathVariable("id") Long id){
		promocaoRepository.deleteById(id);
		return ResponseEntity.ok().build();
	}
	
	// ===================================== AUTOCOMPLETE ====================================
	
	// Método que recebe a requisição e retorna a lista com o nome dos sites
	@GetMapping("/site")
	public ResponseEntity<?> autocompleteByTermo(@RequestParam("termo") String termo){
		List<String> sites = promocaoRepository.findSitesByTermo(termo);
		return ResponseEntity.ok(sites);
	}
	
	@GetMapping("/site/list")
	public String listarPorSite(@RequestParam("site") String site, ModelMap model) {
		// ordenando os itens da lista
		Sort sort = Sort.by(Sort.Direction.DESC, "dtCadastro");
		// Criando limite de 8 registro
		PageRequest pageRequest = PageRequest.of(0, 8, sort);
		// Enviando lista de promoções
		model.addAttribute("promocoes", promocaoRepository.findBySite(site, pageRequest));
		return "promo-card";
	}
	
	// ====================================== ADD LIKES ======================================
	
		@PostMapping("/like/{id}")	// {id} = vai receber o valor do id da URL
		public ResponseEntity<?> adicionarLikes(@PathVariable("id") Long id) {	// Capturando da URL o valor ID da promoção
			promocaoRepository.updateSomarLikes(id);
			int likes = promocaoRepository.findLikesById(id);
			return ResponseEntity.ok(likes);
		}
		
	// =================================== LISTAR OFERTAS ====================================
	
	@GetMapping("/list")
	public String listarOfertas(ModelMap model) {
		// ordenando os itens da lista
		Sort sort = Sort.by(Sort.Direction.DESC, "dtCadastro");
		// Criando limite de 8 registro
		PageRequest pageRequest = PageRequest.of(0, 8, sort);
		// Enviando lista de promoções
		model.addAttribute("promocoes", promocaoRepository.findAll(pageRequest));
		return "promo-list";
	}
	
	@GetMapping("/list/ajax")
	public String listarCards(@RequestParam(name = "page", defaultValue = "1") int page,
								@RequestParam(name = "site", defaultValue = "") String site,
								ModelMap model) {
		// ordenando os itens da lista
		Sort sort = Sort.by(Sort.Direction.DESC, "dtCadastro");
		// Criando limite de 8 registro
		PageRequest pageRequest = PageRequest.of(page, 8, sort);
		
		if (site.isEmpty()) {
			// Enviando todas as promoções
			model.addAttribute("promocoes", promocaoRepository.findAll(pageRequest));
		}else {
			// Enviando promoção da busca por nome
			model.addAttribute("promocoes", promocaoRepository.findBySite(site, pageRequest));
		}
		
		return "promo-card";
	}
	
	// ===================================== ADD OFERTAS =====================================
	
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
