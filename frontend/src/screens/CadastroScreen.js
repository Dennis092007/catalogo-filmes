import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import { useAuth } from '../AuthContext';
import { estilos } from '../estilos';

// TELA DE CADASTRO - criar uma conta nova (depois de criar, já entra no app)
export default function CadastroScreen() {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repetir, setRepetir] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function criarConta() {
    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Preencha nome, e-mail e senha.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== repetir) {
      setErro('As senhas não são iguais.');
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      await cadastrar(nome, email, senha);
    } catch (e) {
      setErro(e.message); // ex.: "Este e-mail já está cadastrado", vindo do backend
      setCarregando(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.tela}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={estilos.secao}>Seus dados</Text>
      <View style={estilos.cartao}>
        <Campo rotulo="Nome" value={nome} onChangeText={setNome} placeholder="Como quer ser chamado" />
        <Campo
          rotulo="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          ultimo
        />
      </View>

      <Text style={estilos.secao}>Senha</Text>
      <View style={estilos.cartao}>
        <Campo rotulo="Senha" value={senha} onChangeText={setSenha} placeholder="Mínimo 6 caracteres" secureTextEntry />
        <Campo rotulo="Repetir" value={repetir} onChangeText={setRepetir} placeholder="Digite de novo" secureTextEntry ultimo />
      </View>

      {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

      <Botao texto="Criar conta" onPress={criarConta} carregando={carregando} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    paddingTop: 24,
    paddingBottom: 40,
  },
});
