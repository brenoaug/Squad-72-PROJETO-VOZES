package br.org.recode.vozes.service;

import br.org.recode.vozes.DTO.DenunciaRequestDTO;
import br.org.recode.vozes.DTO.DenunciaResponseDTO;
import br.org.recode.vozes.model.Anexo;
import br.org.recode.vozes.model.Denuncia;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.model.enums.Role;
import br.org.recode.vozes.repository.DenunciaRepository;
import br.org.recode.vozes.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DenunciaService {

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository; // Necessário para associar o autor

    /**
     * Cria uma nova denúncia.
     * Os dados de nome e email são sempre pegos do formulário.
     * Se um usuário estiver logado, a denúncia é associada a ele.
     */
    @Transactional
    public Denuncia criarDenuncia(DenunciaRequestDTO data) {
        Denuncia novaDenuncia = new Denuncia();

        // MUDANÇA: A lógica agora é mais simples.
        // Sempre usamos os dados que vêm do formulário (DTO).
        novaDenuncia.setNome(data.nome());
        novaDenuncia.setEmail(data.email());

        // Associa o autor se um usuário estiver logado, mas não sobrescreve os dados.
        getUsuarioLogadoOptional().ifPresent(novaDenuncia::setAutor);

        novaDenuncia.setData(data.data());
        novaDenuncia.setLocalIncidente(data.localIncidente());
        novaDenuncia.setDescricao(data.descricao());

        // Lógica de anexos (continua correta)
        if (data.anexos() != null && !data.anexos().isEmpty()) {
            List<Anexo> listaAnexos = new ArrayList<>();
            data.anexos().forEach(anexoDTO -> {
                Anexo anexo = new Anexo();
                anexo.setTipoArquivo(anexoDTO.tipoArquivo());
                anexo.setCaminhoArquivo(anexoDTO.caminhoArquivo());
                anexo.setDenuncia(novaDenuncia);
                listaAnexos.add(anexo);
            });
            novaDenuncia.setAnexos(listaAnexos);
        }

        return denunciaRepository.save(novaDenuncia);
    }

    /**
     * Lista todas as denúncias de forma paginada.
     * A anotação @Transactional previne erros de LazyInitialization.
     */
    @Transactional(readOnly = true)
    public Page<DenunciaResponseDTO> listarTodas(Pageable paginacao) {
        return denunciaRepository.findAll(paginacao).map(DenunciaResponseDTO::new);
    }

    /**
     * Busca uma denúncia específica pelo seu ID.
     */
    @Transactional(readOnly = true)
    public DenunciaResponseDTO buscarPorId(Long id) {
        return denunciaRepository.findById(id)
                .map(DenunciaResponseDTO::new)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada com ID: " + id));
    }

    @Transactional
    public DenunciaResponseDTO atualizarDenuncia(Long id, DenunciaRequestDTO data) {
        // Apenas ADMINs podem editar denúncias
        if (getUsuarioLogado().getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Apenas administradores podem editar denúncias.");
        }

        Denuncia denunciaExistente = denunciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Denúncia não encontrada com ID: " + id));

        // Atualiza os campos com os novos dados do DTO
        denunciaExistente.setNome(data.nome());
        denunciaExistente.setEmail(data.email());
        denunciaExistente.setData(data.data());
        denunciaExistente.setLocalIncidente(data.localIncidente());
        denunciaExistente.setDescricao(data.descricao());
        // A lógica de anexos pode ser mais complexa e não está incluída nesta atualização simples

        Denuncia denunciaSalva = denunciaRepository.save(denunciaExistente);
        return new DenunciaResponseDTO(denunciaSalva);
    }

    /**
     * Remove uma denúncia. Apenas usuários com o papel ADMIN podem fazer isso.
     */
    @Transactional
    public void removerDenuncia(Long id) {
        // Pega o usuário que está tentando fazer a operação
        Usuario usuarioLogado = getUsuarioLogado();

        // Lógica de permissão: apenas ADMINs podem deletar denúncias
        if (usuarioLogado.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Apenas administradores podem deletar denúncias.");
        }

        if (!denunciaRepository.existsById(id)) {
            throw new RuntimeException("Denúncia não encontrada com ID: " + id);
        }
        denunciaRepository.deleteById(id);
    }

    // --- MÉTODOS AUXILIARES ---

    // Retorna o usuário logado, se existir
    private Optional<Usuario> getUsuarioLogadoOptional() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return Optional.empty();
        }
        return Optional.of((Usuario) authentication.getPrincipal());
    }

    // Retorna o usuário logado ou lança uma exceção se ninguém estiver logado
    private Usuario getUsuarioLogado() {
        return getUsuarioLogadoOptional()
                .orElseThrow(() -> new RuntimeException("Usuário não autenticado."));
    }
}
