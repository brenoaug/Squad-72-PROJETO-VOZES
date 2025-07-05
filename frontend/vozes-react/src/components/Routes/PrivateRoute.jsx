// src/components/Routes/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function PrivateRoute() {
  // Pega a informação do nosso contexto global
  const { isAuthenticated, loading } = useAuth();

  // Se ainda estivermos verificando se o usuário está logado (carregando do localStorage),
  // podemos mostrar uma mensagem de "Carregando..."
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para a página de login.
  // O 'replace' evita que o usuário possa voltar para a página protegida no histórico do navegador.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza o componente filho (a página que ele tentou acessar).
  // O <Outlet /> é um placeholder do React Router para a página solicitada.
  return <Outlet />;
}

export default PrivateRoute;