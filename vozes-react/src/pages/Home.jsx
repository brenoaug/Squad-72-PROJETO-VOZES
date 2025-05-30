import { Container, Card, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import lgbtFlag from "../assets/lgbt-flag-circle.svg";
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
      className={`text-center text-lg-start pt-5 pb-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container className="d-flex align-items-center flex-wrap gap-4">
        <Card style={{ width: "68.75rem" }}>
          <Card.Body>
            <Container className="d-flex flex-collumn flex-wrap">
              <img src={MarkVozesColorized} alt="Vozes" width="300" />
              <Card.Title
                className="text-start"
                style={{ fontSize: "4.25rem" }}
              >
                : Denuncie a violência contra LGBTQIAPN+
              </Card.Title>
            </Container>
            <Card.Text>
              Em 2022, foram registradas 310 mortes de pessoas LGBTQIAPN+ no
              Brasil (equivalente a uma morte a cada 28 horas). A distribuição
              das vítimas foi: 131 pessoas trans (58% do total), 120 gays e
              lésbicas, e 59 em outras categorias.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card style={{ width: "22rem" }}>
          <Card.Body>
            <Card.Title className="text-center" style={{ fontSize: "24px" }}>
              <i className="bi bi-graph-up-arrow"></i>
            </Card.Title>
            <Card.Text>
              Em 2022, foram registradas 310 mortes de pessoas LGBTQIAPN+ no
              Brasil (equivalente a uma morte a cada 28 horas). A distribuição
              das vítimas foi: 131 pessoas trans (58% do total), 120 gays e
              lésbicas, e 59 em outras categorias.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card style={{ width: "22rem" }}>
          <Card.Body>
            <Card.Title className="text-center">
              {" "}
              <img src={lgbtFlag} alt="lgbt" width="24" height="24" />
            </Card.Title>
            <Card.Text>
              Embora os números não diferenciem especificamente entre gays e
              lésbicas, pesquisas indicam que, de modo geral, 35% das pessoas
              LGBTQIAPN+ já sofreram discriminação verbal e 24% já foram vítimas
              de agressões físicas.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card style={{ width: "22rem" }}>
          <Card.Body>
            <Card.Title className="text-center">
              <span
                style={{ fontSize: "24px" }}
                role="img"
                aria-label="Transgender Flag"
              >
                🏳️‍⚧️
              </span>
            </Card.Title>
            <Card.Text>
              O Brasil é o país que mais mata pessoas trans no mundo. Em 2022,
              houve 131 assassinatos de pessoas trans, representando um aumento
              de 11% em relação a 2021.
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default Home;
