package com.catalogo.dto;

// O que o backend devolve depois do login ou do cadastro:
// o token JWT (que o app manda nas próximas requisições) e os dados para mostrar no perfil.
// A senha nunca é devolvida.
public record LoginResponse(String token, String nome, String email) {
}
