import React from "react";
import { Card, Button, Container, Row, Col, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import psicologo from "../assets/psi.jpg";
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
    api.get('api/profissionais')
      .then(response => {
        console.log('Dados recebidos:', response.data);
        setProfissionais(response.data);
      })
      .catch(error => console.error('Erro na requisição:', error));
  }, []);

  return (
    <main
      className={`text-center text-lg-start pt-5 pb-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container className="align-items-center p-0">
        <Card
          className={`container-profissionais d-flex flex-row flex-wrap gap-3 p-5 ${
            dark ? "bg-secondary text-light" : "bg-light text-dark"
          }`}
        >
          {profissionais.map(profissional => (
          <Card
            className={`card-profissionais text-start p-0 col-12 col-md-4 gap-1 ${
              dark ? "bg-secondary text-light" : "bg-light text-dark"
            }`}
          >
            <Card.Img
              variant="top"
              src={psicologo}
              alt="Psicologo"
              style={{}}
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
              Profissão
            </Badge>
            <Card.Body>
              <Card.Title>{profissional.nome}</Card.Title>
              <Card.Text>
                <i class="bi bi-geo-alt-fill"></i>
                {profissional.localizacao}
              </Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
          ))}
        </Card>
      </Container>
    </main>
  );
}

export default Profissionais;
