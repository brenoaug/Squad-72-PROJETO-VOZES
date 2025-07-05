import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function carregarDadosArmazenados() {
      const tokenArmazenado = localStorage.getItem('@Vozes:token');
      const usuarioArmazenado = localStorage.getItem('@Vozes:user');

      if (tokenArmazenado && usuarioArmazenado) {
        // Bloco de segurança para evitar o erro de JSON.parse
        try {
          const usuarioObjeto = JSON.parse(usuarioArmazenado);
          setToken(tokenArmazenado);
          api.defaults.headers.Authorization = `Bearer ${tokenArmazenado}`;
          setUser(usuarioObjeto);
        } catch (error) {
          console.error("Falha ao parsear dados do usuário do localStorage", error);
          // Se os dados estiverem corrompidos, limpa tudo
          logout();
        }
      }
      setLoading(false);
    }
    carregarDadosArmazenados();
  }, []);

  async function login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });

    // Agora desestruturamos o token e o usuário da resposta
    const { token: tokenRecebido, usuario: usuarioRecebido } = response.data;

    localStorage.setItem('@Vozes:token', tokenRecebido);
    localStorage.setItem('@Vozes:user', JSON.stringify(usuarioRecebido));

    api.defaults.headers.Authorization = `Bearer ${tokenRecebido}`;

    setToken(tokenRecebido);
    setUser(usuarioRecebido);
  }

  function logout() {
    localStorage.removeItem('@Vozes:token');
    localStorage.removeItem('@Vozes:user');
    setUser(null);
    setToken(null);
  }

  // updateUser continua igual
  function updateUser(updatedUserData) {
    setUser(updatedUserData);
    localStorage.setItem('@Vozes:user', JSON.stringify(updatedUserData));
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}