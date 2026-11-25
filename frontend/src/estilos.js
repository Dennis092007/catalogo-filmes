import { StyleSheet } from 'react-native';
import { cores } from './cores';

// Estilos repetidos em várias telas (título de seção, cartão branco, mensagem de erro)
export const estilos = StyleSheet.create({
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
  erro: {
    fontSize: 15,
    color: cores.vermelho,
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
});
