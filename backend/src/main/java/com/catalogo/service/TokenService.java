package com.catalogo.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.catalogo.model.Usuario;

// Gera o token JWT entregue ao app depois do login ou do cadastro
@Service
public class TokenService {

    private final JwtEncoder encoder;

    public TokenService(JwtEncoder encoder) {
        this.encoder = encoder;
    }

    public String gerarToken(Usuario usuario) {
        Instant agora = Instant.now();

        // "Claims" = as informações guardadas dentro do token
        JwtClaimsSet dados = JwtClaimsSet.builder()
                .issuer("catalogo-filmes")                    // quem emitiu
                .issuedAt(agora)                              // quando foi criado
                .expiresAt(agora.plus(7, ChronoUnit.DAYS))    // vale por 7 dias
                .subject(usuario.getId().toString())          // de quem é: o id do usuário
                .claim("nome", usuario.getNome())
                .build();

        // Cabeçalho do token: assinado com HMAC SHA-256 usando a chave secreta
        JwsHeader cabecalho = JwsHeader.with(MacAlgorithm.HS256).build();

        return encoder.encode(JwtEncoderParameters.from(cabecalho, dados)).getTokenValue();
    }
}
