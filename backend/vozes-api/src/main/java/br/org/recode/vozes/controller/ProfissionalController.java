package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.DTO.ProfissionalResponseDTO;
import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.service.ProfissionalService; // Única dependência de lógica
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// MUDANÇA 1: Adicionado o prefixo /api
@RestController
@RequestMapping("/api/profissionais")
// MUDANÇA 2: @CrossOrigin agora está aqui, uma vez para toda a classe
public class ProfissionalController {

    // MUDANÇA 3: Injeção do Repository REMOVIDA. Apenas o Service é injetado.
    @Autowired
    private ProfissionalService profissionalService;

    // --- Endpoints Refatorados ---

    @PostMapping
    public ResponseEntity<Profissional> criarProfissional(@RequestBody ProfissionalRequestDTO data) {
        // MUDANÇA 4: Delegando a criação para o Service e retornando 201 Created
        Profissional profissionalSalvo = profissionalService.criarProfissional(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(profissionalSalvo);
    }

    @GetMapping
    public ResponseEntity<Page<ProfissionalResponseDTO>> listarTodosProfissionais(
            @PageableDefault(sort = {"id"}) Pageable paginacao) {
        Page<ProfissionalResponseDTO> profissionaisDTOPage = profissionalService.listarTodosProfissionais(paginacao);
        return ResponseEntity.ok(profissionaisDTOPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfissionalResponseDTO> buscarProfissionalPorId(@PathVariable Long id) {
        try {
            ProfissionalResponseDTO profissionalDTO = profissionalService.buscarPorId(id);
            return ResponseEntity.ok(profissionalDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarProfissional(@PathVariable Long id, @RequestBody ProfissionalRequestDTO data) {
        try {
            Profissional profissionalAtualizado = profissionalService.atualizarProfissional(id, data);
            return ResponseEntity.ok(profissionalAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> atualizarParcialProfissional(@PathVariable Long id, @RequestBody ProfissionalRequestDTO data) {
        try {
            Profissional profissionalAtualizado = profissionalService.atualizarParcialProfissional(id, data);
            return ResponseEntity.ok(profissionalAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removerProfissional(@PathVariable Long id) {
        try {
            // MUDANÇA 5: Delegando a remoção para o Service
            profissionalService.removerProfissional(id);
            // Retorna 204 No Content, o padrão para um DELETE bem-sucedido
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            // Se o service lançou a exceção de "não encontrado"
            return ResponseEntity.notFound().build();
        }
    }
}