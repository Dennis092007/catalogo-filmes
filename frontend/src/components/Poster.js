import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores } from '../cores';

// Mostra o pôster do filme. Se não tiver imagem, ou se o link não carregar, mostra um ícone.
export default function Poster({ url, largura, altura }) {
  const [falhou, setFalhou] = useState(false);
  const tamanho = { width: largura, height: altura, borderRadius: largura * 0.08 };

  // Se o link mudar (ex.: depois de editar o filme), tenta carregar de novo
  useEffect(() => {
    setFalhou(false);
  }, [url]);

  if (!url || falhou) {
    return (
      <View style={[styles.semImagem, tamanho]}>
        <Ionicons name="film-outline" size={largura * 0.4} color={cores.cinza} />
      </View>
    );
  }

  return <Image source={{ uri: url }} style={[styles.imagem, tamanho]} onError={() => setFalhou(true)} />;
}

const styles = StyleSheet.create({
  imagem: {
    backgroundColor: cores.cinzaClaro,
  },
  semImagem: {
    backgroundColor: cores.cinzaClaro,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
