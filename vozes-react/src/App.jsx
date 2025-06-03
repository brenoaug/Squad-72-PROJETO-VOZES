import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Denunciar from "./pages/Denunciar";
import Contato from "./pages/Contato";
import ButtonUpLight from "./components/Button/ButtonUpLight";

function App() {
  return (
    <>
      <Header />
      <Contato />
      <ButtonUpLight />
      <Footer />
    </>
  );
}

export default App;
