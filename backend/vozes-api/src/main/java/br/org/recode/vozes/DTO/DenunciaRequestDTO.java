package br.org.recode.vozes.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.List;

public record DenunciaRequestDTO(
        String nome,
        String email,
        LocalDate data,
        @JsonProperty("localincidente")
        String localIncidente,
        String descricao,
        List<AnexoRequestDTO> anexos
) {
}
