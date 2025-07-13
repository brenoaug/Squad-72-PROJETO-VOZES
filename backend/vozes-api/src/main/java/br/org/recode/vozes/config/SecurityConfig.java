package br.org.recode.vozes.config; // Ajuste o pacote conforme a estrutura do seu projeto

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(withDefaults()) // Usa a configuração de CORS definida no bean abaixo
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // --- REGRAS ESPECÍFICAS PRIMEIRO ---
                        // Endpoints de autenticação são públicos
                        .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()

                        // Endpoints de denúncia
                        .requestMatchers(HttpMethod.POST, "/api/denuncias").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/denuncias/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/denuncias/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/denuncias/**").hasAuthority("ROLE_ADMIN")
                        // Endpoints de contato
                        .requestMatchers(HttpMethod.POST, "/api/contatos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/contatos/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/contatos/**").hasAuthority("ROLE_ADMIN")

                        // Endpoints de profissionais (listagem pública)
                        .requestMatchers(HttpMethod.GET, "/api/usuarios/profissionais").permitAll()

                        // --- REGRAS MAIS GENÉRICAS DEPOIS ---
                        // Qualquer outra operação em /api/usuarios exige autenticação
                        .requestMatchers("/api/usuarios/**").authenticated()

                        // Qualquer outra requisição não listada acima exige autenticação
                        .anyRequest().authenticated())
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // Bean de CORS explícito para máxima compatibilidade
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite requisições do seu front-end React/Vite
        // **CORREÇÃO AQUI:** Adicione a URL do seu frontend em produção
        configuration.setAllowedOrigins(
                Arrays.asList("http://localhost:5173", "https://projeto-vozes-frontend.onrender.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
