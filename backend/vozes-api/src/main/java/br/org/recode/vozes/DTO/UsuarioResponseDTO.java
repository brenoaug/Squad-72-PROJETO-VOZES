package br.org.recode.vozes.DTO;

import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.model.enums.Role;
import br.org.recode.vozes.model.enums.TipoProfissional;
import br.org.recode.vozes.model.enums.TipoUsuario;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String telefone,
        String localizacao,
        Role role,
        TipoUsuario tipoUsuario, // Ex: "COMUM" ou "PROFISSIONAL"
        TipoProfissional tipoProfissional // Será nulo se não for profissional
) {
    public UsuarioResponseDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getLocalizacao(),
                usuario.getRole(),
                // Pega o tipo de usuário do enum (COMUM ou PROFISSIONAL)
                (usuario instanceof Profissional) ? TipoUsuario.PROFISSIONAL : TipoUsuario.COMUM,
                // Se for um profissional, pega o tipo, senão, deixa nulo
                (usuario instanceof Profissional p) ? p.getTipoProfissional() : null
        );
    }
}