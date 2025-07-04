package br.org.recode.vozes.model;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.model.enums.TipoProfissional;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@DiscriminatorValue("PROFISSIONAL")
public class Profissional extends Usuario {

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_profissional")
    private TipoProfissional tipoProfissional;

    public Profissional(ProfissionalRequestDTO data) {
        // Campos da superclasse Usuario
        this.setNome(data.nome());
        this.setEmail(data.email());
        this.setSenha(data.senha());
        this.setTelefone(data.telefone());
        this.setLocalizacao(data.localizacao());
        this.setTipoProfissional(data.tipoProfissional());
    }
}