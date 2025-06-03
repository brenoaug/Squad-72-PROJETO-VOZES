import { Container, Card, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

function Contato() {
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
        <Card className={`${dark ? "bg-secondary text-light" : "bg-white"}`}>
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
            <form>
              <div className="mb-3">
                <label htmlFor="nome" className="form-label">
                  Seu Nome
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nome"
                  placeholder="Digite seu nome"
                />
              </div>
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
                <label htmlFor="mensagem" className="form-label">
                  Mensagem
                </label>
                <textarea
                  className="form-control"
                  id="mensagem"
                  rows={5}
                  placeholder="Digite sua mensagem"
                ></textarea>
              </div>
              <div className="d-flex justify-content-end">
                <Button variant={dark ? "light" : "primary"} type="submit">
                  Enviar Mensagem
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default Contato;
