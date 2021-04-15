// Código dentro do "$(document).ready" será executado pelo jquery logo depois que a página HTML for aberta
$(document).ready(function(){
	moment.locale('pt-br');
	$("#table-server").DataTable({
		
		processing: true,	// Informa ao usuário que os dados estão sendo carregados.
		serverSide: true,	// habilitar DataTable para trabalharmos do lado do servidor.
		responsive: true,	// Faz com que a tabela tenha o comportamento responsivo.
		lengthMenu: [ 10, 15, 20, 25 ],	// Tamanho do menu de páginas
		
		ajax: {
			url: "/promocao/datatables/server",
			data: "data"
		},
		// Informação referente as colunas, cada linha da tabela
		columns: [
			{data: 'id'},
			{data: 'titulo'},
			{data: 'site'},
			{data: 'linkPromocao'},
			{data: 'descricao'},
			{data: 'linkImagem'},
			{data: 'preco', render: $.fn.dataTable.render.number('.', ',', 2, 'R$ ')},	// Formatando para padrão brasileiro
			{data: 'likes'},
			{data: 'dtCadastro', render: 	// Formatando DATA padrão Brasil
					function(dtCadastro) {
						return moment( dtCadastro ).format('LLL');
					}
			},	
			{data: 'categoria.titulo'}
		]
	});
});