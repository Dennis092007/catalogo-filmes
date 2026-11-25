import { StyleSheet, Text, TextInput, View } from 'react-native';
import { cores } from '../cores';

// Uma linha de formulário: rótulo à esquerda e campo à direita (como nos Ajustes do iPhone).
// Usada no Login, no Cadastro e no formulário de filme.
// "...props" junta o resto (value, onChangeText, placeholder...) e repassa para o TextInput.
export default function Campo({ rotulo, ultimo, ...props }) {
  return (
    <View style={[styles.campo, !ultimo && styles.separador]}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput style={styles.input} placeholderTextColor={cores.cinza} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingRight: 16,
  },
  separador: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.separador,
  },
  rotulo: {
    width: 80,
    fontSize: 17,
    color: cores.texto,
  },
  input: {
    flex: 1,
    fontSize: 17,
    color: cores.texto,
    paddingVertical: 11,
    outlineColor: 'transparent', // tira o contorno que o navegador desenha no campo
  },
});
