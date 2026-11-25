import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { aoExpirarSessao, criarConta, definirToken, entrar as entrarNaApi } from './api';

// Estado global do app: quem está logado.
// Qualquer tela pode ler com useAuth(), sem precisar receber isso por props.
const AuthContext = createContext(null);

// Nome da "gaveta" no AsyncStorage onde a sessão fica guardada no celular
const CHAVE_SESSAO = '@catalogo:sessao';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null); // { token, nome, email } ou null
  const [carregando, setCarregando] = useState(true); // lendo o AsyncStorage ao abrir o app

  // Ao abrir o app: se já tinha entrado antes, recupera a sessão salva no celular
  useEffect(() => {
    aoExpirarSessao(sair);

    AsyncStorage.getItem(CHAVE_SESSAO)
      .then((texto) => {
        if (texto) {
          const sessao = JSON.parse(texto);
          definirToken(sessao.token);
          setUsuario(sessao);
        }
      })
      .catch(() => AsyncStorage.removeItem(CHAVE_SESSAO))
      .finally(() => setCarregando(false));
  }, []);

  // Guarda a sessão no estado (a tela muda) e no AsyncStorage (sobrevive a fechar o app)
  async function iniciarSessao(sessao) {
    definirToken(sessao.token);
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    setUsuario(sessao);
  }

  async function entrar(email, senha) {
    const sessao = await entrarNaApi(email, senha);
    await iniciarSessao(sessao);
  }

  async function cadastrar(nome, email, senha) {
    const sessao = await criarConta(nome, email, senha);
    await iniciarSessao(sessao);
  }

  async function sair() {
    definirToken(null);
    await AsyncStorage.removeItem(CHAVE_SESSAO);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
