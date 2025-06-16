package br.org.recode.vozes.controller;

import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.repository.ProfissionalRepository;
import br.org.recode.vozes.service.ProfissionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {
    @Autowired
    private ProfissionalService profissionalService;

    @GetMapping
    public ResponseEntity<List<Profissional>> listarProfissionais() {
        List<Profissional> profissionais = profissionalService.listarProfissionais();
        return ResponseEntity.ok(profissionais);
    }
}
