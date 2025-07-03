package br.org.recode.vozes.service;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.DTO.ProfissionalResponseDTO;
import br.org.recode.vozes.DTO.UsuarioComumRequestDTO;
import br.org.recode.vozes.DTO.UsuarioResponseDTO;
import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.model.UsuarioComum;
import br.org.recode.vozes.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder; // IMPORTANTE
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // CORREÇÃO 1: Injetando o PasswordEncoder para criptografar senhas
    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- MÉTODOS DE CRIAÇÃO ---

    @Transactional
    public Usuario criarUsuarioComum(UsuarioComumRequestDTO data) {
        if (usuarioRepository.findByEmail(data.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado.");
        }
        UsuarioComum novoUsuario = new UsuarioComum();
        novoUsuario.setNome(data.nome());
        novoUsuario.setEmail(data.email());
        novoUsuario.setSenha(passwordEncoder.encode(data.senha())); // Agora funciona
        novoUsuario.setTelefone(data.telefone());
        novoUsuario.setLocalizacao(data.localizacao());
        return usuarioRepository.save(novoUsuario);
    }

    @Transactional
    public Profissional criarProfissional(ProfissionalRequestDTO data) {
        if (usuarioRepository.findByEmail(data.email()).isPresent()) {
            throw new RuntimeException("Email já cadastrado.");
        }
        // CORREÇÃO 2: A lógica de criação agora está toda no service
        Profissional novoProfissional = new Profissional();
        novoProfissional.setNome(data.nome());
        novoProfissional.setEmail(data.email());
        novoProfissional.setSenha(passwordEncoder.encode(data.senha())); // Criptografando a senha
        novoProfissional.setTelefone(data.telefone());
        novoProfissional.setLocalizacao(data.localizacao());
        novoProfissional.setTipoProfissional(data.tipoProfissional());
        return usuarioRepository.save(novoProfissional);
    }

    // --- MÉTODOS DE LEITURA (GET) ---

    public Page<UsuarioResponseDTO> listarTodosUsuarios(Pageable paginacao) {
        return usuarioRepository.findAll(paginacao).map(UsuarioResponseDTO::new);
    }

    public Page<ProfissionalResponseDTO> listarTodosProfissionais(Pageable paginacao) {
        return usuarioRepository.findAllProfissionais(paginacao).map(ProfissionalResponseDTO::new);
    }

    public UsuarioResponseDTO buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(UsuarioResponseDTO::new)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    public ProfissionalResponseDTO buscarProfissionalPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
        if (!(usuario instanceof Profissional)) {
            throw new RuntimeException("O usuário com ID " + id + " não é um profissional.");
        }
        return new ProfissionalResponseDTO((Profissional) usuario);
    }


    // --- MÉTODOS DE ATUALIZAÇÃO (PUT/PATCH) ---

    @Transactional
    public Profissional atualizarProfissional(Long id, ProfissionalRequestDTO data) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));
        if (!(usuario instanceof Profissional)) {
            throw new RuntimeException("O usuário com ID " + id + " não é um profissional.");
        }
        Profissional profissionalExistente = (Profissional) usuario;

        // CORREÇÃO 3: Lógica de atualização completa
        profissionalExistente.setNome(data.nome());
        profissionalExistente.setEmail(data.email());
        profissionalExistente.setTelefone(data.telefone());
        profissionalExistente.setLocalizacao(data.localizacao());
        profissionalExistente.setTipoProfissional(data.tipoProfissional());
        // Nota: A senha não é atualizada em um método PUT padrão.

        return usuarioRepository.save(profissionalExistente);
    }

    @Transactional
    public Profissional atualizarParcialProfissional(Long id, ProfissionalRequestDTO data) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));
        if (!(usuario instanceof Profissional)) {
            throw new RuntimeException("O usuário com ID " + id + " não é um profissional.");
        }
        Profissional profissionalExistente = (Profissional) usuario;

        // CORREÇÃO 4: Lógica de atualização parcial completa
        if (data.nome() != null) { profissionalExistente.setNome(data.nome()); }
        if (data.email() != null) { profissionalExistente.setEmail(data.email()); }
        if (data.telefone() != null) { profissionalExistente.setTelefone(data.telefone()); }
        if (data.localizacao() != null) { profissionalExistente.setLocalizacao(data.localizacao()); }
        if (data.tipoProfissional() != null) { profissionalExistente.setTipoProfissional(data.tipoProfissional()); }

        return usuarioRepository.save(profissionalExistente);
    }

    // --- MÉTODO DE DELEÇÃO ---

    @Transactional
    public void removerUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}