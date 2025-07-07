package br.org.recode.vozes.config;

import br.org.recode.vozes.repository.UsuarioRepository;
import br.org.recode.vozes.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var tokenJWT = recuperarToken(request);

        if (tokenJWT != null) {
            var emailUsuario = tokenService.validarToken(tokenJWT);
            var usuario = usuarioRepository.findByEmail(emailUsuario).orElse(null);

            if (usuario != null) {
                var authorities = usuario.getAuthorities(); // Pega as permissões

                // --- INÍCIO DO DEBUG ---
                System.out.println("=============================================");
                System.out.println("DEBUG FILTRO DE SEGURANÇA");
                System.out.println("Endpoint Acessado: " + request.getRequestURI());
                System.out.println("Usuário encontrado no token: " + usuario.getEmail());
                System.out.println("Papel (Role) do usuário no banco: " + usuario.getRole());
                System.out.println("Autoridades (Authorities) fornecidas ao Spring: " + authorities);
                System.out.println("=============================================");
                // --- FIM DO DEBUG ---

                var authentication = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            return authorizationHeader.replace("Bearer ", "").trim();
        }
        return null;
    }
}