package br.org.recode.vozes.model;

import br.org.recode.vozes.model.enums.TipoProfissional;
import jakarta.persistence.*;
import lombok.Data;

@Data // getter e setters
@Entity //uma tabela do bd
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



}
