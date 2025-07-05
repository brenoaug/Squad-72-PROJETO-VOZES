package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.ProfissionalResponseDTO;
import br.org.recode.vozes.DTO.UsuarioResponseDTO;
import br.org.recode.vozes.DTO.UsuarioUpdateRequestDTO;
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

    // --- ENDPOINTS DE LEITURA (GERAIS) ---

    /**
     * Lista todos os usuários (Comuns e Profissionais) de forma paginada.
     * Ideal para uma área de administração.
     */
    @GetMapping
    public ResponseEntity<Page<UsuarioResponseDTO>> listarTodosUsuarios(
            @PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
        Page<UsuarioResponseDTO> pagina = usuarioService.listarTodosUsuarios(paginacao);
        return ResponseEntity.ok(pagina);
    }

    /**
     * Busca um usuário específico pelo ID, seja ele comum ou profissional.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> buscarUsuarioPorId(@PathVariable Long id) {
        try {
            UsuarioResponseDTO usuarioDTO = usuarioService.buscarUsuarioPorId(id);
            return ResponseEntity.ok(usuarioDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- ENDPOINTS ESPECÍFICOS PARA PROFISSIONAIS (PARA PÁGINA PÚBLICA) ---

    /**
     * Lista apenas os profissionais, com opção de filtro por tipo.
     * Ideal para a página pública de "Suporte & Acompanhamento".
     */
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

    // --- ENDPOINT DE ATUALIZAÇÃO (GENÉRICO) ---

    /**
     * Atualiza parcialmente os dados de qualquer usuário (comum ou profissional).
     * A lógica de permissão (se é admin ou dono da conta) está no Service.
     */
    @PatchMapping("/{id}")
    public ResponseEntity<?> atualizarParcialUsuario(@PathVariable Long id, @RequestBody @Valid UsuarioUpdateRequestDTO data) {
        try {
            UsuarioResponseDTO usuarioAtualizado = usuarioService.atualizarParcialUsuario(id, data);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // --- ENDPOINT DE DELEÇÃO (GENÉRICO) ---

    /**
     * Remove um usuário (comum ou profissional).
     * A lógica de permissão (se é admin ou dono da conta) está no Service.
     */
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