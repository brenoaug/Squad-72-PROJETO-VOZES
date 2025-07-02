package br.org.recode.vozes.repository;

import br.org.recode.vozes.model.Denuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {
}
