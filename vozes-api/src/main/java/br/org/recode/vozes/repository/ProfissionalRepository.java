package br.org.recode.vozes.repository;

import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.model.enums.TipoProfissional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    List<Profissional> findByTipoProfissional(TipoProfissional tipoProfissional);
}
