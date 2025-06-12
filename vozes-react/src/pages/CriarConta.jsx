import { Container, Card, Button, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function CriarConta() {
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);

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
            Criar Conta
          </Card.Text>
          <Card.Body>
            <Form className="text-start">
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Nome Completo </Form.Label>
                <Form.Control type="name" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="email" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Senha</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                  <Button
                    className="rounded-end"
                    variant={dark ? "secondary" : "outline-secondary"}
                    onClick={() => setShowSenha((prev) => !prev)}
                    tabIndex={-1}
                  >
                    <i
                      className={`bi ${showSenha ? "bi-eye-slash" : "bi-eye"}`}
                    ></i>
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                <Form.Label>Confirme a Senha</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmaSenha ? "text" : "password"}
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                    isInvalid={confirmaSenha && senha !== confirmaSenha}
                    isValid={confirmaSenha && senha === confirmaSenha}
                  />
                  <Button
                    className="rounded-end"
                    variant={dark ? "secondary" : "outline-secondary"}
                    onClick={() => setShowConfirmaSenha((prev) => !prev)}
                    tabIndex={-1}
                  >
                    <i
                      className={`bi ${
                        showConfirmaSenha ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </Button>
                </InputGroup>
                {confirmaSenha && senha !== confirmaSenha && (
                  <Form.Text className="text-danger">
                    As senhas não coincidem.
                  </Form.Text>
                )}
                {confirmaSenha && senha === confirmaSenha && (
                  <Form.Text className="text-success">
                    Senhas conferem!
                  </Form.Text>
                )}
              </Form.Group>

              <Button variant="primary" type="submit">
                Criar Conta
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default CriarConta;
