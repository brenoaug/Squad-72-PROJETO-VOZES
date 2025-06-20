package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.ProfissionalResponseDTO;
import br.org.recode.vozes.repository.ProfissionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {
    @Autowired
    private ProfissionalRepository profissionalRepository;

    @GetMapping
    public List<ProfissionalResponseDTO> getAll() {
        return profissionalRepository.findAll().stream()
                .map(ProfissionalResponseDTO::new)
                .toList();
    }
}
