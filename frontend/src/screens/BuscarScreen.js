import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ListaFilmes from '../components/ListaFilmes';
import { listarFilmes } from '../api';
import { cores } from '../cores';

// TELA 2 - Busca de filmes pelo título
export default function BuscarScreen() {
  const [texto, setTexto] = useState('');
  const [filmes, setFilmes] = useState([]);
  const [erro, setErro] = useState(null);

  // Busca no backend quando o texto muda (e quando a tela aparece).
  // Espera 300 ms depois da última letra para não fazer uma requisição por tecla.
  useFocusEffect(
    useCallback(() => {
      if (texto.trim() === '') {
        setFilmes([]);
        setErro(null);
        return;
      }

      let buscaAtual = true; // evita mostrar o resultado de uma busca antiga
      const espera = setTimeout(() => {
        listarFilmes(texto)
          .then((dados) => {
            if (buscaAtual) {
              setFilmes(dados);
              setErro(null);
            }
          })
          .catch((e) => {
            if (buscaAtual) {
              setErro(e.message);
            }
          });
      }, 300);

      // Roda antes da próxima busca (ou ao sair da tela): cancela a espera e ignora a resposta antiga
      return () => {
        buscaAtual = false;
        clearTimeout(espera);
      };
    }, [texto])
  );

  return (
    <View style={styles.tela}>
      <View style={styles.barraBusca}>
        <Ionicons name="search" size={18} color={cores.cinza} />
        <TextInput
          style={styles.campo}
          placeholder="Título do filme"
          placeholderTextColor={cores.cinza}
          value={texto}
          onChangeText={setTexto}
          autoCorrect={false}
          returnKeyType="search"
        />
        {texto !== '' && (
          <Pressable onPress={() => setTexto('')}>
            <Ionicons name="close-circle" size={18} color={cores.cinza} />
          </Pressable>
        )}
      </View>

      <ListaFilmes
        filmes={filmes}
        erro={erro}
        mensagemVazia={texto ? 'Nenhum filme encontrado.' : 'Digite o título de um filme.'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
  },
  barraBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: 10,
    height: 36,
    marginHorizontal: 16,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  campo: {
    flex: 1,
    height: '100%',
    fontSize: 17,
    color: cores.texto,
    marginLeft: 6,
    outlineColor: 'transparent', // tira o contorno que o navegador desenha no campo
  },
});
