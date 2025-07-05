import { Card, Container, Badge, Row, Col, Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import psicologo from "../assets/psi.jpg";
import advogado from "../assets/adv.jpg";
import "../style/Profissionais.css";
import api from "../services/api";
import { Link } from "react-router-dom";

function Profissionais() {
  const [profissionais, setProfissionais] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
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
      .get(`/usuarios/profissionais?page=${paginaAtual}&size=9`)
      .then((response) => {
        setProfissionais(response.data.content);
        setTotalPaginas(response.data.totalPages);
      })
      .catch((error) => console.error("Erro na requisição:", error));
  }, [paginaAtual]); // Roda novamente sempre que a 'paginaAtual' mudar

  const handlePageChange = (pageNumber) => {
    setPaginaAtual(pageNumber);
  };

  return (
    <main
      className={`text-center text-lg-start pt-5 pb-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container className="align-items-center p-0" data-bs-theme={dark ? "dark" : "light"}>
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
            <Card.Text className="text-start mb-4">
              Se você é um profissional ou voluntário e deseja se cadastrar para
              ajudar,{" "}
              <Link to="/criar-conta" className="text-decoration-none">
                clique aqui
              </Link>
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
          <Row className="w-100 justify-content-center mt-4">
            <Col xs="auto">
              <Pagination>
                <Pagination.First onClick={() => handlePageChange(0)} disabled={paginaAtual === 0} />
                <Pagination.Prev onClick={() => handlePageChange(paginaAtual - 1)} disabled={paginaAtual === 0} />
                
                {/* Lógica para mostrar os números de página */}
                {[...Array(totalPaginas).keys()].map(page => (
                  <Pagination.Item 
                    key={page} 
                    active={page === paginaAtual}
                    onClick={() => handlePageChange(page)}
                  >
                    {page + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => handlePageChange(paginaAtual + 1)} disabled={paginaAtual >= totalPaginas - 1} />
                <Pagination.Last onClick={() => handlePageChange(totalPaginas - 1)} disabled={paginaAtual >= totalPaginas - 1} />
              </Pagination>
            </Col>
          </Row>
        </Card>
      </Container>
    </main>
  );
}

export default Profissionais;
