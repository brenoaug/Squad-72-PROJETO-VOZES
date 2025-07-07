package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.ContatoRequestDTO;
import br.org.recode.vozes.DTO.ContatoResponseDTO;
import br.org.recode.vozes.model.Contato;
import br.org.recode.vozes.service.ContatoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/contatos")
public class ContatoController {
    @Autowired
    private ContatoService contatoService;

    @PostMapping
    public ResponseEntity<Contato> criarContato(@RequestBody ContatoRequestDTO data) {
        Contato novoContato = contatoService.criarContato(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoContato);
    }

    @GetMapping
    public ResponseEntity<Page<ContatoResponseDTO>> listarContatos(
            @PageableDefault(
                    sort = {"idContato"},
                    direction = Sort.Direction.DESC) Pageable paginacao)
        {
            Page<ContatoResponseDTO> paginaDeContatos = contatoService.listarContatos(paginacao);
            return ResponseEntity.ok(paginaDeContatos);
        }

        @GetMapping("/{id}")
        public ResponseEntity<ContatoResponseDTO> buscarContatosPorId (
                @PathVariable Long id){
            try {
                ContatoResponseDTO contatoDTO = contatoService.buscarContatosPorId(id);
                return ResponseEntity.ok(contatoDTO);
            } catch (RuntimeException e) {
                return ResponseEntity.notFound().build();
            }
        }
    }
