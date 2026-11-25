package com.catalogo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.catalogo.model.Filme;
import com.catalogo.model.Usuario;
import com.catalogo.repository.FilmeRepository;
import com.catalogo.repository.UsuarioRepository;

// Roda quando o backend inicia. Se o banco estiver vazio, cria um usuário de
// demonstração (demo@catalogo.com / 123456) com alguns filmes de exemplo.
@Component
public class DadosIniciais implements CommandLineRunner {

    // Imagens dos pôsteres (TMDB - The Movie Database)
    private static final String IMG = "https://image.tmdb.org/t/p/w500";

    private final UsuarioRepository usuarioRepository;
    private final FilmeRepository filmeRepository;
    private final PasswordEncoder passwordEncoder;

    public DadosIniciais(UsuarioRepository usuarioRepository, FilmeRepository filmeRepository,
                         PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.filmeRepository = filmeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return; // o banco já tem dados
        }

        Usuario demo = usuarioRepository.save(
                new Usuario("Usuário Demo", "demo@catalogo.com", passwordEncoder.encode("123456")));

        salvar(demo, new Filme("Interestelar", "Christopher Nolan", 2014, "Ficção científica", 169, 8.7,
                "Com a Terra cada vez menos habitável, um grupo de astronautas atravessa um buraco de minhoca em busca de um novo lar para a humanidade.",
                IMG + "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"));

        salvar(demo, new Filme("O Poderoso Chefão", "Francis Ford Coppola", 1972, "Crime", 175, 9.2,
                "O chefe de uma poderosa família da máfia de Nova York precisa passar o comando dos negócios para o filho mais novo, que nunca quis fazer parte desse mundo.",
                IMG + "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"));

        salvar(demo, new Filme("Cidade de Deus", "Fernando Meirelles", 2002, "Drama", 130, 8.6,
                "Buscapé, um jovem que sonha em ser fotógrafo, acompanha o crescimento do crime na comunidade onde mora, no Rio de Janeiro.",
                IMG + "/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg"));

        salvar(demo, new Filme("Batman: O Cavaleiro das Trevas", "Christopher Nolan", 2008, "Ação", 152, 9.0,
                "Batman enfrenta o Coringa, um criminoso imprevisível que quer mergulhar Gotham no caos e testar até onde vai o herói.",
                IMG + "/qJ2tW6WMUDux911r6m7haRef0WH.jpg"));

        salvar(demo, new Filme("Um Sonho de Liberdade", "Frank Darabont", 1994, "Drama", 142, 9.3,
                "Condenado injustamente, um bancário passa décadas na prisão de Shawshank, onde faz uma amizade improvável e nunca perde a esperança.",
                IMG + "/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg"));

        salvar(demo, new Filme("A Origem", "Christopher Nolan", 2010, "Ficção científica", 148, 8.8,
                "Um ladrão que rouba segredos de dentro dos sonhos recebe uma missão diferente: plantar uma ideia na mente de alguém.",
                IMG + "/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"));

        salvar(demo, new Filme("Matrix", "Lana e Lilly Wachowski", 1999, "Ficção científica", 136, 8.7,
                "Um programador descobre que o mundo em que vive é uma simulação criada por máquinas e se junta à resistência.",
                IMG + "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"));

        salvar(demo, new Filme("Parasita", "Bong Joon-ho", 2019, "Suspense", 132, 8.5,
                "Uma família pobre se infiltra, aos poucos, na casa de uma família rica, até que um segredo escondido muda tudo.",
                IMG + "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"));

        salvar(demo, new Filme("A Viagem de Chihiro", "Hayao Miyazaki", 2001, "Animação", 125, 8.6,
                "Durante uma mudança, uma menina de 10 anos entra em um mundo mágico de espíritos e precisa trabalhar em uma casa de banhos para salvar os pais.",
                IMG + "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg"));

        salvar(demo, new Filme("Forrest Gump", "Robert Zemeckis", 1994, "Drama", 142, 8.8,
                "Um homem simples e de bom coração participa, quase sem perceber, de alguns dos momentos mais marcantes da história dos Estados Unidos.",
                IMG + "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg"));

        salvar(demo, new Filme("O Rei Leão", "Roger Allers e Rob Minkoff", 1994, "Animação", 88, 8.5,
                "Depois da morte do pai, o jovem Simba foge do reino, mas precisa voltar para enfrentar o tio Scar e assumir seu lugar.",
                IMG + "/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg"));

        salvar(demo, new Filme("De Volta para o Futuro", "Robert Zemeckis", 1985, "Aventura", 116, 8.5,
                "O adolescente Marty McFly viaja sem querer para 1955 em uma máquina do tempo e precisa garantir que seus pais se apaixonem.",
                IMG + "/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg"));
    }

    // Liga o filme ao dono e salva
    private void salvar(Usuario dono, Filme filme) {
        filme.setUsuario(dono);
        filmeRepository.save(filme);
    }
}
