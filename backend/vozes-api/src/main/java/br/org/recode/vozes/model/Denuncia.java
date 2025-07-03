package br.org.recode.vozes.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name= "denuncias")// Define que esta classe é uma entidade JPA e está mapeada para a tabela "denuncias" no banco de dados
public class Denuncia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String nome;

    @Column
    private String email;

    @Column(nullable = false)
    private LocalDate data;

    @Column(nullable = false)
    private String localIncidente;

    @Column(columnDefinition = "TEXT", nullable = false) // Define que o campo é do tipo texto longo
    private String descricao;

    @OneToMany(mappedBy = "denuncia", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)//mappedBy indica que a relação é bidirecional e que o campo "denuncia" na classe Anexo é o responsável por mapear essa relação
    @JsonManagedReference
    private List<Anexo> anexos = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_autor", referencedColumnName = "id", nullable = true)
    private Usuario autor;

}
