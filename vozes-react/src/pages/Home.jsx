import { Container, Card, Button, Row, Col, CardFooter } from "react-bootstrap";
import { useState, useEffect } from "react";
import lgbtFlag from "../assets/lgbt-flag-circle.svg";
import "./Home.css"
import MarkVozesColorized from "../assets/mark-all-colorized.svg";

function Home() {
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
      className={`home text-center text-lg-start pt-5 pb-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container className="d-flex align-items-center flex-wrap gap-4">
        <Row className="flex-grow-1">
          <Col>
            <Card className={`${dark ? "bg-secondary text-light" : ""} h-100 strong principal card-home`}>
              <Card.Body>
                <Card.Title className=" flex-row">
                  <img
                    src={MarkVozesColorized}
                    alt="Vozes"
                    width="200"
                    className="mb-3 d-block"
                  />
                  <h1 className="display-4 ">
                    Denuncie a violência contra LGBTQIAPN+
                  </h1>
                </Card.Title>
                <Card.Text>
                  <h4>
                    Um espaço seguro e confidencial para denunciar casos de
                    violência e discriminação.
                  </h4>
                  <hr></hr>
                  Sua denúncia pode ajudar a promover mudanças e ampliar a
                  visibilidade dos problemas enfrentados pela comunidade.
                </Card.Text>
                <Button variant={`${dark ? "light" : "dark"}`}>
                  Faça Sua Denúncia
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card className={`card-home ${dark ? "bg-secondary text-light" : ""}`}>
              <Card.Body>
                <Card.Title
                  className="text-center"
                  style={{ fontSize: "24px" }}
                >
                  <i className="bi bi-graph-up-arrow"></i>
                </Card.Title>
                <Card.Text>
                  Em 2022, foram registradas 310 mortes de pessoas LGBTQIAPN+ no
                  Brasil (equivalente a uma morte a cada 28 horas). A
                  distribuição das vítimas foi: 131 pessoas trans (58% do
                  total), 120 gays e lésbicas, e 59 em outras categorias.
                </Card.Text>
              </Card.Body>
              <Card.Footer className="fst-italic bg-transparent">
                Fonte: Grupo Gay da Bahia (GGB).
              </Card.Footer>
            </Card>
          </Col>
          <Col>
            <Card
              className={`${dark ? "bg-secondary text-light" : ""} h-100 card-home`}
            >
              <Card.Body>
                <Card.Title className="text-center">
                  {" "}
                  <img
                    src={lgbtFlag}
                    alt="icone bandeira lgbt circular"
                    width="24"
                    height="24"
                  />
                </Card.Title>
                <Card.Text>
                  Embora os números não diferenciem especificamente entre gays e
                  lésbicas, pesquisas indicam que, de modo geral, 35% das
                  pessoas LGBTQIAPN+ já sofreram discriminação verbal e 24% já
                  foram vítimas de agressões físicas.
                </Card.Text>
              </Card.Body>
              <Card.Footer className="fst-italic bg-transparent">
                Fonte: Instituto DataFolha, 2023
              </Card.Footer>
            </Card>
          </Col>
          <Col>
            <Card className={`${dark ? "bg-secondary text-light" : ""} h-100 card-home`}>
              <Card.Body className="h-100">
                <Card.Title className="text-center">
                  <img
                    src={lgbtFlag}
                    alt="icone bandeira lgbt circular"
                    width="24"
                    height="24"
                  />
                </Card.Title>
                <Card.Text>
                  O Brasil é o país que mais mata pessoas trans no mundo. Em
                  2022, houve 131 assassinatos de pessoas trans, representando
                  um aumento de 11% em relação a 2021.
                </Card.Text>
              </Card.Body>
              <Card.Footer className="fst-italic bg-transparent">
                Fonte: Associação Nacional de Travestis e Transexuais (ANTRA).
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default Home;
