import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from './src/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import FilmesScreen from './src/screens/FilmesScreen';
import BuscarScreen from './src/screens/BuscarScreen';
import FavoritosScreen from './src/screens/FavoritosScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';
import FormularioScreen from './src/screens/FormularioScreen';
import { cores } from './src/cores';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Cores do iOS aplicadas na navegação (cabeçalhos e barra de abas)
const tema = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: cores.azul,
    background: cores.fundo,
    card: cores.fundo,
    text: cores.texto,
    border: cores.separador,
  },
};

// Ícone de cada aba
const icones = {
  Filmes: 'film',
  Buscar: 'search',
  Favoritos: 'heart',
  Perfil: 'person-circle',
};

// As 4 abas da parte de baixo: Filmes, Buscar, Favoritos e Perfil
function Abas() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'left',
        headerTitleStyle: styles.tituloGrande, // título grande, como no iOS
        headerShadowVisible: false,
        tabBarStyle: styles.barraAbas,
        tabBarActiveTintColor: cores.azul,
        tabBarInactiveTintColor: cores.cinza,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? icones[route.name] : icones[route.name] + '-outline'}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Filmes"
        component={FilmesScreen}
        options={({ navigation }) => ({
          // Botão "+" no canto para cadastrar um filme
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Formulario')} style={styles.botaoMais}>
              <Ionicons name="add-circle" size={32} color={cores.azul} />
            </Pressable>
          ),
        })}
      />
      <Tab.Screen name="Buscar" component={BuscarScreen} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

// Escolhe as telas conforme o estado global: sem usuário, Login e Cadastro; com usuário, o catálogo.
// Quando o usuário entra ou sai, o React Navigation troca de telas sozinho.
function Rotas() {
  const { usuario, carregando } = useAuth();

  // Enquanto lê a sessão salva no AsyncStorage, mostra só a rodinha
  if (carregando) {
    return <ActivityIndicator style={styles.carregando} size="large" />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: cores.azul,
        headerTitleStyle: { color: cores.texto },
        headerShadowVisible: false,
        headerBackTitle: 'Voltar',
        animation: 'slide_from_right', // transição: a nova tela entra pela direita
      }}
    >
      {usuario ? (
        <>
          <Stack.Screen name="Abas" component={Abas} options={{ headerShown: false }} />
          <Stack.Screen name="Detalhes" component={DetalhesScreen} />
          <Stack.Screen
            name="Formulario"
            component={FormularioScreen}
            options={({ route, navigation }) => ({
              title: route.params?.filme ? 'Editar filme' : 'Novo filme',
              presentation: 'modal', // transição: abre de baixo para cima
              animation: 'slide_from_bottom',
              headerLeft: () => (
                // No celular a barra já tem margem; no navegador colocamos uma
                <Pressable onPress={() => navigation.goBack()} style={Platform.OS === 'web' && styles.margemWeb}>
                  <Text style={styles.cancelar}>Cancelar</Text>
                </Pressable>
              ),
            })}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Criar conta' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <View style={styles.fundo}>
      <View style={styles.app}>
        {/* AuthProvider em volta de tudo: todas as telas enxergam o usuário logado */}
        <AuthProvider>
          <NavigationContainer theme={tema}>
            <StatusBar style="dark" />
            <Rotas />
          </NavigationContainer>
        </AuthProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // No computador o app fica centralizado, com no máximo 700px de largura
  fundo: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  app: {
    flex: 1,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  carregando: {
    flex: 1,
  },
  tituloGrande: {
    fontSize: 34,
    fontWeight: 'bold',
    color: cores.texto,
  },
  botaoMais: {
    marginRight: 16,
  },
  barraAbas: {
    backgroundColor: cores.branco,
  },
  cancelar: {
    fontSize: 17,
    color: cores.azul,
  },
  margemWeb: {
    marginLeft: 16,
  },
});
