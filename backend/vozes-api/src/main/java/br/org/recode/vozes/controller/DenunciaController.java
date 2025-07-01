package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.DenunciaRequestDTO;
import br.org.recode.vozes.model.Denuncia;
import br.org.recode.vozes.service.DenunciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/denuncias")
@CrossOrigin(origins = "*")
public class DenunciaController {
    @Autowired
    private DenunciaService denunciaService; // Injeção de dependência do serviço de denúncias

    @PostMapping
    public ResponseEntity<Denuncia> criarDenuncia(@RequestBody DenunciaRequestDTO data) {
        Denuncia denunciaSalva = denunciaService.criarDenuncia(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(denunciaSalva);
    }
}
