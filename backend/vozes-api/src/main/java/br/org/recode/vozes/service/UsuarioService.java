package br.org.recode.vozes.service;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.DTO.ProfissionalResponseDTO;
import br.org.recode.vozes.DTO.UsuarioComumRequestDTO;
import br.org.recode.vozes.DTO.UsuarioResponseDTO;
import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.model.UsuarioComum;
import br.org.recode.vozes.model.enums.Role;
import br.org.recode.vozes.model.enums.TipoProfissional;
import br.org.recode.vozes.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- MÉTODOS DE CRIAÇÃO ---

    @Transactional
    public Usuario criarUsuarioComum(UsuarioComumRequestDTO data) {
        usuarioRepository.findByEmail(data.email()).ifPresent(u -> {
            throw new RuntimeException("Email já cadastrado.");
        });
        UsuarioComum novoUsuario = new UsuarioComum();
        novoUsuario.setNome(data.nome());
        novoUsuario.setEmail(data.email());
        novoUsuario.setSenha(passwordEncoder.encode(data.senha()));
        novoUsuario.setTelefone(data.telefone());
        novoUsuario.setLocalizacao(data.localizacao());
        novoUsuario.setRole(Role.USUARIO);
        return usuarioRepository.save(novoUsuario);
    }

    @Transactional
    public Profissional criarProfissional(ProfissionalRequestDTO data) {
        usuarioRepository.findByEmail(data.email()).ifPresent(u -> {
            throw new RuntimeException("Email já cadastrado.");
        });
        Profissional novoProfissional = new Profissional();
        novoProfissional.setNome(data.nome());
        novoProfissional.setEmail(data.email());
        novoProfissional.setSenha(passwordEncoder.encode(data.senha()));
        novoProfissional.setTelefone(data.telefone());
        novoProfissional.setLocalizacao(data.localizacao());
        novoProfissional.setTipoProfissional(data.tipoProfissional());
        novoProfissional.setRole(Role.PROFISSIONAL);
        return usuarioRepository.save(novoProfissional);
    }

    // --- MÉTODOS DE LEITURA (GET) ---

    public Page<UsuarioResponseDTO> listarTodosUsuarios(Pageable paginacao) {
        return usuarioRepository.findAll(paginacao).map(UsuarioResponseDTO::new);
    }

    public Page<ProfissionalResponseDTO> listarTodosProfissionais(Pageable paginacao, TipoProfissional tipo) {
        Page<Profissional> profissionaisPage = usuarioRepository.findAllProfissionais(paginacao, tipo);
        return profissionaisPage.map(ProfissionalResponseDTO::new);
    }

    public UsuarioResponseDTO buscarUsuarioPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(UsuarioResponseDTO::new)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    public ProfissionalResponseDTO buscarProfissionalPorId(Long id) {
        Profissional profissional = findProfissionalById(id); // Usa nosso novo método auxiliar
        return new ProfissionalResponseDTO(profissional);
    }

    // --- MÉTODOS DE ATUALIZAÇÃO (PUT/PATCH) PARA PROFISSIONAIS ---

    @Transactional
    public ProfissionalResponseDTO atualizarProfissional(Long id, ProfissionalRequestDTO data) {
        // REFINAMENTO: Regra de permissão agora é explícita e clara
        Usuario usuarioLogado = getUsuarioLogado();
        if (usuarioLogado.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Apenas administradores podem realizar uma atualização completa.");
        }

        Profissional profissionalExistente = findProfissionalById(id); // Usa nosso novo método auxiliar

        profissionalExistente.setNome(data.nome());
        profissionalExistente.setEmail(data.email());
        profissionalExistente.setTelefone(data.telefone());
        profissionalExistente.setLocalizacao(data.localizacao());
        profissionalExistente.setTipoProfissional(data.tipoProfissional());

        Profissional salvo = usuarioRepository.save(profissionalExistente);
        return new ProfissionalResponseDTO(salvo);
    }

    @Transactional
    public ProfissionalResponseDTO atualizarParcialProfissional(Long id, ProfissionalRequestDTO data) {
        Profissional profissionalExistente = findProfissionalById(id); // Usa nosso novo método auxiliar

        // REFINAMENTO: Lógica de permissão centralizada
        verificaPermissaoAdminOuDono(id);

        if (data.nome() != null) profissionalExistente.setNome(data.nome());
        if (data.email() != null) {
            if (getUsuarioLogado().getRole() == Role.ADMIN) {
                profissionalExistente.setEmail(data.email());
            } else {
                throw new AccessDeniedException("Usuários não podem alterar o próprio e-mail.");
            }
        }
        if (data.telefone() != null) profissionalExistente.setTelefone(data.telefone());
        if (data.localizacao() != null) profissionalExistente.setLocalizacao(data.localizacao());
        if (data.tipoProfissional() != null) profissionalExistente.setTipoProfissional(data.tipoProfissional());

        Profissional salvo = usuarioRepository.save(profissionalExistente);
        return new ProfissionalResponseDTO(salvo);
    }

    // --- MÉTODO DE DELEÇÃO (GENÉRICO) ---

    @Transactional
    public void removerUsuario(Long id) {
        // REFINAMENTO: Lógica de permissão centralizada
        verificaPermissaoAdminOuDono(id);

        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // --- MÉTODOS AUXILIARES PRIVADOS ---

    private Usuario getUsuarioLogado() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Usuario) {
            return (Usuario) principal;
        }
        // Em uma API real, seria melhor retornar um Optional ou lançar uma exceção mais específica
        throw new RuntimeException("Usuário não autenticado.");
    }

    // REFINAMENTO: buscar um profissional e já verificar seu tipo
    private Profissional findProfissionalById(Long id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    if (usuario instanceof Profissional p) return p;
                    throw new RuntimeException("O usuário com ID " + id + " não é um profissional.");
                })
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    // REFINAMENTO: Método para centralizar a verificação de permissão
    private void verificaPermissaoAdminOuDono(Long idDoRecurso) {
        Usuario usuarioLogado = getUsuarioLogado();
        if (!usuarioLogado.getId().equals(idDoRecurso) && usuarioLogado.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Permissão negada.");
        }
    }
}