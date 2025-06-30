import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import api from "../services/api";

const estadosBrasileiros = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

function VoluntarioCadastro() {
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );

  const [primeiroNome, setPrimeiroNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoProfissional, setTipoProfissional] = useState("ADVOGADO");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const localizacaoConcatenado = `${cidade} - ${estado}`;

    const nome = `${primeiroNome} ${sobrenome}`.trim();

    const dadosDoFormulario = {
      nome: nome,
      email: email,
      telefone: telefone,
      localizacao: localizacaoConcatenado,
      tipoProfissional: tipoProfissional,
    };

    try {
      const response = await api.post("/profissionais", dadosDoFormulario);

      alert(
        `Profissional "${response.data?.nome || nome}" cadastrado com sucesso!`
      );

      setPrimeiroNome("");
      setSobrenome("");
      setEmail("");
      setTelefone("");
      setTipoProfissional("ADVOGADO");
      setCidade("");
      setEstado("");
    } catch (error) {
      console.error("Erro ao cadastrar profissional:", error);
      alert(
        "Ocorreu um erro ao cadastrar. Verifique o console e tente novamente."
      );
    }
  };

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
        <Card
          className={`formulario text-center text-lg-start pt-5 pb-5 ${
            dark ? "bg-secondary text-light" : "bg-light text-dark"
          }`}
        >
          <Card.Text className="display-5 text-center mb-4">
            Seja Voluntário
          </Card.Text>
          <Card.Body>
            <Form className="text-start" onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPrimeiroNome">
                  <Form.Label>Primeiro Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Seu primeiro nome"
                    value={primeiroNome}
                    onChange={(e) => setPrimeiroNome(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridSobrenome">
                  <Form.Label>Sobrenome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Seu sobrenome"
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                    required
                  />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  placeholder="email@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Telefone </Form.Label>
                <Form.Control
                  type="tel"
                  id="telefone"
                  name="telefone"
                  placeholder="(99) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCidade">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: São Paulo"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridEstado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                    aria-label="Selecione o Estado"
                  >
                    <option value="" disabled>
                      Selecione o Estado
                    </option>
                    {estadosBrasileiros.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Profissional:</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    id="tipo-advogado"
                    label="Advogado(a)"
                    name="tipoProfissionalGroup"
                    value="ADVOGADO"
                    checked={tipoProfissional === "ADVOGADO"}
                    onChange={(e) => setTipoProfissional(e.target.value)}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    id="tipo-psicologo"
                    label="Psicólogo(a)"
                    name="tipoProfissionalGroup"
                    value="PSICOLOGO"
                    checked={tipoProfissional === "PSICOLOGO"}
                    onChange={(e) => setTipoProfissional(e.target.value)}
                    radio
                  />
                </div>
              </Form.Group>
              <Button variant="primary" type="submit">
                Quero ser Voluntário
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default VoluntarioCadastro;
