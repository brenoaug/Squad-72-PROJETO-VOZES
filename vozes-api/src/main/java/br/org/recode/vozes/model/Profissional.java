package br.org.recode.vozes.model;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.model.enums.TipoProfissional;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Lombok vai gerar os getters e setters automaticamente
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "profissionais") //uma tabela do bd
@Table(name = "profissionais") //estou dizendo o nome da tabela
public class Profissional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // o valor do id é automatico
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;
    private String telefone;

    @Column(nullable = false)
    private String localizacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoProfissional tipoProfissional;

    public Profissional(ProfissionalRequestDTO data) {
        this.nome = data.nome();
        this.email = data.email();
        this.telefone = data.telefone();
        this.localizacao = data.localizacao();
        this.tipoProfissional = data.tipoProfissional();
    }
}
