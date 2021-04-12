var pageNumber = 0;

// EFEITO INFINIT SCROLL

// Sabendo quando estamos rolando com o scroll do mouse
$(window).scroll(function() {
	
	var scrollTop = $(this).scrollTop();	// pegando valor atual da barra de rolagem
	var conteudo = $(document).height() - $(window).height();	// valor do conteúdo da página - tamanho da tela
	
	console.log('scrollTop: ', scrollTop, ' | ', 'conteudo', conteudo);
	
	// Quando Scrolltop for >= conteúdo, faremos uma requisição ajax
	if (scrollTop >= conteudo){
		pageNumber++;
		setTimeout(function(){
			loadByScrollBar(pageNumber);
		}, 200);
	}
 });
	
	// Função AJAX para fazer a paginação
function loadByScrollBar(pageNumber) {
	
	$.ajax({
		method: "GET",
		url: "/promocao/list/ajax",
		data: {
			page: pageNumber 
		},
		success: function( response ){
			console.log("resposta > ", response);
		}
	})
}