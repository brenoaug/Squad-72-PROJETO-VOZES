package br.org.recode.vozes.repository;

import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.model.UsuarioComum;
import br.org.recode.vozes.model.enums.Role;
import br.org.recode.vozes.model.enums.TipoProfissional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query("SELECT p FROM Profissional p")
    Page<Profissional> findAllProfissionais(Pageable pageable);

    @Query("SELECT u FROM UsuarioComum u")
    Page<UsuarioComum> findAllComuns(Pageable pageable);

    @Query("SELECT p FROM Profissional p WHERE (:tipo IS NULL OR p.tipoProfissional = :tipo)")
    Page<Profissional> findAllProfissionais(Pageable pageable, @Param("tipo") TipoProfissional tipo);

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByRole(Role role);
}