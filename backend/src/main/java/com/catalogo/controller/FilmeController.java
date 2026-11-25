package com.catalogo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.catalogo.model.Filme;
import com.catalogo.service.FilmeService;

import jakarta.validation.Valid;

// Rotas dos filmes. Todas exigem o token (veja SecurityConfig).
// @AuthenticationPrincipal Jwt token = o token já conferido pelo Spring Security;
// o "subject" dele é o id do usuário logado.
@RestController
@RequestMapping("/filmes")
public class FilmeController {

    private final FilmeService service;

    public FilmeController(FilmeService service) {
        this.service = service;
    }

    // GET /filmes             -> todos os filmes do usuário
    // GET /filmes?titulo=mat  -> busca pelo título
    @GetMapping
    public List<Filme> listar(@AuthenticationPrincipal Jwt token,
                              @RequestParam(required = false) String titulo) {
        return service.listar(usuarioId(token), titulo);
    }

    // GET /filmes/favoritos -> só os favoritos
    @GetMapping("/favoritos")
    public List<Filme> favoritos(@AuthenticationPrincipal Jwt token) {
        return service.listarFavoritos(usuarioId(token));
    }

    // GET /filmes/1 -> um filme pelo id (404 se não existir)
    @GetMapping("/{id}")
    public Filme buscar(@AuthenticationPrincipal Jwt token, @PathVariable Long id) {
        return service.buscarPorId(id, usuarioId(token));
    }

    // POST /filmes -> cadastra um filme novo e responde 201 (Created)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Filme criar(@AuthenticationPrincipal Jwt token, @Valid @RequestBody Filme filme) {
        return service.criar(filme, usuarioId(token));
    }

    // PUT /filmes/1 -> altera um filme (também usado para favoritar)
    @PutMapping("/{id}")
    public Filme atualizar(@AuthenticationPrincipal Jwt token, @PathVariable Long id,
                           @Valid @RequestBody Filme filme) {
        return service.atualizar(id, filme, usuarioId(token));
    }

    // DELETE /filmes/1 -> exclui um filme e responde 204 (sem conteúdo)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@AuthenticationPrincipal Jwt token, @PathVariable Long id) {
        service.excluir(id, usuarioId(token));
    }

    // O id do usuário foi guardado como "subject" do token no TokenService
    private Long usuarioId(Jwt token) {
        return Long.valueOf(token.getSubject());
    }
}
