// Código dentro do "$(document).ready" será executado pelo jquery logo depois que a página HTML for aberta
$(document).ready(function() {
	moment.locale('pt-br');
	var table = $("#table-server").DataTable({

		processing: true,	// Informa ao usuário que os dados estão sendo carregados.
		serverSide: true,	// habilitar DataTable para trabalharmos do lado do servidor.
		responsive: true,	// Faz com que a tabela tenha o comportamento responsivo.
		lengthMenu: [10, 15, 20, 25],	// Tamanho do menu de páginas

		ajax: {
			url: "/promocao/datatables/server",
			data: "data"
		},
		// Informação referente as colunas, cada linha da tabela
		columns: [
			{ data: 'id' },
			{data: 'titulo'},
			{ data: 'site' },
			{ data: 'linkPromocao' },
			{ data: 'descricao' },
			{ data: 'linkImagem' },
			{ data: 'preco', render: $.fn.dataTable.render.number('.', ',', 2, 'R$ ') },	// Formatando para padrão brasileiro
			{ data: 'likes' },
			{ data: 'dtCadastro', render: 	// Formatando DATA padrão Brasil
					function(dtCadastro) {
						return moment(dtCadastro).format('LLL');
					}
			},
			{ data: 'categoria.titulo' }
		],

	// ====================================== INCLUINDO BOTÕES EDITER e EXCLUIR =====================================

		dom: 'Bfrtip',
		buttons: [
			{
				text: 'Editar',
				attr: {
					id: 'btn-editar',
					type: 'button'
				},
				enabled: false	// Desabilitar o botão assim que a página for aberta
			},
			{
				text: 'Excluir',
				attr: {
					id: 'btn-excluir',
					type: 'button'
				},
				enabled: false	// Desabilitar o botão assim que a página for aberta
			}
		]
	});
	
	// ============================ Ação para MARCAR/DESMARCAR botões ao clicarna ordenação =================================
	
	$("#table-server thead").on('click', 'tr', function() {
		table.buttons().disable();
	});
	
	// ====================================== Ação para MARCAR/DESMARCAR linhas clicadas =====================================
	
	$("#table-server tbody").on('click', 'tr', function() {
		if ($(this).hasClass('selected')) {		// Verificar se existe a classe 'selected'
			$(this).removeClass('selected');
			table.buttons().disable();
		} else {
			$('tr.selected').removeClass('selected');	// Removendo todas outras linhas selecionadas
			$(this).addClass('selected');
			table.buttons().enable();
		}
	});

	// Ação do botão EDITAR (abrir janela)
	$("#btn-editar").on('click', function() {
		if (isSelectedRow()) {
			var id = getPromoId();	// Pegando o ID
			
			// EDITANDO uma promoção
			$.ajax({
				method: "GET",
				url: "/promocao/edit/" + id,
				beforeSend: function() {
					// removendo as mensagens
					$("span").closest('.error-span').remove();
					// removendo as bordas vermelhas
					$(".is-invalid").removeClass("is-invalid");
					// Abrindo a janela
					$("#modal-form").modal('show');		
				},
				success: function( data ) {
					$("#edt_id").val(data.id);
					$("#edt_site").text(data.site);
					$("#edt_titulo").val(data.titulo);
					$("#edt_descricao").val(data.descricao);
					$("#edt_preco").val(data.preco.toLocaleString('pt-BR', {
						minimumFractionDigits: 2,	// Limitando o valor de centavos em 2 casa
						maximumFractionDigits: 2
					}));
					$("#edt_categoria").val(data.categoria.id);
					$("#edt_linkImagem").val(data.linkImagem);
					$("#edt_imagem").attr('src',data.linkImagem);
				},
				error: function() {
					alert("Ops... Ocorreu um erro, tente mais novamente.");
				}
			});
		}
	});

	// submit do formulario para editar
	$("#btn-edit-modal").on("click", function() {
		var promo = {}; 	// Criando obj promo e adicionando valor a cada uma das variáveis
		promo.descricao = $("#edt_descricao").val();
		promo.preco = $("#edt_preco").val();
		promo.titulo = $("#edt_titulo").val();
		promo.categoria = $("#edt_categoria").val();
		promo.linkImagem = $("#edt_linkImagem").val();
		promo.id = $("#edt_id").val();
		
		$.ajax({
			method: "POST",
			url: "/promocao/edit",
			data: promo,	// Responsável por enviar a variavel 'promo' para o servidor
			beforeSend: function() {
				// removendo as mensagens
				$("span").closest('.error-span').remove();
				// removendo as bordas vermelhas
				$(".is-invalid").removeClass("is-invalid");
			},
			success: function() {
				$("#modal-form").modal("hide");		// Fechando a janela
				table.ajax.reload();	// Atualizando a tela do navegador
			},
			statusCode: {
				422: function(xhr) {
					console.log('status error: ', xhr.status);
					var errors = $.parseJSON(xhr.responseText);		// pegando os campos que não passaram pela regra de validação
					$.each(errors, function(key, val){
						$("#edt_" + key).addClass("is-invalid"); // addClass = faz o BootsTrap adicionar a borda vermelha nos campos inválidos
						$("#error-" + key)
							.addClass("invalid-feedback")	// Coloca a mensagem com a cor vermelha
							.append("<span class='error-span'>" + val + "</span>")	// coloca entre a tag DIV a tag que esta dentro do append()
					});
				}
			}
		});
	});
	
	// Alterando a IMAGEM do componente <img> do modal
	$("#edt_linkImagem").on('change', function() {
		var link = $(this).val();	// pegando valor da nova url
		$("#edt_imagem").attr("src", link);	// Acessando ID da imagem
	});
	

	// Ação do botão EXCLUIR (abrir janela)
	$("#btn-excluir").on('click', function() {
		if (isSelectedRow()) {	
			$("#modal-delete").modal('show');
		}
	});
	
	// EXCLUIR uma promoção
	$("#btn-del-modal").on('click', function() {
		var id = getPromoId();	// Pegando o ID
		$.ajax({
			method: "GET",
			url: "/promocao/delete/" +id,
			success: function() {
				$("#modal-delete").modal('hide');	// Fechando a janela
				table.ajax.reload();	// Atualizando a tela do navegador
			},
			error: function() {
				alert("Ops... Ocorreu um erro, tente mais tarde.");
			}
		});
	});

	function getPromoId() {
		return table.row(table.$('tr.selected')).data().id;	// Recuperando o ID
	}
	
	function isSelectedRow() {
		var trow = table.row(table.$('tr.selected'));
		return trow.data() !== undefined
	}

});





