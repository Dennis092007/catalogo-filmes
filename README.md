# Catálogo de Filmes

Aplicativo mobile para cada pessoa montar e organizar a **própria lista de filmes**: os que já viu, os que quer ver e os favoritos, com nota, sinopse e pôster. Resolve um problema comum: anotações de filmes espalhadas em blocos de notas, prints e conversas, sem busca e sem organização. Cada usuário tem uma conta e só enxerga os próprios filmes.

## Funcionalidades

- Criar conta e entrar com e-mail e senha (autenticação com JWT)
- Continuar logado ao fechar e abrir o app (sessão salva com AsyncStorage)
- Cadastrar, listar, editar e excluir filmes
- Buscar filmes pelo título
- Marcar e desmarcar favoritos
- Perfil com o total de filmes e de favoritos, e opção de sair

## Tecnologias

| Parte | Tecnologias |
| --- | --- |
| Frontend | React Native com Expo, React Navigation (pilha e abas), Context API, AsyncStorage |
| Backend | Java 17, Spring Boot 4, Spring Security com JWT (OAuth2 Resource Server), Spring Data JPA, Bean Validation |
| Banco de dados | MySQL 8 |

## Estrutura

```text
backend/    API REST em Spring Boot
  src/main/java/com/catalogo/
    config/       segurança (Spring Security + JWT) e dados iniciais
    controller/   rotas da API
    service/      regras de negócio e geração do token
    repository/   acesso ao banco (Spring Data JPA)
    model/        entidades Usuario e Filme
    dto/          dados de login e cadastro
    exception/    respostas de erro em JSON
frontend/   aplicativo em React Native (Expo)
  App.js          navegação e troca entre login e catálogo
  src/AuthContext.js   estado global do usuário logado + AsyncStorage
  src/api.js      comunicação com a API
  src/screens/    as 8 telas
  src/components/ componentes reutilizados
```

## Telas

Login, Cadastro, Filmes, Buscar, Favoritos, Perfil, Detalhes do filme e Formulário (novo/editar filme).

## Rotas da API

| Método | Rota | Token? | Descrição |
| --- | --- | --- | --- |
| POST | `/auth/cadastro` | Não | Cria a conta e devolve o token |
| POST | `/auth/login` | Não | Confere e-mail e senha e devolve o token |
| GET | `/filmes?titulo=` | Sim | Lista os filmes do usuário (com busca opcional) |
| GET | `/filmes/favoritos` | Sim | Lista os favoritos |
| GET | `/filmes/{id}` | Sim | Detalhes de um filme |
| POST | `/filmes` | Sim | Cadastra um filme |
| PUT | `/filmes/{id}` | Sim | Altera um filme (também usado para favoritar) |
| DELETE | `/filmes/{id}` | Sim | Exclui um filme |

As rotas com token esperam o cabeçalho `Authorization: Bearer <token>`.

## Como executar

### Pré-requisitos

- Java 17 ou mais recente
- MySQL 8 rodando na porta 3306
- Node.js 22 ou mais recente
- App **Expo Go** no celular (ou um navegador, para a versão web)
- Celular e computador na mesma rede Wi-Fi

### 1. Banco de dados

Com o MySQL rodando, abra `backend/src/main/resources/application.properties` e coloque o usuário e a senha do seu MySQL em `spring.datasource.username` e `spring.datasource.password` (o padrão no projeto é `root` / `root`). Não precisa criar o banco nem as tabelas: o banco `catalogo_filmes` é criado na primeira execução, e as tabelas `usuario` e `filme` são criadas pelo Hibernate a partir das entidades.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run        # no Windows: mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8080`. Na primeira execução é cadastrado um usuário de demonstração com 12 filmes.

### 3. Frontend

```bash
cd frontend
npm install
npx expo start
```

Leia o QR code com o Expo Go (Android) ou com a câmera (iPhone). Para abrir no navegador, aperte `w` no terminal do Expo.

O app descobre sozinho o IP do computador. Se não conectar, confira se o backend está rodando e se o firewall libera a porta 8080.

### Usuário de demonstração

- E-mail: `demo@catalogo.com`
- Senha: `123456`

## Integrantes

| Nome completo | RM | Responsabilidade |
| --- | --- | --- |
| Gustavo Santos Ferreira | RM1143173580 | Backend: estrutura do projeto, banco de dados e CRUD de filmes |
| Pedro Miguel | RM1143093128 | Backend: usuários, Spring Security e JWT |
| Gustavo Pereira | RM1143092749 | Frontend: comunicação com a API, componentes e telas do catálogo |
| Dennis Nunes | RM1143139773 | Frontend: navegação, estado global, AsyncStorage e telas de login, cadastro e perfil |

## Histórico

O projeto foi desenvolvido sem controle de versão e enviado ao GitHub em 25/11/2026. Cada integrante fez o commit da parte pela qual foi responsável.
