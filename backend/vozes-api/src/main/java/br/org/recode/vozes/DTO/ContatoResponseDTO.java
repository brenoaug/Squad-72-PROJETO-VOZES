package br.org.recode.vozes.DTO;

import br.org.recode.vozes.model.Contato;

public record ContatoResponseDTO(
        Long idContato,
        String nome,
        String email,
        String mensagem
) {
    public ContatoResponseDTO(Contato contato) {
        this(
                contato.getIdContato(),
                contato.getNome(),
                contato.getEmail(),
                contato.getMensagem()
        );
    }
}
