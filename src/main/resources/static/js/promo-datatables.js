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
			$("#modal-form").modal('show');
		}
	});

	// Ação do botão EXCLUIR (abrir janela)
	$("#btn-excluir").on('click', function() {
		if (isSelectedRow()) {	
			$("#modal-delete").modal('show');
		}
	});
	
	// EXCLUIR uma promoção
	$("#btn-del-modal").on('click', function() {
		var id = getPromoId();
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





