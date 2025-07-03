package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.DTO.ProfissionalResponseDTO;
import br.org.recode.vozes.DTO.UsuarioComumRequestDTO;
import br.org.recode.vozes.DTO.UsuarioResponseDTO;
import br.org.recode.vozes.model.Profissional;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// MUDANÇA 1: Adicionado o prefixo /api
@RestController
@RequestMapping("/api/usuarios")
// MUDANÇA 2: @CrossOrigin agora está aqui, uma vez para toda a classe
public class UsuarioController {

    // MUDANÇA 3: Injeção do Repository REMOVIDA. Apenas o Service é injetado.
    @Autowired
    private UsuarioService usuarioService;

    // ENDPOINT PARA CRIAR USUÁRIO COMUM
    @PostMapping("/comuns")
    public ResponseEntity<?> criarUsuarioComum(@RequestBody UsuarioComumRequestDTO data) {
        try {
            Usuario usuarioSalvo = usuarioService.criarUsuarioComum(data);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ENDPOINT GET ALL (PAGINADO)
    @GetMapping("/comuns")
    public ResponseEntity<Page<UsuarioResponseDTO>> listarTodosUsuarios(
            @PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
        Page<UsuarioResponseDTO> paginaDeUsuarios = usuarioService.listarTodosUsuarios(paginacao);
        return ResponseEntity.ok(paginaDeUsuarios);
    }

    // ENDPOINT GET BY ID
    @GetMapping("comuns/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarUsuarioPorId(@PathVariable Long id) {
        try {
            UsuarioResponseDTO usuarioDTO = usuarioService.buscarUsuarioPorId(id);
            return ResponseEntity.ok(usuarioDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Endpoints Refatorados ---

    @PostMapping("/profissionais")
    public ResponseEntity<Profissional> criarProfissional(@RequestBody ProfissionalRequestDTO data) {
        // MUDANÇA 4: Delegando a criação para o Service e retornando 201 Created
        Profissional profissionalSalvo = usuarioService.criarProfissional(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(profissionalSalvo);
    }

    @GetMapping("/profissionais")
    public ResponseEntity<Page<ProfissionalResponseDTO>> listarTodosProfissionais(
            @PageableDefault(sort = {"id"}) Pageable paginacao) {
        Page<ProfissionalResponseDTO> profissionaisDTOPage = usuarioService.listarTodosProfissionais(paginacao);
        return ResponseEntity.ok(profissionaisDTOPage);
    }

    @GetMapping("/profissionais/{id}")
    public ResponseEntity<ProfissionalResponseDTO> buscarProfissionalPorId(@PathVariable Long id) {
        try {
            ProfissionalResponseDTO profissionalDTO = usuarioService.buscarProfissionalPorId(id);
            return ResponseEntity.ok(profissionalDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profissionais/{id}")
    public ResponseEntity<?> atualizarProfissional(@PathVariable Long id, @RequestBody ProfissionalRequestDTO data) {
        try {
            Profissional profissionalAtualizado = usuarioService.atualizarProfissional(id, data);
            return ResponseEntity.ok(profissionalAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/profissionais/{id}")
    public ResponseEntity<?> atualizarParcialProfissional(@PathVariable Long id, @RequestBody ProfissionalRequestDTO data) {
        try {
            Profissional profissionalAtualizado = usuarioService.atualizarParcialProfissional(id, data);
            return ResponseEntity.ok(profissionalAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/profissionais/{id}")
    public ResponseEntity<?> removerProfissional(@PathVariable Long id) {
        try {
            // MUDANÇA 5: Delegando a remoção para o Service
            usuarioService.removerUsuario(id);
            // Retorna 204 No Content, o padrão para um DELETE bem-sucedido
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            // Se o service lançou a exceção de "não encontrado"
            return ResponseEntity.notFound().build();
        }
    }
}