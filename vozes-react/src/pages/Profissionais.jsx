import { Card, Button, Container, Badge, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import psicologo from "../assets/psi.jpg";
import advogado from "../assets/adv.jpg";
import "../style/Profissionais.css";
import api from "../services/api";

function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);
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

  useEffect(() => {
    api
      .get("api/profissionais")
      .then((response) => {
        console.log("Dados recebidos:", response.data);
        setProfissionais(response.data);
      })
      .catch((error) => console.error("Erro na requisição:", error));
  }, []);

  return (
    <main
      className={`text-center text-lg-start pt-5 pb-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container className="align-items-center p-0">
        <Card
          className={`container-profissionais d-flex flex-row flex-wrap gap-3 p-5 align-center ${
            dark ? "bg-secondary text-light" : "bg-light text-dark"
          }`}
        >
          <Row className="w-100 align-items-center justify-content-center mb-4">
            <Card.Title className="text-center mb-4 display-4">
              Suporte & Acompanhamento
            </Card.Title>
            <Card.Text className="text-start mb-4">
              Conheça os profissionais e voluntários que podem te ajudar a
              superar este momento difícil. Eles estão aqui para oferecer
              orientação jurídica e suporte emocional, garantindo que seus
              direitos sejam respeitados e que você encontre a força necessária
              para seguir em frente. Não se cale. Sua voz importa e sua
              segurança é nossa prioridade.
            </Card.Text>
          </Row>
          <Row className="g-3">
            {profissionais.map((profissional) => (
              <Col key={profissional.id} xs={12} md={4}>
                <Card
                  className={`card-profissionais text-start p-0 ${
                    dark ? "bg-secondary text-light" : "bg-light text-dark"
                  }`}
                  style={{ position: "relative" }}
                >
                  <Card.Img
                    variant="top"
                    src={
                      profissional.tipoProfissional === "PSICOLOGO"
                        ? psicologo
                        : advogado
                    }
                  />
                  <Badge
                    className="badge-profissionais"
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      zIndex: 1,
                    }}
                  >
                    {profissional.tipoProfissional}
                  </Badge>
                  <Card.Body>
                    <Card.Title>{profissional.nome}</Card.Title>
                    <Card.Text className="gap-2">
                      <i className="bi bi-geo-alt-fill"></i>
                      {profissional.localizacao}
                      <br />
                      <i className="bi bi-telephone-fill"></i>
                      {profissional.telefone}
                      <br />
                      <i className="bi bi-envelope-fill"></i>
                      {profissional.email}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Container>
    </main>
  );
}

export default Profissionais;
