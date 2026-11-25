package com.catalogo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

// Vale para todos os controllers: transforma erros em respostas JSON
// no formato {"mensagem": "..."}, que o app mostra na tela.
@RestControllerAdvice
public class TratadorDeErros {

    // Formato da resposta de erro
    public record Erro(String mensagem) {
    }

    // Erros lançados pelos services (404 filme não encontrado, 401 senha errada, 409 e-mail repetido)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Erro> erroComStatus(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(new Erro(e.getReason()));
    }

    // Dados que não passaram no @Valid (ex.: título vazio, nota 15) -> 400 Bad Request
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Erro> dadosInvalidos(MethodArgumentNotValidException e) {
        String mensagem = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.badRequest().body(new Erro(mensagem));
    }
}
