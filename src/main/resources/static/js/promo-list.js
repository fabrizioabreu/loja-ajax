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
	
// ================================ Função AJAX para fazer a paginação ================================
function loadByScrollBar(pageNumber) {
	var site = $("#autocomplete-input").val();	// Recuperando o nome do site que temos no campo de input
	$.ajax({
		method: "GET",
		url: "/promocao/list/ajax",
		data: {
			page: pageNumber,
			site: site
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

// =========================================== AUTOCOMPLETE ===========================================
	
	// ********* FAZENDO A BUSCA DOS SITES *********
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

	// ********* BOTÃO CONFIRMAR *********
	
$("#autocomplete-submit").on("click", function() {
	var site = $("#autocomplete-input").val();	// Recuperando o nome do site que temos no campo de input
	$.ajax({
		method: "GET",
		url: "/promocao/site/list",
		data: {
			site : site	// levando o nome do site, para o lado do servidor
		},
		beforeSend: function() {
			pageNumber = 0;
			$("#fim-btn").hide();
			$(".row").fadeOut(400, function() {
				$(this).empty();	// Limpando os cards da página
			});
		},
		success: function(response) {
			$(".row").fadeIn(250, function() {
				$(this).append(response);	// Incluindo os cards na página
			});
		},
		error: function(xhr) {
			alert("Ops, algo deu errado: " + xhr.status + ", " + xhr.statusText);
		}
	});
});
	
// ========================================== ADICIONAR LIKES ===========================================

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

// ========================================== AJAX REVERSO DWR ===========================================
var totalOfertas = 0;
// Função que vai abrir a comunicação entre CLIENT e SERVIDOR
function init() {
	console.log("dwr init...");
	// Habilitando AJAX REVERSE no lado do cliente
	dwr.engine.setActiveReverseAjax(true);
	dwr.engine.setErrorHandler(error);	// Capturando mensagem de erro
	
	DWRAlertaPromocoes.init();	// Método para abrir canal de comunicação entre Client e Servidor
}

function error(exception) {
	console.log("dwr error: ", exception);
}

// Função responsável a receber as informações que o SERVIDOR esta enviando para o CLIENTE
function showButton(count) {
	totalOfertas = totalOfertas + count;
	$("#btn-alert").show(function() {	// Exibindo botão na página
		$(this).attr("style", "display: block;")
		.text("Veja " + totalOfertas + " nova(s) oferta(s)!");
	})
	
}




