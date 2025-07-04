package br.org.recode.vozes.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Desabilita o CSRF, pois nossa API é stateless e usa tokens JWT
                .csrf(AbstractHttpConfigurer::disable)
                // Configura a sessão para ser stateless, não guardando estado no servidor
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Configura as regras de autorização para cada endpoint
                .authorizeHttpRequests(authorize -> authorize
                        // Rotas públicas que não exigem autenticação
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/registrar/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/profissionais/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/denuncias/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/contatos/**").permitAll()
                        .requestMatchers("/api/usuarios/**").hasRole("ADMIN")
                        // Qualquer outra rota precisa de autenticação
                        .anyRequest().authenticated()
                )
                // Adiciona nosso filtro JWT para ser executado antes do filtro padrão do Spring
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    /**
     * Expõe o AuthenticationManager do Spring como um Bean.
     * O AuthController usará isso para processar a tentativa de login.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Expõe o PasswordEncoder como um Bean para criptografar senhas.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
