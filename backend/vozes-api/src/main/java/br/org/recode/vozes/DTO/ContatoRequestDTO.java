package br.org.recode.vozes.DTO;

public record ContatoRequestDTO(
        String nome,
        String email,
        String mensagem
) {
}
