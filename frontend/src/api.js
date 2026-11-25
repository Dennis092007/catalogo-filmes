import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Endereço do backend (Spring Boot, porta 8080).
// - No navegador: usa o mesmo endereço da página (ex.: localhost).
// - No celular (Expo Go): usa o IP do computador onde o Expo está rodando.
// Se precisar, troque por um endereço fixo, ex.: 'http://192.168.0.10:8080'
const ip =
  Platform.OS === 'web'
    ? window.location.hostname
    : Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';

export const API_URL = `http://${ip}:8080`;

const ERRO_CONEXAO =
  'Não foi possível conectar ao servidor.\nVerifique se o backend está rodando em ' + API_URL;

// Token JWT do usuário logado. Quem preenche é o AuthContext (no login e ao abrir o app).
let token = null;
let aoExpirar = null;

export function definirToken(novoToken) {
  token = novoToken;
}

// O AuthContext registra aqui o que fazer quando o token vencer (sair da conta)
export function aoExpirarSessao(funcao) {
  aoExpirar = funcao;
}

// Faz a requisição para o backend e devolve o JSON da resposta
async function requisicao(caminho, metodo = 'GET', corpo) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = 'Bearer ' + token; // é assim que o backend sabe quem está pedindo
  }

  let resposta;
  try {
    resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error(ERRO_CONEXAO); // o backend nem respondeu
  }

  // 401 com token = o token venceu ou é inválido: sai da conta
  if (resposta.status === 401 && token) {
    aoExpirar?.();
    throw new Error('Sua sessão expirou. Entre novamente.');
  }

  if (!resposta.ok) {
    // O backend manda {"mensagem": "..."} nos erros; se não mandar, mostra o código
    const erro = await resposta.json().catch(() => null);
    throw new Error(erro?.mensagem ?? 'Erro ' + resposta.status);
  }

  if (resposta.status === 204) {
    return null; // o DELETE não devolve conteúdo
  }
  return resposta.json();
}

// ---------- Usuários ----------

export function entrar(email, senha) {
  return requisicao('/auth/login', 'POST', { email, senha });
}

export function criarConta(nome, email, senha) {
  return requisicao('/auth/cadastro', 'POST', { nome, email, senha });
}

// ---------- Filmes (todas exigem estar logado) ----------

export function listarFilmes(titulo = '') {
  return requisicao('/filmes?titulo=' + encodeURIComponent(titulo));
}

export function listarFavoritos() {
  return requisicao('/filmes/favoritos');
}

export function buscarFilme(id) {
  return requisicao('/filmes/' + id);
}

// Se o filme já tem id, altera (PUT). Se não tem, cadastra (POST).
export function salvarFilme(filme) {
  if (filme.id) {
    return requisicao('/filmes/' + filme.id, 'PUT', filme);
  }
  return requisicao('/filmes', 'POST', filme);
}

export function excluirFilme(id) {
  return requisicao('/filmes/' + id, 'DELETE');
}
