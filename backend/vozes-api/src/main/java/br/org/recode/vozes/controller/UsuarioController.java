package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.DTO.ProfissionalResponseDTO;
import br.org.recode.vozes.DTO.UsuarioResponseDTO;
import br.org.recode.vozes.model.enums.TipoProfissional;
import br.org.recode.vozes.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // --- Endpoints para TODOS OS USUÁRIOS (geralmente para ADMINS) ---

    @GetMapping
    public ResponseEntity<Page<UsuarioResponseDTO>> listarTodos(
            @PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
        Page<UsuarioResponseDTO> pagina = usuarioService.listarTodosUsuarios(paginacao);
        return ResponseEntity.ok(pagina);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarPorId(@PathVariable Long id) {
        try {
            UsuarioResponseDTO usuarioDTO = usuarioService.buscarUsuarioPorId(id);
            return ResponseEntity.ok(usuarioDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Endpoints ESPECÍFICOS PARA PROFISSIONAIS ---

    @GetMapping("/profissionais")
    public ResponseEntity<Page<ProfissionalResponseDTO>> listarProfissionais(
            @PageableDefault(size = 9, sort = {"nome"}) Pageable paginacao,
            @RequestParam(required = false) TipoProfissional tipo) {
        Page<ProfissionalResponseDTO> pagina = usuarioService.listarTodosProfissionais(paginacao, tipo);
        return ResponseEntity.ok(pagina);
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
    public ResponseEntity<ProfissionalResponseDTO> atualizarProfissional(
            @PathVariable Long id,
            @RequestBody @Valid ProfissionalRequestDTO data) {
        try {
            ProfissionalResponseDTO profissionalAtualizado = usuarioService.atualizarProfissional(id, data);
            return ResponseEntity.ok(profissionalAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/profissionais/{id}")
    public ResponseEntity<ProfissionalResponseDTO> atualizarParcialProfissional(
            @PathVariable Long id,
            @RequestBody @Valid ProfissionalRequestDTO data) {
        try {
            ProfissionalResponseDTO profissionalAtualizado = usuarioService.atualizarParcialProfissional(id, data);
            return ResponseEntity.ok(profissionalAtualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- Endpoint de DELEÇÃO (genérico, mas protegido por permissão no service) ---

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removerUsuario(@PathVariable Long id) {
        try {
            usuarioService.removerUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}