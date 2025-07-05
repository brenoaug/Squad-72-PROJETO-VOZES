import {
  Container,
  Card,

} from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import PeopleFlag from "../assets/people-flag.png";
import { useState, useEffect } from "react";


function MinhaConta() {
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

  const [key, setKey] = useState('home');

  return (
    <main
      className={`text-center text-lg-start pt-5 pb-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container>
        <Card
          className={`${
            dark ? "bg-secondary text-light" : "bg-white"
          } card-sobre`}
        >
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="Meu Perfil" title="Meu Perfil">
              Tab content for Home
            </Tab>
          </Tabs>
        </Card>
      </Container>
    </main>
  );
}

export default MinhaConta;
