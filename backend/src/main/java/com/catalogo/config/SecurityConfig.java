package com.catalogo.config;

import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// Configuração do Spring Security: quais rotas são livres, quais exigem token
// e como os tokens JWT são criados e conferidos.
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filtros(HttpSecurity http) throws Exception {
        http
                // CSRF protege sites que usam cookie de sessão. Aqui o login vai no token, então não precisa.
                .csrf(csrf -> csrf.disable())
                // Usa a configuração de CORS do método corsConfigurationSource() lá embaixo
                .cors(Customizer.withDefaults())
                // STATELESS: o servidor não guarda sessão; cada requisição se identifica pelo token
                .sessionManagement(sessao -> sessao.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(regras -> regras
                        .requestMatchers("/auth/**", "/error").permitAll() // login e cadastro são livres
                        .anyRequest().authenticated())                       // todo o resto exige token
                // Lê o cabeçalho "Authorization: Bearer <token>" e confere o JWT em toda requisição
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }

    // A chave secreta (do application.properties) que assina e confere os tokens
    @Bean
    public SecretKey chaveJwt(@Value("${jwt.segredo}") String segredo) {
        return new SecretKeySpec(segredo.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    // Cria tokens (usado no login e no cadastro). Algoritmo padrão: HS256.
    @Bean
    public JwtEncoder jwtEncoder(SecretKey chaveJwt) {
        return NimbusJwtEncoder.withSecretKey(chaveJwt).build();
    }

    // Confere tokens (usado pelo Spring Security em cada requisição protegida)
    @Bean
    public JwtDecoder jwtDecoder(SecretKey chaveJwt) {
        return NimbusJwtDecoder.withSecretKey(chaveJwt).build();
    }

    // Criptografa as senhas antes de salvar e compara no login
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS: libera o app rodando no navegador (outra porta) a chamar a API
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
