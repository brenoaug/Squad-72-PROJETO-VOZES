package br.org.recode.vozes.repository;

import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.model.UsuarioComum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // PARA BUSCAR APENAS OS PROFISSIONAIS
    // Usamos @Query para escrever uma consulta em JPQL (Java Persistence Query Language)
    // "SELECT p FROM Profissional p" diz ao JPA: "Busque na tabela 'usuarios',
    // mas retorne apenas as linhas onde o tipo_usuario é 'PROFISSIONAL',
    // e me entregue como objetos do tipo Profissional".
    @Query("SELECT p FROM Profissional p")
    Page<Profissional> findAllProfissionais(Pageable pageable);

    @Query("SELECT u FROM UsuarioComum u")
    Page<UsuarioComum> findAllComuns(Pageable pageable);

    Optional<Usuario> findByEmail(String email);
}