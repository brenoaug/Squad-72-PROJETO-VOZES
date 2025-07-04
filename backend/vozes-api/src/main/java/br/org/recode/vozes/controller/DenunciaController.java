package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.DenunciaRequestDTO;
import br.org.recode.vozes.DTO.DenunciaResponseDTO;
import br.org.recode.vozes.model.Denuncia;
import br.org.recode.vozes.service.DenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/denuncias")
public class DenunciaController {
    @Autowired
    private DenunciaService denunciaService; // Injeção de dependência do serviço de denúncias

    @GetMapping
    public ResponseEntity<Page<DenunciaResponseDTO>> listarDenuncias(
            @PageableDefault(size = 10, sort = {"data"}) Pageable paginacao) {

        Page<DenunciaResponseDTO> paginaDeDenuncias = denunciaService.listarTodas(paginacao);
        return ResponseEntity.ok(paginaDeDenuncias);
    }

    @PostMapping
    public ResponseEntity<Denuncia> criarDenuncia(@RequestBody DenunciaRequestDTO data) {
        Denuncia denunciaSalva = denunciaService.criarDenuncia(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(denunciaSalva);
    }
}
