import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import { useAuth } from '../AuthContext';
import { cores } from '../cores';
import { estilos } from '../estilos';

// TELA DE LOGIN - primeira tela para quem ainda não entrou
export default function LoginScreen({ navigation }) {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin() {
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      await entrar(email, senha);
      // Não precisa navegar: com o usuário salvo no AuthContext, o App.js troca para as telas do catálogo
    } catch (e) {
      setErro(e.message);
      setCarregando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.tela} keyboardShouldPersistTaps="handled">
      <View style={styles.topo}>
        <View style={styles.icone}>
          <Ionicons name="film" size={44} color={cores.branco} />
        </View>
        <Text style={styles.titulo}>Catálogo de Filmes</Text>
        <Text style={styles.subtitulo}>Sua lista pessoal de filmes</Text>
      </View>

      <View style={estilos.cartao}>
        <Campo
          rotulo="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Campo
          rotulo="Senha"
          value={senha}
          onChangeText={setSenha}
          placeholder="Sua senha"
          secureTextEntry // esconde o que é digitado
          onSubmitEditing={fazerLogin}
          ultimo
        />
      </View>

      {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

      <Botao texto="Entrar" onPress={fazerLogin} carregando={carregando} />

      <Pressable style={styles.link} onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.linkTexto}>Não tem conta? Criar conta</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  topo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icone: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: cores.azul,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: cores.texto,
    marginTop: 16,
  },
  subtitulo: {
    fontSize: 17,
    color: cores.cinza,
    marginTop: 4,
  },
  link: {
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  linkTexto: {
    fontSize: 17,
    color: cores.azul,
  },
});
