import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import PaginaAdmin from './PaginaAdmin';
import MinhaConta from './MinhaConta';

/**
 * Este componente atua como um "despachante".
 * Ele verifica o papel do usuário logado e renderiza a página de conta apropriada.
 */
function PaginaDaConta() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // A LÓGICA PRINCIPAL:
    // Verifica se o campo 'role' no objeto do usuário é igual à string "ADMIN".
    if (user.role === 'ADMIN') {
        return <PaginaAdmin />;
    } else {
        return <MinhaConta />;
    }
}

export default PaginaDaConta;
