import { Container, Card, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Login() {
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
      className={`pt-5 pb-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container style={{ maxWidth: "600px" }}>
        <Card
          className={`card-contato ${
            dark ? "bg-secondary text-light" : "bg-white"
          }`}
        >
          <Card.Body>
            <Card.Title className="display-5 text-center mb-1">
              <i className="icone-login bi bi-person-circle mb-1"></i>
            </Card.Title>
            <Card.Title className="display-5 text-center mb-4">
              Login
            </Card.Title>
            <Card.Text className="text-center mb-4">
              Entre na sua Conta
            </Card.Text>
            <Form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Seu E-mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Digite seu e-mail"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Digite sua senha"
                />
              </div>
              <div className="d-flex justify-content-center p-1 gap-2">
                <Button variant={dark ? "light" : "secondary"} as={Link} to="/criarconta">
                  Criar
                </Button>
                <Button variant={dark ? "light" : "primary"} type="submit">
                  Entrar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default Login;
