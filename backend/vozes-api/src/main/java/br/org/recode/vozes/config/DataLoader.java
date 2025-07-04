package br.org.recode.vozes.config;

import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.model.UsuarioComum;
import br.org.recode.vozes.model.enums.Role;
import br.org.recode.vozes.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verifica se já existe um usuário ADMIN
        if (usuarioRepository.findByRole(Role.ADMIN).isEmpty()) {
            System.out.println("Nenhum usuário ADMIN encontrado, criando um novo...");

            // Cria um novo usuário ADMIN
            UsuarioComum admin = new UsuarioComum();
            admin.setNome("Admin");
            admin.setEmail("admin@vozes.org");
            admin.setSenha(passwordEncoder.encode("admin123")); // Use uma senha forte em produção!
            admin.setRole(Role.ADMIN);
            admin.setTelefone("(00) 00000-0000");
            admin.setLocalizacao("Sede Administrativa");

            usuarioRepository.save(admin);
            System.out.println("Usuário ADMIN criado com sucesso!");
        } else {
            System.out.println("Usuário ADMIN já existe.");
        }
    }
}