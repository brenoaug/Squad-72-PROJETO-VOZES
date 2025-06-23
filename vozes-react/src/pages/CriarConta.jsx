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
            Seja Voluntário
            {//Criar Conta
            }
          </Card.Text>
          <Card.Body>
            <Form className="text-start">
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Nome e Sobrenome </Form.Label>
                <Form.Control type="name" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@email.com"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Telefone </Form.Label>
                <Form.Control
                  type="tel"
                  id="telefone"
                  name="telefone"
                  placeholder="(99) 99999-9999"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Localização</Form.Label>
                <Form.Control
                  type="text"
                  id="localizacao"
                  name="localização"
                  placeholder="Cidade, ES"
                />
              </Form.Group>

              {/*
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
                
              </Form.Group>*/}
              {/*}
              {confirmaSenha === senha && senha !== "" ? (
                <Button variant="primary" type="submit">
                  Criar Conta
                </Button>
              ) : (
                <Button variant="primary" type="submit" disabled>
                  Criar Conta
                </Button>
              )}*/}
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
