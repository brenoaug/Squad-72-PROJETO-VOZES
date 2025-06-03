import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Denunciar from "./pages/Denunciar";
import Contato from "./pages/Contato";
import ButtonUpLight from "./components/Button/ButtonUpLight";
import Sobre from "./pages/Sobre";

function App() {
  return (
    <>
      <Header />
      <Home />
      <ButtonUpLight />
      <Footer />
    </>
  );
}

export default App;
