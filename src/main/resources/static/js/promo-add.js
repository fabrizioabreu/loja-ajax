// SUBMIT do formulario para o controller
$("#form-add-promo").submit(function (evt) {	
	evt.preventDefault();	// bloquear o comportamento padrão do submit
	
	var promo = {}; 	// Criando obj promo e adicionando valor a cada uma das variáveis
	promo.linkPromocao = $("#linkPromocao").val();
	promo.descricao = $("#descricao").val();
	promo.preco = $("#preco").val();
	promo.titulo = $("#titulo").val();
	promo.categoria = $("#categoria").val();
	promo.linkImagem = $("#linkImagem").attr("src");
	promo.site = $("#site").text();
	
	console.log('promo > ', promo);	// Imprime o resultado no console do navegador
	
	$.ajax({
		method: "POST",
		url: "/promocao/save",
		data: promo,	// passando os atributos do obj promo
		beforeSend: function() {
			$("#form-add-promo").hide();	// Escondendo formulário da página
			$("#loader-form").addClass("loader").show();	// Mostrando pro usuario o carregamento da página
		},
		success: function() {
			// Limpando todos os campos após salvar o item
			$("#form-add-promo").each(function() {	 // each do Jquery trata cada objeto do 'form', como se fosse uma lista
				this.reset();
			});
			// Limpando os campos que estão fora do 'form'
			$("#linkImagem").attr("src", "/images/promo-dark.png");
			$("#site").text("");
			
			// Enviando mensagem de sucesso para usuáiro
			$("#alert").addClass("alert alert-success").text("OK! Promoção cadastrada com sucesso.");
		},
		statusCode: {
			422: function(xhr) {
				console.log('status error: ', xhr.status);
				var errors = $.parseJSON(xhr.responseText);		// pegando os campos que não passaram pela regra de validação
				$.each(errors, function(key, val){
					$("#" + key).addClass("is-invalid"); // addClass = faz o BootsTrap adicionar a borda vermelha nos campos inválidos
					$("#error-" + key)
						.addClass("invalid-feedback")	// Coloca a mensagem com a cor vermelha
						.append("<span class='error-span'>" + val + "</span>")	// coloca entre a tag DIV a tag que esta dentro do append()
				});
			}
		},
		error: function(xhr) {
			// Capturando mensagem de erro
			console.log("> error: ", xhr.responseText);
			$("#alert").addClass("alert alert-danger").text("Não foi possível salvar esta promoção.");
		},
		complete: function() {
			$("#loader-form").fadeOut(800, function() {		// Escondendo com transição suave
				$("#form-add-promo").fadeIn(250); 
				$("#loader-form").removeClass("loader");
			});	
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
				$("#alert").removeClass("alert alert-danger alert-success").text(''); // Limpando mensagem de erro e sucesso
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