package com.fabrizio.demoajax.web.dwr;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.directwebremoting.Browser;
import org.directwebremoting.ScriptSessions;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Component;

import com.fabrizio.demoajax.repository.PromocaoRepository;

@Component
@RemoteProxy	// Configuração de Proxy entre SERVIDOR e CLIENTE via DWR
public class DWRAlertaPromocoes {

	@Autowired
	private PromocaoRepository repository;
	
	private Timer timer;
	
	private LocalDateTime getDtCadastroByUltimaPromocao() {
		// Trazendo a data mais recende que temos no banco de dados
		PageRequest pageRequest = PageRequest.of(0, 1, Direction.DESC, "dtCadastro");
		return repository.findUltimaDataDePromocao(pageRequest)
				.getContent()
				.get(0);
	}
	
	@RemoteMethod	// Fazer a relação entreo o método INIT do servidor com o INIT do cliente (promo-list.js)
	public synchronized void init() {
		System.out.println("DWR está ativado!");
		
		LocalDateTime lastDate = getDtCadastroByUltimaPromocao();
		
		WebContext context = WebContextFactory.get();
		
		timer = new Timer();
		timer.schedule(new AlertTask(context, lastDate), 10000, 60000);	// Método de agendamento de tarefas
	}
	
	class AlertTask extends TimerTask {

		private LocalDateTime lastDate;
		private WebContext context;
		private long count;
		
		public AlertTask(WebContext context, LocalDateTime lastDate) {
			super();
			this.lastDate = lastDate;
			this.context = context;
		}

		@Override		
		public void run() {		// run: Do agendamento de tarefas
			String session = context.getScriptSession().getId();	// Pegando ID da session
			Browser.withSession(context, session, new Runnable() {

				@Override
				public void run() {		// run: da DWR para trabalhar com o Ajax reverso
					
					Map<String, Object> map = repository.totalEUltimaPromocaoDeDataCadastro(lastDate);
					
					count = (Long) map.get("count");	// Recuperando o total de promoções
					lastDate = map.get("lastDate") == null 	// Recuperando o valor da última data
							? lastDate 
							: (LocalDateTime) map.get("lastDate");
					
					Calendar time = Calendar.getInstance();
					// mostra o horário da última tentativa de acesso do DWR do lado Cliente
					time.setTimeInMillis(context.getScriptSession().getLastAccessedTime());	
					System.out.println("count: " + count + ", lastDate: " + lastDate
							+ "<" + session + "> " + " <" + time.getTime() + ">");
					
					// Verificando se existe pelo menos uma nova promoção
					if (count > 0) {
						ScriptSessions.addFunctionCall("showButton", count);
					}
				}
			});
		}
	}
}
