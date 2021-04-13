// Código dentro do "$(document).ready" será executado pelo jquery logo depois que a página HTML for aberta
$(document).ready(function(){
	
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
			{data: 'preco'},
			{data: 'likes'},
			{data: 'dtCadastro'},
			{data: 'categoria.titulo'}
		]
	});
});