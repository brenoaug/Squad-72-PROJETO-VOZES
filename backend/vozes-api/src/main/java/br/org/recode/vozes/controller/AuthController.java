package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.LoginRequestDTO;
import br.org.recode.vozes.DTO.LoginResponseDTO;
import br.org.recode.vozes.DTO.ProfissionalRequestDTO;
import br.org.recode.vozes.DTO.UsuarioComumRequestDTO;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.service.TokenService;
import br.org.recode.vozes.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenService tokenService;

    /**
     * Endpoint para autenticar um usuário e retornar um token JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO data) {
        try {
            var authenticationToken = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
            var authentication = this.authenticationManager.authenticate(authenticationToken);
            var tokenJWT = tokenService.gerarToken((Usuario) authentication.getPrincipal());
            return ResponseEntity.ok(new LoginResponseDTO(tokenJWT));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Falha na autenticação: " + e.getMessage());
        }
    }

    /**
     * Endpoint para registrar um novo usuário comum.
     */
    @PostMapping("/registrar/comum")
    public ResponseEntity<?> registrarUsuarioComum(@RequestBody @Valid UsuarioComumRequestDTO data) {
        try {
            usuarioService.criarUsuarioComum(data);
            return ResponseEntity.ok("Usuário comum registrado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para registrar um novo profissional.
     */
    @PostMapping("/registrar/profissional")
    public ResponseEntity<?> registrarProfissional(@RequestBody @Valid ProfissionalRequestDTO data) {
        try {
            usuarioService.criarProfissional(data);
            return ResponseEntity.ok("Profissional registrado com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}