import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '../cores';

// Botão azul de largura total. Enquanto "carregando" for true, mostra a rodinha
// e não aceita outro toque (evita enviar duas vezes).
export default function Botao({ texto, onPress, carregando }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.botao, (pressed || carregando) && styles.apagado]}
      onPress={onPress}
      disabled={carregando}
    >
      {carregando ? <ActivityIndicator color={cores.branco} /> : <Text style={styles.texto}>{texto}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: cores.azul,
    borderRadius: 12,
    height: 50,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apagado: {
    opacity: 0.7,
  },
  texto: {
    fontSize: 17,
    fontWeight: '600',
    color: cores.branco,
  },
});
