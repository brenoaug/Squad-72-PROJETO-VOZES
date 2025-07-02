package br.org.recode.vozes.model;

import br.org.recode.vozes.model.enums.TipoArquivo;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "anexos") // Define que esta classe é uma entidade JPA e está mapeada para a tabela "anexos" no banco de dados
public class Anexo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAnexo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoArquivo tipoArquivo;

    @Column(nullable = false)
    private String caminhoArquivo;

    @ManyToOne(fetch = FetchType.LAZY)// fetch = FetchType.LAZY significa que os dados da entidade Denuncia não serão carregados até que sejam explicitamente solicitados
    @JoinColumn(name = "idDenuncia", nullable = false)// Define a coluna de junção que relaciona este anexo com uma denúncia
    @JsonBackReference
    private Denuncia denuncia;
}
