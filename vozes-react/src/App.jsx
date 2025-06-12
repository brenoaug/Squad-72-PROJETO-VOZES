import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Denunciar from "./pages/Denunciar";
import Contato from "./pages/Contato";
import Login from "./pages/Login"
import Sobre from "./pages/Sobre";
import Footer from "./components/Footer/Footer";
import ButtonUpLight from "./components/Button/ButtonUpLight";
import "./App.css";
import CriarConta from "./pages/CriarConta";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/denunciar" element={<Denunciar />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/login" element={<Login />} />
        <Route path="/criarconta" element={<CriarConta />} />
      </Routes>
      <ButtonUpLight />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
