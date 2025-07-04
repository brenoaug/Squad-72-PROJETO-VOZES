package br.org.recode.vozes.DTO;

import br.org.recode.vozes.model.Denuncia;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public record DenunciaResponseDTO(
        Long id,
        String nome,
        String email,
        LocalDate data,
        String localIncidente,
        String descricao,
        Long idAutor,
        List<AnexoResponseDTO> anexos
) {
    public DenunciaResponseDTO(Denuncia denuncia) {
        this(
                denuncia.getId(),
                denuncia.getNome(),
                denuncia.getEmail(),
                denuncia.getData(),
                denuncia.getLocalIncidente(),
                denuncia.getDescricao(),
                // Verifica se existe um autor antes de tentar pegar o ID
                denuncia.getAutor() != null ? denuncia.getAutor().getId() : null,
                denuncia.getAnexos().stream()
                        .map(AnexoResponseDTO::new)
                        .collect(Collectors.toList())
        );
    }
}
