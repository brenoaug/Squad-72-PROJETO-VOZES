package br.org.recode.vozes.service;

import br.org.recode.vozes.DTO.ContatoRequestDTO;
import br.org.recode.vozes.DTO.ContatoResponseDTO;
import br.org.recode.vozes.model.Contato;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.model.enums.Role;
import br.org.recode.vozes.repository.ContatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContatoService {

    @Autowired
    private ContatoRepository contatoRepository;

    @Transactional
    public Contato criarContato(ContatoRequestDTO data) {
        Contato novoContato = new Contato();
        novoContato.setNome(data.nome());
        novoContato.setEmail(data.email());
        novoContato.setMensagem(data.mensagem());

        return contatoRepository.save(novoContato);
    }

    @Transactional(readOnly = true)
    public Page<ContatoResponseDTO> listarContatos(Pageable paginacao) {
        // A chamada ao repositório agora passa as informações de paginação
        return contatoRepository.findAll(paginacao)
                .map(ContatoResponseDTO::new);
    }

    public ContatoResponseDTO buscarContatosPorId(Long id) {
        return contatoRepository.findById(id)
                .map(ContatoResponseDTO::new)
                .orElseThrow(() -> new RuntimeException("Contato não encontrado com o ID: " + id));
    }

    @Transactional
    public void removerContato(Long id) {
        // Pega o usuário que está tentando fazer a operação
        Usuario usuarioLogado = getUsuarioLogado();

        // Lógica de permissão: apenas ADMINs podem deletar contatos
        if (usuarioLogado.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Apenas administradores podem deletar mensagens de contato.");
        }

        if (!contatoRepository.existsById(id)) {
            throw new RuntimeException("Mensagem de contato não encontrada com ID: " + id);
        }
        contatoRepository.deleteById(id);
    }

    private Usuario getUsuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Usuário não autenticado.");
        }
        return (Usuario) authentication.getPrincipal();
    }
}
