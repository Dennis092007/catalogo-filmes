package com.catalogo.dto;

import jakarta.validation.constraints.NotBlank;

// Dados que o app envia para entrar: POST /auth/login
// "record" = classe só de dados; o Java cria construtor, getters, equals e toString sozinho.
public record LoginRequest(
        @NotBlank(message = "Informe o e-mail") String email,
        @NotBlank(message = "Informe a senha") String senha) {
}
