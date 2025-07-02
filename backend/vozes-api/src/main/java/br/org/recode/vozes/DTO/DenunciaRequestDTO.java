package br.org.recode.vozes.DTO;

import java.time.LocalDate;
import java.util.List;

public record DenunciaRequestDTO(
        String nome,
        String email,
        LocalDate data,
        String localIncidente,
        String descricao,
        List<AnexoRequestDTO> anexos
) {
}
