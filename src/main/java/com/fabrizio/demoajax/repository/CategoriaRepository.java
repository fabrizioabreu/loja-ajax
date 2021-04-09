package com.fabrizio.demoajax.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fabrizio.demoajax.domain.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

}
