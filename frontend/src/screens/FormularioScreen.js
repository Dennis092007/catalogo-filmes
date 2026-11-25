import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import { salvarFilme } from '../api';
import { cores } from '../cores';
import { estilos } from '../estilos';

// TELA - Cadastrar um filme novo ou editar um existente
export default function FormularioScreen({ route, navigation }) {
  // Quando vem da tela de detalhes, recebe o filme que vai ser editado
  const filme = route.params?.filme ?? {};

  const [titulo, setTitulo] = useState(filme.titulo ?? '');
  const [diretor, setDiretor] = useState(filme.diretor ?? '');
  const [ano, setAno] = useState(String(filme.ano ?? ''));
  const [genero, setGenero] = useState(filme.genero ?? '');
  const [duracao, setDuracao] = useState(String(filme.duracao ?? ''));
  const [nota, setNota] = useState(String(filme.nota ?? ''));
  const [sinopse, setSinopse] = useState(filme.sinopse ?? '');
  const [poster, setPoster] = useState(filme.poster ?? '');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function salvar() {
    const anoNumero = Number(ano);
    const duracaoNumero = Number(duracao);
    const notaNumero = Number(nota.replace(',', '.')); // aceita "8,5"
    const anoAtual = new Date().getFullYear();

    if (!titulo.trim() || !ano || !genero.trim() || !nota) {
      setErro('Preencha título, ano, gênero e nota.');
      return;
    }
    if (!Number.isInteger(anoNumero) || anoNumero < 1888 || anoNumero > anoAtual + 5) {
      setErro('Confira o ano.');
      return;
    }
    if (duracao && (!Number.isInteger(duracaoNumero) || duracaoNumero < 1)) {
      setErro('A duração deve ser em minutos, ex.: 120.');
      return;
    }
    if (isNaN(notaNumero) || notaNumero < 0 || notaNumero > 10) {
      setErro('A nota vai de 0 a 10.');
      return;
    }
    // Link do pôster: tem que ser um endereço de imagem (http...), não a imagem colada como texto
    if (poster.trim() && !/^https?:\/\//.test(poster.trim())) {
      setErro('O pôster precisa ser um link que comece com http:// ou https://.');
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      await salvarFilme({
        ...filme, // mantém o id e o favorito quando for edição
        titulo,
        diretor,
        ano: anoNumero,
        genero,
        duracao: duracao ? duracaoNumero : null,
        nota: notaNumero,
        sinopse,
        poster: poster.trim(),
      });
      navigation.goBack();
    } catch (e) {
      setErro(e.message); // mensagem do backend ou de conexão
      setCarregando(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.tela}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={estilos.secao}>Informações</Text>
      <View style={estilos.cartao}>
        <Campo rotulo="Título" value={titulo} onChangeText={setTitulo} placeholder="Obrigatório" />
        <Campo rotulo="Diretor" value={diretor} onChangeText={setDiretor} placeholder="Opcional" />
        <Campo rotulo="Ano" value={ano} onChangeText={setAno} placeholder="Ex.: 2014" keyboardType="number-pad" />
        <Campo rotulo="Gênero" value={genero} onChangeText={setGenero} placeholder="Ex.: Drama" />
        <Campo rotulo="Duração" value={duracao} onChangeText={setDuracao} placeholder="Em minutos" keyboardType="number-pad" />
        <Campo rotulo="Nota" value={nota} onChangeText={setNota} placeholder="De 0 a 10" keyboardType="decimal-pad" ultimo />
      </View>

      <Text style={estilos.secao}>Sinopse</Text>
      <View style={estilos.cartao}>
        <TextInput
          style={[styles.input, styles.sinopse]}
          value={sinopse}
          onChangeText={setSinopse}
          placeholder="Do que se trata o filme?"
          placeholderTextColor={cores.cinza}
          multiline
        />
      </View>

      <Text style={estilos.secao}>Pôster</Text>
      <View style={estilos.cartao}>
        <TextInput
          style={styles.input}
          value={poster}
          onChangeText={setPoster}
          placeholder="Link da imagem (https://...)"
          placeholderTextColor={cores.cinza}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}

      <Botao texto="Salvar" onPress={salvar} carregando={carregando} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  input: {
    fontSize: 17,
    color: cores.texto,
    paddingVertical: 11,
    paddingHorizontal: 16,
    outlineColor: 'transparent', // tira o contorno que o navegador desenha no campo
  },
  sinopse: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
});
