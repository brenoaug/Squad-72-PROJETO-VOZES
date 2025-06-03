import {
  Container,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  CardText,
  CardImg,
} from "react-bootstrap";
import PeopleFlag from "../assets/people-flag.png";
import { useState, useEffect } from "react";

function Sobre() {
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
      <Container>
        <Card className={`${dark ? "bg-secondary text-light" : "bg-white"}`}>
          <CardBody>
            <CardTitle className="display-5 text-start mb-4">
              Sobre o Projeto
            </CardTitle>
            <CardText>
              Bem-vindo ao <strong>VOZES</strong>, um espaço dedicado a combater
              a violência contra a comunidade LGBTQIA+. Aqui, acreditamos que
              toda voz importa e que, juntos, podemos construir um mundo mais
              seguro, justo e inclusivo para todas as pessoas, independentemente
              de sua orientação sexual, identidade de gênero ou expressão.
            </CardText>
            <CardText>
              Nossa plataforma foi criada para ser um canal seguro e confiável
              onde vítimas, testemunhas e aliados podem denunciar casos de
              violência, discriminação e abuso contra pessoas LGBTQIA+. Sabemos
              que muitas vezes essas vozes são silenciadas, mas no{" "}
              <strong>VOZES</strong>, elas encontram eco.{" "}
            </CardText>
            <CardText>
              No <strong>VOZES</strong>, acreditamos que a união faz a força.
              Cada denúncia, cada história compartilhada, é um passo em direção
              a um futuro onde o respeito e a diversidade prevaleçam. Seja parte
              dessa mudança. Sua voz pode salvar vidas.{" "}
            </CardText>
            <CardText>
              Junte-se a nós. Porque aqui, todas as vozes têm poder.{" "}
            </CardText>
            <Card.Img
              alt="3 pessoas levantando a bandeira LGBT"
              variant="bottom"
              src={PeopleFlag}
            />
          </CardBody>
        </Card>
        <CardFooter className="text-center mt-3">
          <strong>VOZES</strong> – Por um mundo sem violência, com orgulho e
          respeito. 🏳️‍🌈{" "}
        </CardFooter>
      </Container>
    </main>
  );
}

export default Sobre;
