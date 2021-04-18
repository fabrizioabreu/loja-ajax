package com.fabrizio.demoajax;

import org.directwebremoting.spring.DwrSpringServlet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ImportResource;

import com.fabrizio.demoajax.service.SocialMetaTagService;

@ImportResource(locations = "classpath:dwr-spring.xml")	// informando o caminho do xml
@SpringBootApplication
public class DemoAjaxApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(DemoAjaxApplication.class, args);
	}

	@Autowired
	SocialMetaTagService service;
	
	@Override
	public void run(String... args) throws Exception {
		
	}
	
	// ====================== Trabalhando com servlet ======================
	@Bean	// Transformando nosso método em um bean gerenciado pelo Spring
	public ServletRegistrationBean<DwrSpringServlet> dwrSpringServlet() {
		DwrSpringServlet dwrServlet = new DwrSpringServlet();
		
		ServletRegistrationBean<DwrSpringServlet> registrationBean =
				new ServletRegistrationBean<>(dwrServlet, "/dwr/*");
		// inserindo alguns parâmetros de inicialização
		registrationBean.addInitParameter("debug", "true");	// Retorna Informações no log da aplicação sobre qualquer problema
		registrationBean.addInitParameter("activeReverseAjaxEnabled", "true");
		return registrationBean;
	}

}
