import { Container, Card, Button, Form, InputGroup } from "react-bootstrap";

import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

function CriarConta() {
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );

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
        <Card className={`formulario text-center text-lg-start pt-5 pb-5 ${
        dark ? "bg-secondary text-light" : "bg-light text-dark"
      }`}><Card.Text className="display-5 text-center mb-4">
            Criar Conta
          </Card.Text>
          <Card.Body>
            <Form className="text-start">
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Desejo Manter Anonimato"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Seu Nome </Form.Label>
                <Form.Control
                  type="name"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Seu E-mail</Form.Label>
                <Form.Control
                  type="email"
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

export default CriarConta;
