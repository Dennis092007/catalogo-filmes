package com.catalogo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.catalogo.dto.CadastroRequest;
import com.catalogo.dto.LoginRequest;
import com.catalogo.dto.LoginResponse;
import com.catalogo.service.AuthService;

import jakarta.validation.Valid;

// Rotas livres (sem token): criar conta e entrar
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    // POST /auth/cadastro -> cria a conta e já devolve o token (201 Created)
    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponse cadastrar(@Valid @RequestBody CadastroRequest dados) {
        return service.cadastrar(dados);
    }

    // POST /auth/login -> confere e-mail e senha e devolve o token
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest dados) {
        return service.login(dados);
    }
}
