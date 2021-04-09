// SUBMIT do formulario para o controller
$("#form-add-promo").submit(function(evt) {
	// bloquear o comportamento padrão do submit
	evt.preventDefault();
	
	var promo = {}; 	// Criando obj promo e adicionando valor a cada uma das variáveis
	promo.linkPromocao = $("#linkPromocao").val();
	promo.descricao = $("#descricao").val();
	promo.preco = $("#preco").val();
	promo.titulo = $("#titulo").val();
	promo.categoria = $("#categoria").val();
	promo.linkImage = $("#linkImagem").attr("src");
	promo.site = $("#site").text();
	
	console.log('promo > ', promo);	// Imprime o resultado no console do navegador
	
	$.ajax({
		method: "POST",
		url: "/promocao/save",
		data: promo,	// passando os atributos do obj promo
		success: function() {
			// Enviando mensagem de sucesso para usuáiro
			$("#alert").addClass("alert alert-success").text("OK! Promoção cadastrada com sucesso.");
		},
		error: function(xhr) {
			// Capturando mensagem de erro
			console.log("> error: ", xhr.responseText);
			$("#alert").addClass("alert alert-danger").text("Não foi possível salvar esta promoção.");
		}
	});
});





// Funcao para CAPTURAR as metatags
$("#linkPromocao").on('change', function() {
	//Capturnado URL do campo de imput
	var url = $(this).val();

	// Verificando se tem uma url no campo de imput 'http://'
	if (url.length > 7) {
		// Incluindo método de requisição baseado em AJAX
		$.ajax({
			method: "POST",
			url: "/meta/info?url=" + url, // Caminho do SocialMetaTagController
			cache: false, // Não iremos fazer uso de cache
			beforeSend: function() {	// Limpando dados do formulário
				$("#alert").removeClass("alert alert-danger").text('');
				$("#titulo").val("");
				$("#site").text("");
				$("#linkImagem").attr("src", "");
				$("#loader-img").addClass("loader");
			},
			success: function(data) { // data = obj que vai reveber o resultado da operação
				console.log(data);	// Imprime o resultado no console do navegador
				// Acessando o componente HTML que vai receber as informações
				$("#titulo").val(data.title);
				$("#site").text(data.site.replace("@", ""));
				$("#linkImagem").attr("src", data.image);
			},
			// Função para ERRO 404
			statusCode: {
				404: function() {
					// Adicionando Classe de alerta do Bootstrap
					$("#alert").addClass("alert alert-danger").text("Nenhuma informação pode ser recuperada dessa url");
					$("#linkImagem").attr("src", "/images/promo-dark.png");
				}
			},
			error: function() {
				$("#alert").addClass("alert alert-danger").text("Ops... algo deu errado, tente mais tarde.");
				$("#linkImagem").attr("src", "/images/promo-dark.png");
			},
			complete: function() {
				$("#loader-img").removeClass("loader");
			}
		});
	}
});