package com.fabrizio.demoajax;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.fabrizio.demoajax.domain.SocialMetaTag;
import com.fabrizio.demoajax.service.SocialMetaTagService;

@SpringBootApplication
public class DemoAjaxApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(DemoAjaxApplication.class, args);
	}

	@Autowired
	SocialMetaTagService service;
	
	@Override
	public void run(String... args) throws Exception {
		
		SocialMetaTag tag = service.getSocialMetaTagByUrl("https://www.pichau.com.br/");
		System.out.println(tag);
		
	}

}
