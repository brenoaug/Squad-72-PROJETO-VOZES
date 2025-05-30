import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";
import markDark from "../assets/mark-all-dark.svg";
import markLight from "../assets/mark-all-light.svg";

export default function Footer() {
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
    <footer
      className={`text-center text-lg-start border-top mt-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <section>
        <Container className="text-start text-md-start mt-6">
          <Row className="mt-3">
            <Col md={3} lg={4} xl={3} className="mx-start mb-4">
              <a href="#">
                <img
                  src={dark ? markLight : markDark}
                  alt="Marca do Projeto Vozes"
                  width="100"
                  height="100"
                />
              </a>
              <p>
                Seu relato pode ajudar a promover mudanças reais e trazer
                visibilidade para os desafios enfrentados pela comunidade
                LGBTQIAPN+.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Siga-nos nas Redes:</span>
        </div>
        <div>
          <a href="#" className="me-4 text-reset">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="#" className="me-4 text-reset">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="#" className="me-4 text-reset">
            <i className="bi bi-google"></i>
          </a>
          <a href="#" className="me-4 text-reset">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="#" className="me-4 text-reset">
            <i className="bi bi-linkedin"></i>
          </a>
          <a href="#" className="me-4 text-reset">
            <i className="bi bi-github"></i>
          </a>
        </div>
      </section>

      <div
        className={`text-center p-4 ${dark ? "bg-secondary text-light" : ""}`}
        style={{ backgroundColor: dark ? undefined : "rgba(0, 0, 0, 0.05)" }}
      >
        © 2025 {" "}
        <a className="text-reset fw-bold" href="#">
          Vozes
        </a>
      </div>
    </footer>
  );
}
