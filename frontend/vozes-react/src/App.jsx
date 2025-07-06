import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/Routes/PrivateRoute"; 
// Importando o PrivateRoute para proteger as rotas que precisam de autenticação

// Importando as páginas e componentes necessários
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Denunciar from "./pages/Denunciar";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import Sobre from "./pages/Sobre";
import Footer from "./components/Footer/Footer";
import ButtonUpLight from "./components/Button/ButtonUpLight";
import "./App.css";
import CriarConta from "./pages/CriarConta";
import MinhaConta from "./pages/MinhaConta";
import Profissionais from "./pages/Profissionais";
import PaginaAdmin from "./pages/PaginaAdmin";
import PaginaDaConta from "./pages/PaginaDaConta"; // Importando a página de conta do usuário

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/denunciar" element={<Denunciar />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="/criar-conta" element={<CriarConta />} />
          <Route path="/suporte-acompanhamento" element={<Profissionais />} />
          <Route path="/conta-admin" element={<PaginaAdmin />} />
          <Route element={<PrivateRoute />}>
            {/* Protegendo as rotas que precisam de autenticação */}
            {/* Protegendo a rota de minha conta, substituindo MinhaConta por PaginaDaConta */}
            {/* <Route path="/minha-conta" element={<MinhaConta />} /> */}
            <Route path="/minha-conta" element={<PaginaDaConta />} />
          </Route>
        </Routes>
        <ButtonUpLight />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
