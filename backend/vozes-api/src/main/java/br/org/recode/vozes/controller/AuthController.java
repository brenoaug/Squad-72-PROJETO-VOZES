package br.org.recode.vozes.controller;

import br.org.recode.vozes.DTO.*;
import br.org.recode.vozes.model.Usuario;
import br.org.recode.vozes.service.TokenService;
import br.org.recode.vozes.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
            var usuarioAutenticado = (Usuario) authentication.getPrincipal();

            // Gera o token como antes
            var tokenJWT = tokenService.gerarToken(usuarioAutenticado);

            // Cria um DTO de resposta do usuário
            var usuarioResponseDTO = new UsuarioResponseDTO(usuarioAutenticado);

            // Cria e retorna o DTO de login final com o token E os dados do usuário
            return ResponseEntity.ok(new LoginResponseDTO(tokenJWT, usuarioResponseDTO));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha inválidos.");
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