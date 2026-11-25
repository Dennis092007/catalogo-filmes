package com.catalogo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// @Entity = esta classe vira a tabela "filme" no banco de dados
@Entity
public class Filme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Informe o título")
    private String titulo;

    private String diretor;

    @NotNull(message = "Informe o ano")
    @Min(value = 1888, message = "Ano inválido")
    private Integer ano;

    @NotBlank(message = "Informe o gênero")
    private String genero;

    @Min(value = 1, message = "Duração inválida")
    private Integer duracao; // em minutos (opcional)

    @NotNull(message = "Informe a nota")
    @Min(value = 0, message = "A nota vai de 0 a 10")
    @Max(value = 10, message = "A nota vai de 0 a 10")
    private Double nota;

    @Column(length = 2000)
    private String sinopse;

    // Link (URL) da imagem do pôster. Opcional, mas se vier tem que começar com http:// ou https://
    // (recusa imagens coladas como texto "data:image/...", que não cabem na coluna)
    @Column(length = 1000)
    @Size(max = 1000, message = "O link do pôster é longo demais")
    @Pattern(regexp = "^(https?://.*)?$", message = "O pôster precisa ser um link que comece com http:// ou https://")
    private String poster;

    private boolean favorito;

    // Dono do filme: vira a coluna "usuario_id" (chave estrangeira para a tabela usuario).
    // @JsonIgnore: o usuário não aparece no JSON enviado ao app.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id")
    @JsonIgnore
    private Usuario usuario;

    // Construtor vazio (obrigatório para o JPA)
    public Filme() {
    }

    // Construtor usado para cadastrar os filmes de exemplo
    public Filme(String titulo, String diretor, Integer ano, String genero,
                 Integer duracao, Double nota, String sinopse, String poster) {
        this.titulo = titulo;
        this.diretor = diretor;
        this.ano = ano;
        this.genero = genero;
        this.duracao = duracao;
        this.nota = nota;
        this.sinopse = sinopse;
        this.poster = poster;
    }

    // Getters e setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDiretor() { return diretor; }
    public void setDiretor(String diretor) { this.diretor = diretor; }

    public Integer getAno() { return ano; }
    public void setAno(Integer ano) { this.ano = ano; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public Integer getDuracao() { return duracao; }
    public void setDuracao(Integer duracao) { this.duracao = duracao; }

    public Double getNota() { return nota; }
    public void setNota(Double nota) { this.nota = nota; }

    public String getSinopse() { return sinopse; }
    public void setSinopse(String sinopse) { this.sinopse = sinopse; }

    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }

    public boolean isFavorito() { return favorito; }
    public void setFavorito(boolean favorito) { this.favorito = favorito; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
