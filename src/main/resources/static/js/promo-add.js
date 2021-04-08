// Funcao para capturar as metatags
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
			success: function(data) {
				console.log(data);	// Passamos uma função que vai receber o resultado da operação
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