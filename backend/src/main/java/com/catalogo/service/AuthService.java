package com.catalogo.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.catalogo.dto.CadastroRequest;
import com.catalogo.dto.LoginRequest;
import com.catalogo.dto.LoginResponse;
import com.catalogo.model.Usuario;
import com.catalogo.repository.UsuarioRepository;

// Regras de cadastro e login de usuários
@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UsuarioRepository repository, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public LoginResponse cadastrar(CadastroRequest dados) {
        String email = dados.email().trim().toLowerCase();

        if (repository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está cadastrado");
        }

        // A senha é salva criptografada: nem quem abre o banco consegue ler
        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        Usuario usuario = repository.save(new Usuario(dados.nome().trim(), email, senhaCriptografada));

        return criarResposta(usuario); // já entra direto depois de cadastrar
    }

    public LoginResponse login(LoginRequest dados) {
        String email = dados.email().trim().toLowerCase();

        // Mesma mensagem para e-mail inexistente e senha errada: não revela quais e-mails existem
        Usuario usuario = repository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos"));

        // matches() criptografa a senha digitada e compara com a salva
        if (!passwordEncoder.matches(dados.senha(), usuario.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");
        }

        return criarResposta(usuario);
    }

    private LoginResponse criarResposta(Usuario usuario) {
        String token = tokenService.gerarToken(usuario);
        return new LoginResponse(token, usuario.getNome(), usuario.getEmail());
    }
}
