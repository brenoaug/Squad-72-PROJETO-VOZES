package br.org.recode.vozes.model;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.model.enums.TipoProfissional;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Lombok vai gerar os getters e setters automaticamente
@NoArgsConstructor // lombok vai gerar o construtor sem argumentos
@AllArgsConstructor // lombok vai gerar o construtor com todos os argumentos
@Entity(name = "profissionais") // estou dizendo que essa classe é uma entidade JPA
@Table(name = "profissionais") // estou dizendo que essa classe está mapeada para a tabela "profissionais" no banco de dados
public class Profissional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // o valor do id é automatico e é ordernado, ou seja, 1, 2, 3, etc.
    private Long id;

    @Column(nullable = false)// uma coluna que não pode ser nula
    private String nome;

    @Column(nullable = false, unique = true)//uma coluna que não pode ser nula e deve ser única
    private String email;
    private String telefone;

    @Column(nullable = false)
    private String localizacao;

    @Enumerated(EnumType.STRING)// indica que o tipo enum(ADVOGADO ou PSICOLOGO) será armazenado como uma string no banco de dados
    @Column(nullable = false)
    private TipoProfissional tipoProfissional;

    public Profissional(ProfissionalRequestDTO data) {
        this.nome = data.nome();
        this.email = data.email();
        this.telefone = data.telefone();
        this.localizacao = data.localizacao();
        this.tipoProfissional = data.tipoProfissional();
    }// Construtor que recebe um ProfissionalRequestDTO e inicializa os campos da entidade Profissional

}
