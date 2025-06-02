import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  CardFooter,
  InputGroup,
} from "react-bootstrap";

import { useState, useEffect } from "react";

function Denunciar() {
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );
  const [anonimo, setAnonimo] = useState(false);

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
        <Card className={`text-center text-lg-start pt-5 pb-5 ${
        dark ? "bg-secondary text-light" : "bg-light text-dark"
      }`}>
          <Card.Text className="h1 text-center">
            Formulário de Denúncia
          </Card.Text>
          <Card.Body>
            <Form className="text-start">
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Desejo Manter Anonimato"
                  checked={anonimo}
                  onChange={(e) => setAnonimo(e.target.checked)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Seu Nome </Form.Label>
                <Form.Control
                  type="name"
                  placeholder={anonimo ? "Denúncia Anônima" : "Digite Seu Nome"}
                  disabled={anonimo}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Seu E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={
                    anonimo ? "Denúncia Anônima" : "Digite Seu Email"
                  }
                  disabled={anonimo}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Data do Incidente</Form.Label>
                <Form.Control
                  className="mb-3"
                  type="date"
                  id="data"
                  name="data"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Local do Incidente</Form.Label>
                <Form.Control
                  type="local"
                  placeholder="Nome da Rua, Bairro, Cidade, Estado, etc"
                  className="mb-3"
                />
              </Form.Group>

              <InputGroup className="mb-3">
                <InputGroup.Text>Descreva o Incidente</InputGroup.Text>
                <Form.Control
                  as="textarea"
                  aria-label="With textarea"
                  aria-label="Large"
                  aria-describedby="inputGroup-sizing-sm"
                />
              </InputGroup>

              <Form.Group className="mb-3" controlId="formFile">
                <Form.Label>Anexar Arquivo (opcional)</Form.Label>
                <Form.Control type="file" />
              </Form.Group>

              <Button variant="primary" type="Enviar Denuncia">
                Enviar Denúncia
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default Denunciar;
