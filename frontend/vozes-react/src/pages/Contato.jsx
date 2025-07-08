import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import api from "../services/api"; // Importa nossa instância do Axios
import "../style/Contato.css";

function Contato() {
  // Estado para o tema
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );

  // Estado único para todos os campos do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  // Estados para os alertas de feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handler que atualiza o estado quando o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função que envia os dados para a API ao submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede que a página recarregue
    setError("");
    setSuccess("");

    // Verificação simples para garantir que a mensagem não está vazia
    if (!formData.nome || !formData.email || !formData.mensagem) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Fazendo a chamada POST para o endpoint do backend
      await api.post("/contatos", formData);
      
      setSuccess("Sua mensagem foi enviada com sucesso! Responderemos em breve.");
      
      // Limpa o formulário
      setFormData({ nome: "", email: "", mensagem: "" });

    } catch (err) {
      setError("Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.");
      console.error("Erro ao enviar contato:", err);
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.body.classList.contains("dark-theme"));
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <main
      className={`pt-5 pb-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container style={{ maxWidth: "600px" }}>
        <Card className={`card-contato ${dark ? "bg-secondary text-light" : "bg-white"}`}>
          <Card.Body>
            <Card.Title className="display-5 text-center mb-4">
              Fale Conosco
            </Card.Title>
            <Card.Text className="text-center mb-4">
              Tem dúvidas, sugestões ou precisa de suporte? <br />
              Entre em contato pelos canais abaixo ou envie uma mensagem!
            </Card.Text>
            <div className="mb-4">
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-envelope-fill me-2 fs-4"></i>
                <span className="fs-6">contato@projetovozes.com.br</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-telephone-fill me-2 fs-4"></i>
                <span className="fs-6">(81) 3333-5555</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-facebook me-2 fs-4"></i>
                <a
                  href="https://facebook.com/projetovozes"
                  className="text-reset text-decoration-none fs-6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  facebook.com/projetovozes
                </a>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-instagram me-2 fs-4 "></i>
                <a
                  href="https://instagram.com/projetovozes"
                  className="text-reset text-decoration-none fs-6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  instagram.com/projetovozes
                </a>
              </div>
            </div>
            <hr />
            
            {/* Alertas de Feedback */}
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Formulário Conectado ao Estado do React */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formNomeContato">
                <Form.Label>Seu Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  placeholder="Digite seu nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmailContato">
                <Form.Label>Seu E-mail</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Digite seu e-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMensagemContato">
                <Form.Label>Mensagem</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="mensagem"
                  placeholder="Digite sua mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant={dark ? "light" : "primary"} type="submit">
                  Enviar Mensagem
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default Contato;
