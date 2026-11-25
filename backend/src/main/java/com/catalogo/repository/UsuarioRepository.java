package com.catalogo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.catalogo.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Usado no login: busca o usuário pelo e-mail
    Optional<Usuario> findByEmail(String email);

    // Usado no cadastro: impede e-mail repetido
    boolean existsByEmail(String email);
}
