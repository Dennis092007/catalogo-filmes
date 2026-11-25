import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ListaFilmes from '../components/ListaFilmes';
import { listarFilmes } from '../api';

// TELA 1 - Lista com todos os filmes
export default function FilmesScreen() {
  const [filmes, setFilmes] = useState(null);
  const [erro, setErro] = useState(null);

  // Carrega a lista toda vez que a tela aparece (ex.: depois de cadastrar um filme)
  useFocusEffect(
    useCallback(() => {
      listarFilmes()
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
      mensagemVazia={'Nenhum filme cadastrado.\nToque em + para adicionar.'}
    />
  );
}
