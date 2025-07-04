package br.org.recode.vozes.DTO;

import br.org.recode.vozes.model.Anexo;
import br.org.recode.vozes.model.enums.TipoArquivo;

public record AnexoResponseDTO(
        Long idAnexo,
        TipoArquivo tipoArquivo,
        String caminhoArquivo
) {
    // Construtor que converte uma entidade Anexo para este DTO
    public AnexoResponseDTO(Anexo anexo) {
        this(
                anexo.getIdAnexo(),
                anexo.getTipoArquivo(),
                anexo.getCaminhoArquivo() // Por enquanto, retornamos o caminho direto
        );
    }
}