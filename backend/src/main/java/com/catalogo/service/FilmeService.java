package com.catalogo.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.catalogo.model.Filme;
import com.catalogo.repository.FilmeRepository;
import com.catalogo.repository.UsuarioRepository;

// Regras dos filmes. Todo método recebe o id do usuário logado,
// então cada um só enxerga e altera os próprios filmes.
@Service
public class FilmeService {

    private final FilmeRepository repository;
    private final UsuarioRepository usuarioRepository;

    public FilmeService(FilmeRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    // Sem texto: todos os filmes do usuário. Com texto: só os que têm esse texto no título.
    public List<Filme> listar(Long usuarioId, String titulo) {
        if (titulo == null || titulo.isBlank()) {
            return repository.findByUsuarioIdOrderByTitulo(usuarioId);
        }
        return repository.findByUsuarioIdAndTituloContainingIgnoreCaseOrderByTitulo(usuarioId, titulo.trim());
    }

    public List<Filme> listarFavoritos(Long usuarioId) {
        return repository.findByUsuarioIdAndFavoritoTrueOrderByTitulo(usuarioId);
    }

    // Se o filme não existe (ou é de outro usuário), responde 404
    public Filme buscarPorId(Long id, Long usuarioId) {
        return repository.findByIdAndUsuarioId(id, usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Filme não encontrado"));
    }

    public Filme criar(Filme filme, Long usuarioId) {
        filme.setId(null); // garante que é um cadastro novo, e não a alteração de um filme que já existe
        filme.setUsuario(usuarioRepository.getReferenceById(usuarioId)); // o dono é quem está logado
        return repository.save(filme);
    }

    // Também é usado para favoritar: o app manda o filme inteiro com "favorito" trocado
    public Filme atualizar(Long id, Filme dados, Long usuarioId) {
        buscarPorId(id, usuarioId);  // 404 se não existir ou for de outro usuário
        dados.setId(id);             // vale o id da URL, não o do corpo
        dados.setUsuario(usuarioRepository.getReferenceById(usuarioId)); // o dono continua o mesmo
        return repository.save(dados);
    }

    public void excluir(Long id, Long usuarioId) {
        buscarPorId(id, usuarioId);  // 404 se não existir ou for de outro usuário
        repository.deleteById(id);
    }
}
