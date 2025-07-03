package br.org.recode.vozes.service;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.DTO.ProfissionalResponseDTO;
import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.repository.UsuarioRepository; // MUDANÇA: Importa o novo repositório
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository; // MUDANÇA: Injeta o UsuarioRepository

    // LISTAR TODOS OS PROFISSIONAIS
    public Page<ProfissionalResponseDTO> listarTodosProfissionais(Pageable paginacao) {
        // MUDANÇA: Chama o novo método customizado do repositório
        Page<Profissional> profissionaisPage = usuarioRepository.findAllProfissionais(paginacao);
        return profissionaisPage.map(ProfissionalResponseDTO::new);
    }

    // BUSCAR UM PROFISSIONAL POR ID
    public ProfissionalResponseDTO buscarProfissionalPorId(Long id) {
        // Busca um Usuario genérico primeiro
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));

        // Verifica se o usuário encontrado é de fato um Profissional
        if (!(usuario instanceof Profissional)) {
            throw new RuntimeException("O usuário com ID " + id + " não é um profissional.");
        }

        // Se for, faz o "cast" e converte para DTO
        return new ProfissionalResponseDTO((Profissional) usuario);
    }

    // CRIAR UM NOVO PROFISSIONAL
    public Profissional criarProfissional(ProfissionalRequestDTO data) {
        Profissional novoProfissional = new Profissional(data); // Assume que o construtor em Profissional está correto
        // MUDANÇA: Usa o usuarioRepository. O JPA é inteligente e saberá salvar como 'PROFISSIONAL'.
        return usuarioRepository.save(novoProfissional);
    }

    // ATUALIZAR UM PROFISSIONAL (PUT)
    public Profissional atualizarProfissional(Long id, ProfissionalRequestDTO data) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        if (!(usuario instanceof Profissional)) {
            throw new RuntimeException("O usuário com ID " + id + " não é um profissional.");
        }

        Profissional profissionalExistente = (Profissional) usuario;

        // ... sua lógica de atualização (setNome, setEmail, etc.) ...
        profissionalExistente.setNome(data.nome());
        profissionalExistente.setEmail(data.email());
        // ... etc ...

        return usuarioRepository.save(profissionalExistente);
    }

    // ATUALIZAR PARCIALMENTE UM PROFISSIONAL (PATCH)
    public Profissional atualizarParcialProfissional(long id, ProfissionalRequestDTO data) {
        // A mesma lógica de verificação do PUT se aplica aqui
        // ...
        return null; // Implementar a lógica completa
    }

    // REMOVER UM USUÁRIO (Pode ser profissional ou comum)
    public void removerUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }
}