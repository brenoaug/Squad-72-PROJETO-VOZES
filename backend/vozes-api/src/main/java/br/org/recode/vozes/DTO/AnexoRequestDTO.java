package br.org.recode.vozes.DTO;

import br.org.recode.vozes.model.enums.TipoArquivo;

public record AnexoRequestDTO(
        TipoArquivo tipoArquivo,
        String caminhoArquivo
) {
}
