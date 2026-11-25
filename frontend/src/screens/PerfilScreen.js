import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { listarFavoritos, listarFilmes } from '../api';
import { confirmar } from '../alertas';
import { cores } from '../cores';
import { estilos } from '../estilos';

// TELA DE PERFIL - dados de quem está logado, números da lista e botão de sair
export default function PerfilScreen() {
  const { usuario, sair } = useAuth(); // vem do estado global (AuthContext)
  const [total, setTotal] = useState('—');
  const [favoritos, setFavoritos] = useState('—');

  // Conta os filmes toda vez que a tela aparece
  useFocusEffect(
    useCallback(() => {
      listarFilmes()
        .then((filmes) => setTotal(filmes.length))
        .catch(() => setTotal('—'));
      listarFavoritos()
        .then((filmes) => setFavoritos(filmes.length))
        .catch(() => setFavoritos('—'));
    }, [])
  );

  function sairDaConta() {
    confirmar('Sair', 'Deseja sair da sua conta?', 'Sair', sair);
  }

  // Logo depois de sair, a tela ainda pode aparecer por um instante sem usuário
  if (!usuario) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.tela}>
      <View style={styles.topo}>
        <View style={styles.avatar}>
          <Text style={styles.inicial}>{usuario.nome.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.nome}>{usuario.nome}</Text>
        <Text style={styles.email}>{usuario.email}</Text>
      </View>

      <Text style={estilos.secao}>Minha lista</Text>
      <View style={estilos.cartao}>
        <Linha icone="film" texto="Filmes cadastrados" valor={total} />
        <Linha icone="heart" texto="Favoritos" valor={favoritos} ultimo />
      </View>

      <View style={estilos.cartao}>
        <Pressable onPress={sairDaConta} style={({ pressed }) => pressed && styles.pressionado}>
          <View style={styles.linha}>
            <Ionicons name="log-out-outline" size={22} color={cores.vermelho} />
            <Text style={[styles.texto, styles.sair]}>Sair da conta</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Linha({ icone, texto, valor, ultimo }) {
  return (
    <View style={[styles.linha, !ultimo && styles.separador]}>
      <Ionicons name={icone} size={22} color={cores.azul} />
      <Text style={styles.texto}>{texto}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    paddingBottom: 32,
  },
  topo: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: cores.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: {
    fontSize: 40,
    fontWeight: '600',
    color: cores.branco,
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.texto,
    marginTop: 12,
  },
  email: {
    fontSize: 17,
    color: cores.cinza,
    marginTop: 4,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: 11,
    paddingRight: 16,
    marginLeft: 16,
  },
  separador: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.separador,
  },
  texto: {
    flex: 1,
    fontSize: 17,
    color: cores.texto,
    marginLeft: 12,
  },
  valor: {
    fontSize: 17,
    color: cores.cinza,
  },
  sair: {
    color: cores.vermelho,
  },
  pressionado: {
    backgroundColor: cores.pressionado,
  },
});
