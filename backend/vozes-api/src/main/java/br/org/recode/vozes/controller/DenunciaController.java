package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.DenunciaRequestDTO;
import br.org.recode.vozes.DTO.DenunciaResponseDTO;
import br.org.recode.vozes.model.Denuncia; // Importe a entidade Denuncia
import br.org.recode.vozes.service.DenunciaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/denuncias")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DenunciaController {

    @Autowired
    private DenunciaService denunciaService;

    /**
     * Endpoint para criar uma nova denúncia.
     * Aberto ao público (anônimo ou logado).
     */
    @PostMapping
    public ResponseEntity<DenunciaResponseDTO> criarDenuncia(@RequestBody @Valid DenunciaRequestDTO data) {
        try {
            // O serviço retorna a entidade 'Denuncia' completa.
            Denuncia denunciaSalva = denunciaService.criarDenuncia(data);

            // CORREÇÃO: Convertemos a entidade salva para o DTO de resposta antes de enviar.
            DenunciaResponseDTO responseDTO = new DenunciaResponseDTO(denunciaSalva);

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Endpoint para listar todas as denúncias de forma paginada.
     * Aberto ao público.
     */
    @GetMapping
    public ResponseEntity<Page<DenunciaResponseDTO>> listarDenuncias(
            @PageableDefault(size = 10, sort = {"data"}) Pageable paginacao) {

        Page<DenunciaResponseDTO> paginaDeDenuncias = denunciaService.listarTodas(paginacao);
        return ResponseEntity.ok(paginaDeDenuncias);
    }

    /**
     * Endpoint para buscar uma denúncia específica pelo ID.
     * Requer autenticação.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DenunciaResponseDTO> buscarDenunciaPorId(@PathVariable Long id) {
        try {
            DenunciaResponseDTO denunciaDTO = denunciaService.buscarPorId(id);
            return ResponseEntity.ok(denunciaDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para um ADMIN atualizar uma denúncia.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DenunciaResponseDTO> atualizarDenuncia(
            @PathVariable Long id,
            @RequestBody @Valid DenunciaRequestDTO data) {
        try {
            DenunciaResponseDTO denunciaAtualizada = denunciaService.atualizarDenuncia(id, data);
            return ResponseEntity.ok(denunciaAtualizada);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint para deletar uma denúncia.
     * Requer permissão de ADMIN.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removerDenuncia(@PathVariable Long id) {
        try {
            denunciaService.removerDenuncia(id);
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
