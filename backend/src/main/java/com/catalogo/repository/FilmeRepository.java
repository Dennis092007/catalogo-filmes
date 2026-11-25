package com.catalogo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.catalogo.model.Filme;

// O Spring cria sozinho os métodos do banco: findAll, findById, save, delete...
// Os métodos abaixo são montados pelo nome: "UsuarioId" filtra pelo dono do filme
// e "OrderByTitulo" devolve em ordem alfabética.
public interface FilmeRepository extends JpaRepository<Filme, Long> {

    // Todos os filmes de um usuário
    List<Filme> findByUsuarioIdOrderByTitulo(Long usuarioId);

    // Filmes do usuário cujo título contém o texto digitado (ignora maiúsculas/minúsculas)
    List<Filme> findByUsuarioIdAndTituloContainingIgnoreCaseOrderByTitulo(Long usuarioId, String titulo);

    // Só os favoritos do usuário
    List<Filme> findByUsuarioIdAndFavoritoTrueOrderByTitulo(Long usuarioId);

    // Um filme pelo id, mas só se for desse usuário
    Optional<Filme> findByIdAndUsuarioId(Long id, Long usuarioId);
}
