import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Poster from './Poster';
import { cores } from '../cores';

// Lista de filmes no estilo iOS. Usada nas telas Filmes, Buscar e Favoritos.
// "filmes" fica null enquanto ainda está carregando.
export default function ListaFilmes({ filmes, erro, mensagemVazia }) {
  const navigation = useNavigation();

  if (erro) {
    return <Aviso icone="cloud-offline-outline" texto={erro} />;
  }
  if (filmes === null) {
    return <ActivityIndicator style={styles.carregando} />;
  }
  if (filmes.length === 0) {
    return <Aviso icone="film-outline" texto={mensagemVazia} />;
  }

  return (
    <FlatList
      data={filmes}
      keyExtractor={(filme) => String(filme.id)}
      contentContainerStyle={styles.lista}
      ItemSeparatorComponent={Separador}
      renderItem={({ item, index }) => (
        <Pressable
          onPress={() => navigation.navigate('Detalhes', { id: item.id })}
          style={({ pressed }) => [
            styles.linha,
            index === 0 && styles.primeiraLinha,
            index === filmes.length - 1 && styles.ultimaLinha,
            pressed && styles.linhaPressionada,
          ]}
        >
          <Poster url={item.poster} largura={50} altura={75} />

          <View style={styles.textos}>
            <Text style={styles.titulo} numberOfLines={1}>
              {item.titulo}
            </Text>
            <Text style={styles.detalhe}>
              {item.ano} · {item.genero}
            </Text>
            <View style={styles.nota}>
              <Ionicons name="star" size={13} color={cores.laranja} />
              <Text style={styles.detalhe}> {item.nota?.toFixed(1)}</Text>
              {item.favorito && <Ionicons name="heart" size={13} color={cores.vermelho} style={styles.coracao} />}
            </View>
          </View>

          <Ionicons name="chevron-forward" size={18} color={cores.separador} />
        </Pressable>
      )}
    />
  );
}

// Linha fina entre os filmes (começa depois do pôster, como no iOS)
function Separador() {
  return (
    <View style={styles.separadorFundo}>
      <View style={styles.separador} />
    </View>
  );
}

// Mensagem no meio da tela (lista vazia ou erro)
function Aviso({ icone, texto }) {
  return (
    <View style={styles.aviso}>
      <Ionicons name={icone} size={48} color={cores.cinza} />
      <Text style={styles.avisoTexto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  lista: {
    padding: 16,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.branco,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  primeiraLinha: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  ultimaLinha: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  linhaPressionada: {
    backgroundColor: cores.pressionado,
  },
  textos: {
    flex: 1,
    marginLeft: 12,
  },
  titulo: {
    fontSize: 17,
    fontWeight: '600',
    color: cores.texto,
  },
  detalhe: {
    fontSize: 15,
    color: cores.cinza,
    marginTop: 2,
  },
  nota: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coracao: {
    marginLeft: 8,
    marginTop: 2,
  },
  separadorFundo: {
    backgroundColor: cores.branco,
  },
  separador: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: cores.separador,
    marginLeft: 78, // 16 de margem + 50 do pôster + 12 de espaço
  },
  carregando: {
    marginTop: 40,
  },
  aviso: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  avisoTexto: {
    fontSize: 17,
    color: cores.cinza,
    textAlign: 'center',
    marginTop: 12,
  },
});
