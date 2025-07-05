package br.org.recode.vozes.DTO;

public record LoginResponseDTO(String token,
                               UsuarioResponseDTO usuario) {
}