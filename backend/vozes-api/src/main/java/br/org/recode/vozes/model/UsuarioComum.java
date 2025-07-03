package br.org.recode.vozes.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true) // Importante para herança com Lombok
@Entity
@DiscriminatorValue("COMUM") // Valor que será salvo na coluna 'tipo_usuario'
public class UsuarioComum extends Usuario {

}