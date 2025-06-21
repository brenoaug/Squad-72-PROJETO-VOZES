package br.org.recode.vozes.repository;

import br.org.recode.vozes.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
}// Interface para o repositório de Profissional, estendendo JpaRepository para operações CRUD
