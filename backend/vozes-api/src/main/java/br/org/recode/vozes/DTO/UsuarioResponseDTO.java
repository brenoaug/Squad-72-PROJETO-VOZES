package br.org.recode.vozes.DTO;

import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.model.enums.TipoProfissional;

public record UsuarioResponseDTO(
        Long id,
        String nome,
        String email,
        String telefone,
        String localizacao,
        String tipoUsuario, // Ex: "COMUM" ou "PROFISSIONAL"
        TipoProfissional tipoProfissional // Será nulo se não for profissional
) {
    public UsuarioResponseDTO(Usuario usuario) {
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone(),
                usuario.getLocalizacao(),
                // Pega o tipo de usuário da classe (COMUM ou PROFISSIONAL)
                usuario.getClass().getSimpleName().equals("UsuarioComum") ? "COMUM" : "PROFISSIONAL",
                // Se for um profissional, pega o tipo, senão, deixa nulo
                (usuario instanceof Profissional p) ? p.getTipoProfissional() : null
        );
    }
}