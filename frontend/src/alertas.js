import { Alert, Platform } from 'react-native';

// No navegador o Alert do React Native não aparece,
// então lá usamos o alert() e o confirm() do próprio navegador.

export function avisar(titulo, mensagem) {
  if (Platform.OS === 'web') {
    window.alert(mensagem);
    return;
  }
  Alert.alert(titulo, mensagem);
}

// Pergunta antes de uma ação perigosa (excluir, sair). Só chama aoConfirmar se a pessoa confirmar.
export function confirmar(titulo, mensagem, textoBotao, aoConfirmar) {
  if (Platform.OS === 'web') {
    if (window.confirm(mensagem)) {
      aoConfirmar();
    }
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: textoBotao, style: 'destructive', onPress: aoConfirmar },
  ]);
}
