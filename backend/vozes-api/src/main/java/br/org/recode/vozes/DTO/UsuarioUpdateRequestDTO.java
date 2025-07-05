package br.org.recode.vozes.DTO;

import br.org.recode.vozes.model.enums.TipoProfissional;

// Este DTO é flexível e pode ser usado para atualizar qualquer tipo de usuário.
// Os campos que não forem enviados no JSON serão nulos.
public record UsuarioUpdateRequestDTO(
        String nome,
        String email,
        String telefone,
        String localizacao,
        TipoProfissional tipoProfissional // Este campo só será enviado se o usuário for profissional
) {}