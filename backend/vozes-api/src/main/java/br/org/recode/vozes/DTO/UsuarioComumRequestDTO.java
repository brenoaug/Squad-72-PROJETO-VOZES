package br.org.recode.vozes.DTO;

public record UsuarioComumRequestDTO (
        String nome,
        String email,
        String senha,
        String telefone,
        String localizacao
) {
}
