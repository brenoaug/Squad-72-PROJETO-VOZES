package br.org.recode.vozes.DTO;

import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.model.enums.TipoProfissional;

public record ProfissionalResponseDTO (Long id,
                                       String nome,
                                       String email,
                                       String telefone,
                                       String localizacao,
                                       TipoProfissional tipoProfissional) {
    public ProfissionalResponseDTO(Profissional profissional) {
      this(
          profissional.getId(),
          profissional.getNome(),
          profissional.getEmail(),
          profissional.getTelefone(),
          profissional.getLocalizacao(),
          profissional.getTipoProfissional()
      );
    }
}
