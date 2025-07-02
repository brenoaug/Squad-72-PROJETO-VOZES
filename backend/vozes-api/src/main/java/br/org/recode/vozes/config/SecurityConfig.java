package br.org.recode.vozes.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration // Indica que esta é uma classe de configuração
@EnableWebSecurity // Habilita a segurança web do Spring
public class SecurityConfig {

    // Bean para a configuração de CORS Global
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // Aplica a todas as rotas em /api
                        .allowedOrigins("*") // Permite o front-end React/Vite("http://localhost:3000", "http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(false);
            }
        };
    }

    // Bean principal que configura a cadeia de filtros de segurança
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Aplica a configuração de CORS definida no bean 'corsConfigurer'
                .cors(withDefaults())
                // Desabilita o CSRF, pois não usaremos sessões/cookies para autenticação da API
                .csrf(csrf -> csrf.disable())
                // Define a política de sessão como STATELESS, ideal para APIs REST
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Define as regras de autorização para os endpoints
                .authorizeHttpRequests(authorize -> authorize
                        // Por enquanto, vamos permitir acesso a TODOS os endpoints sem autenticação.
                        // Isso resolve o problema imediato e nos dá uma base para adicionar segurança depois.
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}