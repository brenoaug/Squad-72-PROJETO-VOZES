package br.org.recode.vozes.DTO;

import br.org.recode.vozes.model.enums.TipoProfissional;


public record ProfissionalRequestDTO(
        String nome,
        String email,
        String senha,
        String telefone,
        String localizacao,
        TipoProfissional tipoProfissional // Campo específico do profissional
) {
}