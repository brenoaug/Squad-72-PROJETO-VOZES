package br.org.recode.vozes.service;

import br.org.recode.vozes.DTO.ContatoRequestDTO;
import br.org.recode.vozes.DTO.ContatoResponseDTO;
import br.org.recode.vozes.model.Contato;
import br.org.recode.vozes.repository.ContatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<ContatoResponseDTO> listarContatos() {
        return contatoRepository.findAll()
                .stream()
                .map(ContatoResponseDTO::new)
                .collect(Collectors.toList());
    }

    public ContatoResponseDTO buscarContatosPorId(Long id) {
        return contatoRepository.findById(id)
                .map(ContatoResponseDTO::new)
                .orElseThrow(() -> new RuntimeException("Contato não encontrado com o ID: " + id));
    }
}
