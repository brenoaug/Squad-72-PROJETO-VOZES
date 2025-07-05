import {
  Container,
  Card,
  Button,
  Form,
  Row,
  Col,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import api from "../services/api";
import { IMaskInput } from "react-imask";
import { Link } from "react-router-dom";

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

function CriarConta() {
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [primeiroNome, setPrimeiroNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmaSenha, setShowConfirmaSenha] = useState(false);
  const [tipoProfissional, setTipoProfissional] = useState(null);
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState(estadosBrasileiros[0]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const localizacaoConcatenado = `${cidade} - ${estado}`;

    const nome = `${primeiroNome} ${sobrenome}`.trim();

    const telefoneReformulado = telefone.replace(/\D/g, "");

    const dadosDoFormulario = {
      nome: nome,
      email: email,
      telefone: telefoneReformulado,
      localizacao: localizacaoConcatenado,
      tipoProfissional: tipoProfissional,
    };

    try {
      await api.post("/profissionais", dadosDoFormulario);

      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 10000);

      setPrimeiroNome("");
      setSobrenome("");
      setEmail("");
      setTelefone("");
      setTipoProfissional("");
      setCidade("");
      setEstado(estadosBrasileiros[0]);
    } catch (error) {
      console.error("Erro ao cadastrar profissional:", error);

      const message =
        error.response?.data?.message ||
        "Ocorreu um erro ao cadastrar. Tente novamente mais tarde.";

      setErrorMessage(message);
      setShowErrorAlert(true);
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
            Crie Sua Conta
          </Card.Text>

          {showSuccessAlert && (
            <Alert
              variant="success"
              onClose={() => setShowSuccessAlert(false)}
              dismissible
            >
              <Alert.Heading>Cadastro realizado com sucesso!</Alert.Heading>
              <p>
                A equipe Vozes agradece por se cadastrar.
              </p>
            </Alert>
          )}
          {showErrorAlert && (
            <Alert
              variant="danger"
              onClose={() => setShowErrorAlert(false)}
              dismissible
            >
              <Alert.Heading>Erro no Cadastro!</Alert.Heading>
              <p>{errorMessage} </p>
            </Alert>
          )}
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
                  name="email"
                  placeholder="email@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  as={IMaskInput}
                  mask="(00) 00000-0000"
                  value={telefone}
                  onAccept={(value) => setTelefone(value)}
                  placeholder="(99) 99999-9999"
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
                    {estadosBrasileiros.map((uf, idx) => (
                      <option key={uf + "-" + idx} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Row>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Senha</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                  <Button
                    className="rounded-end"
                    variant={dark ? "secondary" : "outline-secondary"}
                    onClick={() => setShowSenha((prev) => !prev)}
                    tabIndex={-1}
                  >
                    <i
                      className={`bi ${showSenha ? "bi-eye-slash" : "bi-eye"}`}
                    ></i>
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                <Form.Label>Confirme a Senha</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmaSenha ? "text" : "password"}
                    value={confirmaSenha}
                    onChange={(e) => setConfirmaSenha(e.target.value)}
                    isInvalid={confirmaSenha && senha !== confirmaSenha}
                    isValid={confirmaSenha && senha === confirmaSenha}
                  />
                  <Button
                    className="rounded-end"
                    variant={dark ? "secondary" : "outline-secondary"}
                    onClick={() => setShowConfirmaSenha((prev) => !prev)}
                    tabIndex={-1}
                  >
                    <i
                      className={`bi ${
                        showConfirmaSenha ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </Button>
                </InputGroup>
                {confirmaSenha && senha !== confirmaSenha && (
                  <Form.Text className="text-danger">
                    As senhas não coincidem.
                  </Form.Text>
                )}
                {confirmaSenha && senha === confirmaSenha && (
                  <Form.Text className="text-success">
                    Senhas conferem!
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formVoluntarioCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Sou um Advogado(a) ou Psicólogo(a) e quero me cadastrar como voluntário(a)"
                  checked={tipoProfissional !== ""}
                  onChange={(e) =>
                    setTipoProfissional(e.target.checked ? "ADVOGADO" : "")
                  }
                />
              </Form.Group>

              {tipoProfissional !== "" && (
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
                      onChange={() => setTipoProfissional("ADVOGADO")}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="tipo-psicologo"
                      label="Psicólogo(a)"
                      name="tipoProfissionalGroup"
                      value="PSICOLOGO"
                      checked={tipoProfissional === "PSICOLOGO"}
                      onChange={() => setTipoProfissional("PSICOLOGO")}
                    />
                  </div>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Container className="d-flex justify-content-center p-1 gap-2">
                  {confirmaSenha === senha && senha !== "" ? (
                    <Button variant="primary" type="submit">
                      Criar Conta
                    </Button>
                  ) : (
                    <Button variant="primary" type="submit" disabled>
                      Criar Conta
                    </Button>
                  )}

                  <Link to="/login" className={`btn btn-secondary`}>
                    Já Tenho Uma Conta
                  </Link>
                </Container>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default CriarConta;
