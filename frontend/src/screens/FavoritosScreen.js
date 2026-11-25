import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ListaFilmes from '../components/ListaFilmes';
import { listarFavoritos } from '../api';

// TELA 3 - Filmes marcados como favoritos
export default function FavoritosScreen() {
  const [filmes, setFilmes] = useState(null);
  const [erro, setErro] = useState(null);

  // Carrega os favoritos toda vez que a tela aparece
  useFocusEffect(
    useCallback(() => {
      listarFavoritos()
        .then((dados) => {
          setFilmes(dados);
          setErro(null);
        })
        .catch((e) => setErro(e.message));
    }, [])
  );

  return (
    <ListaFilmes
      filmes={filmes}
      erro={erro}
      mensagemVazia={'Você ainda não tem favoritos.\nAbra um filme e toque em "Adicionar aos favoritos".'}
    />
  );
}
