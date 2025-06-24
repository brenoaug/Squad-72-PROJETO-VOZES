import { Container, Card, Button, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

function CriarConta() {
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [localizacao, setlocalizacao] = useState("");
  const [tipoProfissional, setTipoProfissional] = useState("ADVOGADO");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dadosDoFormulario = {
      nome: nome,
      email: email,
      telefone: telefone,
      localizacao: localizacao,
      tipoProfissional: tipoProfissional,
    };

    try {
      const response = await api.post("/profissionais", dadosDoFormulario);

      alert(
        `Profissional "${response.data?.nome || nome}" cadastrado com sucesso!`
      );

      setNome("");
      setEmail("");
      setTelefone("");
      setlocalizacao("");
      setTipoProfissional("ADVOGADO");
    } catch (error) {
      console.error("Erro ao cadastrar profissional:", error);
      alert(
        "Ocorreu um erro ao cadastrar. Verifique o console e tente novamente."
      );
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
      className={`text-center text-lg-start pt-5 pb-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container>
        <Card
          className={`formulario text-center text-lg-start pt-5 pb-5 ${
            dark ? "bg-secondary text-light" : "bg-light text-dark"
          }`}
        >
          <Card.Text className="display-5 text-center mb-4">
            Seja Voluntário
          </Card.Text>
          <Card.Body>
            <Form className="text-start" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Nome e Sobrenome </Form.Label>
                <Form.Control
                  type="name"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Telefone </Form.Label>
                <Form.Control
                  type="tel"
                  id="telefone"
                  name="telefone"
                  placeholder="(99) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Localização</Form.Label>
                <Form.Control
                  type="text"
                  id="localizacao"
                  name="localização"
                  placeholder="Cidade, ES"
                  value={localizacao}
                  onChange={(e) => setlocalizacao(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Profissional:</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    id="tipo-advogado"
                    label="Advogado(a)"
                    name="tipoProfissionalGroup" 
                    value="ADVOGADO"
                    checked={tipoProfissional === "ADVOGADO"} 
                    onChange={(e) => setTipoProfissional(e.target.value)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    id="tipo-psicologo"
                    label="Psicólogo(a)"
                    name="tipoProfissionalGroup" 
                    value="PSICOLOGO"
                    checked={tipoProfissional === "PSICOLOGO"} 
                    onChange={(e) => setTipoProfissional(e.target.value)} radio
                  />
                </div>
              </Form.Group>
              <Button variant="primary" type="submit">
                Quero ser Voluntário
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default CriarConta;
