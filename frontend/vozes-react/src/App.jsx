import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
          <Route path="/minha-conta" element={<MinhaConta />} />
          <Route path="/suporte-acompanhamento" element={<Profissionais />} />
        </Routes>
        <ButtonUpLight />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
