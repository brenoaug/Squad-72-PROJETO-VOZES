package br.org.recode.vozes.DTO;

import br.org.recode.vozes.model.enums.TipoProfissional;

public record ProfissionalRequestDTO(String nome,
                                     String email,
                                     String telefone,
                                     String localizacao,
                                     TipoProfissional tipoProfissional) {
}
