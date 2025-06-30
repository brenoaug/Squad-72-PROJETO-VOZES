package br.org.recode.vozes.service;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.DTO.ProfissionalResponseDTO;
import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.repository.ProfissionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfissionalService {
    @Autowired
    private ProfissionalRepository profissionalRepository;

    // LISTAR TODOS MODIFICADO PARA PAGINAÇÃO
    public Page<ProfissionalResponseDTO> listarTodosProfissionais(Pageable paginacao) {
        // 1. O findAll agora recebe as informações de paginação
        //    e retorna um objeto Page<Profissional> em vez de uma List.
        Page<Profissional> profissionaisPage = profissionalRepository.findAll(paginacao);

        // 2. O objeto Page tem um .map() embutido, muito conveniente
        //    para converter a lista de Profissional para ProfissionalResponseDTO.
        return profissionaisPage.map(ProfissionalResponseDTO::new);
    }

    public ProfissionalResponseDTO buscarPorId(Long id) {
        // 1. Busca a entidade Profissional no banco de dados.
        //    O findById retorna um Optional, que pode ou não conter um profissional.
        Optional<Profissional> profissionalOptional = profissionalRepository.findById(id);

        // 2. Se o profissional for encontrado, mapeia para o DTO de resposta.
        //    Se não, lança uma exceção (que será tratada pelo Controller).
        if (profissionalOptional.isPresent()) {
            Profissional profissional = profissionalOptional.get();
            return new ProfissionalResponseDTO(profissional);
        } else {
            // Lançar uma exceção é uma forma de sinalizar para a camada do Controller
            // que o recurso não foi encontrado.
            throw new RuntimeException("Profissional não encontrado com ID: " + id);
        }
    }

    /**
     * Cria um novo profissional no banco de dados a partir dos dados de um DTO.
     * @param data O DTO com as informações do novo profissional.
     * @return A entidade Profissional que foi salva, agora com um ID.
     */
    public Profissional criarProfissional(ProfissionalRequestDTO data) {
        // Cria uma nova instância da entidade Profissional.
        // Assumindo que sua entidade Profissional tem um construtor que aceita o DTO.
        Profissional novoProfissional = new Profissional(data);

        // Usa o repositório para salvar o novo profissional no banco de dados.
        // O save() retorna a entidade salva, já com o ID gerado pelo banco.
        return profissionalRepository.save(novoProfissional);
    }

    public Profissional atualizarProfissional(Long id, ProfissionalRequestDTO data) {
        Profissional profissionalExistente = profissionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        profissionalExistente.setNome(data.nome());
        profissionalExistente.setEmail(data.email());
        profissionalExistente.setTelefone(data.telefone());
        profissionalExistente.setLocalizacao(data.localizacao());
        profissionalExistente.setTipoProfissional(data.tipoProfissional());

        profissionalRepository.save(profissionalExistente); // Salva as alterações no banco de dados

        return profissionalExistente;
    }

    public Profissional atualizarParcialProfissional(long id, ProfissionalRequestDTO data) {
        Profissional profissionalExistente = profissionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado"));

        if (data.nome() != null && !data.nome().trim().isEmpty()) {
            profissionalExistente.setNome(data.nome());
        }
        if (data.email() != null && !data.email().trim().isEmpty()) {
            profissionalExistente.setEmail(data.email());
        }
        if (data.telefone() != null) {
            profissionalExistente.setTelefone(data.telefone());
        }
        if (data.localizacao() != null) {
            profissionalExistente.setLocalizacao(data.localizacao());
        }
        if (data.tipoProfissional() != null) {
            profissionalExistente.setTipoProfissional(data.tipoProfissional());
        }
        profissionalRepository.save(profissionalExistente); // Salva as alterações no banco de dados
        return profissionalExistente;
    }

    public void removerProfissional(Long id) {
        // Verifica se o profissional existe antes de tentar deletar
        if (!profissionalRepository.existsById(id)) {
            // Lança uma exceção se não for encontrado
            throw new RuntimeException("Profissional não encontrado com ID: " + id);
        }
        profissionalRepository.deleteById(id);
    }
}
