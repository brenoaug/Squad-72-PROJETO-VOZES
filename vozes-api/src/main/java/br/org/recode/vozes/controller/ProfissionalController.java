package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.DTO.ProfissionalResponseDTO;
import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.repository.ProfissionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {
    @Autowired
    private ProfissionalRepository profissionalRepository;

    @PostMapping
    public void saveProfissional(@RequestBody ProfissionalRequestDTO data) {
        Profissional profissionalData = new Profissional(data);// cria uma nova instância de Profissional usando os dados do ProfissionalRequestDTO
        profissionalRepository.save(profissionalData);// salva o profissional no banco de dados
    }

    @GetMapping
    public List<ProfissionalResponseDTO> getAll() {
        return profissionalRepository
                .findAll()//puxa todos os profissionais do banco de dados
                .stream()// transforma a lista de Profissional em uma Stream, usado para processar a lista de forma mais eficiente, permitindo operações como map, filter e collect
                .map(ProfissionalResponseDTO::new)// converte cada Profissional em um ProfissionalResponseDTO
                .toList();// converte a Stream de ProfissionalResponseDTO de volta para uma lista
    }
}
