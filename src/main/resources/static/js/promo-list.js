var pageNumber = 0;

// ===================================== EFEITO INFINIT SCROLL =====================================

// Rotina de quando abrirmos a página pela primeira vez.
$(document).ready(function(){
	$("#loader-img").hide();	// Escondendo o load
	$("#fim-btn").hide();	// Escondendo o load
});

// Sabendo quando estamos rolando com o scroll do mouse
$(window).scroll(function() {
	
	var scrollTop = Math.ceil($(this).scrollTop());	// pegando valor atual da barra de rolagem
	// var conteudo = $(document).height() - $(window).height();	// valor do conteúdo da página - tamanho da tela
	var conteudo = Math.ceil($(document).height()) - Math.ceil($(window).height());
	
	
	console.log('scrollTop: ', scrollTop, ' | ', 'conteudo', conteudo);
	
	// Quando Scrolltop for >= conteúdo, faremos uma requisição ajax
	if (scrollTop >= conteudo){
		pageNumber++;
		setTimeout(function(){
			loadByScrollBar(pageNumber);
		}, 200);
	}
 });
	
// ===================================== Função AJAX para fazer a paginação =====================================
function loadByScrollBar(pageNumber) {
	
	$.ajax({
		method: "GET",
		url: "/promocao/list/ajax",
		data: {
			page: pageNumber 
		},
		beforeSend: function() {
			$("#loader-img").show();	// Quando a função iniciar, mostramos a imagem de load.
		},
		success: function( response ){
			// console.log("resposta > ", response);
			
			if(response.length > 150) {
				$('.row').append( $(response).hide().fadeIn(400) );
			}
			else{
				$("#fim-btn").show();	// Mostra o botão
				$("#loader-img").removeClass("loader");	// Removemos o load.
			}
		},
		error: function(xhr) {
			alert("Ops, ocorrou um erro: " + xhr.status + " - " + xhr.statusText);
		},
		complete: function() {
			$("#loader-img").hide();	// Ao completar, escondemos a imagem de load.
		}
	})
}

// ===================================== AUTOCOMPLETE =====================================
$("#autocomplete-input").autocomplete({		// https://jqueryui.com/autocomplete/
	source: function(request, response) {
		$.ajax({
			method: "GET",
			url: "/promocao/site",
			data: {
				// capturando os valores digitados e adicionado a variável termo
				termo: request.term
			},
			success: function(result) {
				response(result);
			}
		});
	}
});

// ===================================== ADICIONAR LIKES =====================================

// Reconhecendo o botão que foi clicado pelo ID
$(document).on("click", "button[id*='likes-btn-']", function() {
	var id = $(this).attr("id").split("-")[2];
	console.log("id: ", id);
	
	// Fazendo a requisição com AJAX
	$.ajax({
		method: "POST",
		url: "/promocao/like/" + id,
		success: function(response) {
			$("#likes-count-" + id).text(response);
		},
		error: function(xhr) {
			alert("Ops, ocorreu um erro: " + xhr.status + ", " + xhr.statusText);
		}
	});
});










