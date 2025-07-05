// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// Cria o Contexto
const AuthContext = createContext({});

// Cria o componente Provedor
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect para carregar o token do localStorage quando a aplicação inicia
  useEffect(() => {
    async function carregarDadosArmazenados() {
      const tokenArmazenado = localStorage.getItem('@Vozes:token');
      const usuarioArmazenado = localStorage.getItem('@Vozes:user');

      if (tokenArmazenado && usuarioArmazenado) {
        setToken(tokenArmazenado);
        // Adiciona o token ao cabeçalho de todas as requisições do Axios
        api.defaults.headers.Authorization = `Bearer ${tokenArmazenado}`;
        setUser(JSON.parse(usuarioArmazenado));
      }
      setLoading(false);
    }
    carregarDadosArmazenados();
  }, []);

  async function login(email, senha) {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token: tokenRecebido, usuario: usuarioRecebido } = response.data; // Supondo que a API retorne o token e o usuário

      // Armazena no localStorage para persistir a sessão
      localStorage.setItem('@Vozes:token', tokenRecebido);
      localStorage.setItem('@Vozes:user', JSON.stringify(usuarioRecebido));

      // Adiciona o token ao cabeçalho do Axios para futuras requisições
      api.defaults.headers.Authorization = `Bearer ${tokenRecebido}`;

      // Atualiza os estados
      setToken(tokenRecebido);
      setUser(usuarioRecebido);

    } catch (error) {
      console.error("Erro no login:", error);
      throw new Error("Email ou senha inválidos.");
    }
  }

    async function registrar(dadosDoFormulario) {
    try {
      
      await api.post('/auth/registrar/comum', dadosDoFormulario);
      // Você pode adicionar lógicas aqui, como fazer login automaticamente após o registro
    } catch (error) {
      console.error("Erro no registro:", error);
      // Pega a mensagem de erro do back-end, se houver
      throw new Error(error.response?.data || "Não foi possível criar a conta.");
    }
  }

  function logout() {
    // Limpa o localStorage
    localStorage.removeItem('@Vozes:token');
    localStorage.removeItem('@Vozes:user');
    // Limpa os estados
    setUser(null);
    setToken(null);
  }

  // O valor do Provedor que será disponibilizado para os componentes filhos
  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, token, loading, login, logout, registrar }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}