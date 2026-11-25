import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Poster from '../components/Poster';
import { buscarFilme, excluirFilme, salvarFilme } from '../api';
import { avisar, confirmar } from '../alertas';
import { cores } from '../cores';

// TELA 4 - Detalhes de um filme (favoritar, editar e excluir)
export default function DetalhesScreen({ route, navigation }) {
  const { id } = route.params;
  const [filme, setFilme] = useState(null);
  const [erro, setErro] = useState(null);

  // Busca o filme toda vez que a tela aparece (ex.: depois de editar)
  useFocusEffect(
    useCallback(() => {
      buscarFilme(id)
        .then(setFilme)
        .catch((e) => setErro(e.message));
    }, [id])
  );

  async function alternarFavorito() {
    try {
      const atualizado = await salvarFilme({ ...filme, favorito: !filme.favorito });
      setFilme(atualizado);
    } catch (e) {
      avisar('Erro', e.message);
    }
  }

  function excluir() {
    confirmar('Excluir filme', `Deseja excluir "${filme.titulo}"?`, 'Excluir', async () => {
      try {
        await excluirFilme(filme.id);
        navigation.goBack();
      } catch (e) {
        avisar('Erro', e.message);
      }
    });
  }

  if (erro) {
    return <Text style={styles.erro}>{erro}</Text>;
  }
  if (!filme) {
    return <ActivityIndicator style={styles.carregando} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.tela}>
      <View style={styles.topo}>
        <View style={styles.sombra}>
          <Poster url={filme.poster} largura={180} altura={270} />
        </View>
        <Text style={styles.titulo}>{filme.titulo}</Text>
        <Text style={styles.subtitulo}>
          {filme.ano} · {filme.genero}
        </Text>
        <View style={styles.nota}>
          <Ionicons name="star" size={18} color={cores.laranja} />
          <Text style={styles.notaTexto}>{filme.nota?.toFixed(1)}</Text>
        </View>
      </View>

      <Text style={styles.secao}>Sinopse</Text>
      <View style={styles.cartao}>
        <Text style={styles.sinopse}>{filme.sinopse || 'Sem sinopse.'}</Text>
      </View>

      <Text style={styles.secao}>Informações</Text>
      <View style={styles.cartao}>
        <Info rotulo="Diretor" valor={filme.diretor} />
        <Info rotulo="Duração" valor={filme.duracao ? filme.duracao + ' min' : ''} ultimo />
      </View>

      <View style={styles.cartao}>
        <Acao
          icone={filme.favorito ? 'heart' : 'heart-outline'}
          texto={filme.favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          onPress={alternarFavorito}
        />
        <Acao
          icone="create-outline"
          texto="Editar filme"
          onPress={() => navigation.navigate('Formulario', { filme })}
        />
        <Acao icone="trash-outline" texto="Excluir filme" cor={cores.vermelho} onPress={excluir} ultimo />
      </View>
    </ScrollView>
  );
}

// Linha com rótulo à esquerda e valor à direita
function Info({ rotulo, valor, ultimo }) {
  return (
    <View style={[styles.linha, !ultimo && styles.separador]}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Text style={styles.valor}>{valor || '—'}</Text>
    </View>
  );
}

// Linha que funciona como botão (igual à tela de contatos do iPhone)
function Acao({ icone, texto, cor = cores.azul, onPress, ultimo }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressionado}>
      <View style={[styles.linha, !ultimo && styles.separador]}>
        <Ionicons name={icone} size={22} color={cor} />
        <Text style={[styles.acaoTexto, { color: cor }]}>{texto}</Text>
      </View>
    </Pressable>
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
  sombra: {
    borderRadius: 14,
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.25)',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: cores.texto,
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 17,
    color: cores.cinza,
    marginTop: 4,
  },
  nota: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  notaTexto: {
    fontSize: 17,
    fontWeight: '600',
    color: cores.texto,
    marginLeft: 4,
  },
  secao: {
    fontSize: 13,
    color: cores.cinza,
    textTransform: 'uppercase',
    marginHorizontal: 32,
    marginBottom: 6,
  },
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sinopse: {
    fontSize: 17,
    lineHeight: 24,
    color: cores.texto,
    padding: 16,
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
  rotulo: {
    flex: 1,
    fontSize: 17,
    color: cores.texto,
  },
  valor: {
    fontSize: 17,
    color: cores.cinza,
  },
  acaoTexto: {
    fontSize: 17,
    marginLeft: 12,
  },
  pressionado: {
    backgroundColor: cores.pressionado,
  },
  erro: {
    fontSize: 17,
    color: cores.cinza,
    textAlign: 'center',
    margin: 32,
  },
  carregando: {
    marginTop: 40,
  },
});
