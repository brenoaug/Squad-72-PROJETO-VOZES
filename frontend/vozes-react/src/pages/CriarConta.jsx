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
import { useNavigate, Link } from "react-router-dom";
import { IMaskInput } from "react-imask";
import api from "../services/api";

// Array com os estados brasileiros para o nosso select
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
  // --- ESTADOS (STATES) ---

  // Estado para controlar o tema escuro/claro
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );

  // Estado único para gerenciar todos os dados do formulário
  const [formData, setFormData] = useState({
    primeiroNome: "",
    sobrenome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    telefone: "",
    cidade: "",
    estado: "", // Começa vazio para o placeholder "Selecione o Estado" funcionar
    isProfissional: false,
    tipoProfissional: "ADVOGADO",
    showSenha: false,
    showConfirmaSenha: false,
  });

  // Estados para controlar os alertas de feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Hook do React Router para navegação
  const navigate = useNavigate();

  // --- HANDLERS (Funções de controle) ---

  // Handler genérico que atualiza o estado 'formData' para a maioria dos inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handler específico para o campo de telefone, que usa a biblioteca de máscara
  const handleTelefoneChange = (value) => {
    setFormData((prevData) => ({ ...prevData, telefone: value }));
  };

  // Funções para alternar a visibilidade das senhas
  const toggleShowSenha = () => {
    setFormData((prev) => ({ ...prev, showSenha: !prev.showSenha }));
  };
  const toggleShowConfirmaSenha = () => {
    setFormData((prev) => ({
      ...prev,
      showConfirmaSenha: !prev.showConfirmaSenha,
    }));
  };

  // Função principal que é chamada ao submeter o formulário
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.senha !== formData.confirmaSenha) {
      setError("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    const nomeCompleto =
      `${formData.primeiroNome} ${formData.sobrenome}`.trim();
    const localizacaoConcatenada = `${formData.cidade} - ${formData.estado}`;
    const telefoneLimpo = formData.telefone.replace(/\D/g, "");

    let endpoint;
    let payload;

    if (formData.isProfissional) {
      endpoint = "/auth/registrar/profissional";
      payload = {
        nome: nomeCompleto,
        email: formData.email,
        senha: formData.senha,
        telefone: telefoneLimpo,
        localizacao: localizacaoConcatenada,
        tipoProfissional: formData.tipoProfissional,
        // O campo 'role' é definido no backend
      };
    } else {
      endpoint = "/auth/registrar/comum";
      payload = {
        nome: nomeCompleto,
        email: formData.email,
        senha: formData.senha,
        telefone: telefoneLimpo,
        localizacao: localizacaoConcatenada,
        // O campo 'role' é definido no backend
      };
    }

    try {
      await api.post(endpoint, payload);
      setSuccess(
        "Conta criada com sucesso! Você será redirecionado para a página de login em 5 segundos."
      );

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (err) {
      const message =
        err.response?.data ||
        "Ocorreu um erro ao cadastrar. Verifique se o e-mail já está em uso.";
      setError(message);
    }
  };

  // Efeito para observar mudanças no tema do site
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

  // --- RENDERIZAÇÃO (JSX) ---
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
          <Card.Body>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form className="text-start" onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPrimeiroNome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Seu primeiro nome"
                    name="primeiroNome"
                    value={formData.primeiroNome}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridSobrenome">
                  <Form.Label>Sobrenome</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Seu sobrenome"
                    name="sobrenome"
                    value={formData.sobrenome}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Row>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email@email.com"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicTelefone">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  as={IMaskInput}
                  mask="(00) 00000-0000"
                  placeholder="(99) 99999-9999"
                  value={formData.telefone}
                  onAccept={handleTelefoneChange}
                  required
                />
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCidade">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: São Luís"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridEstado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
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

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Senha</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={formData.showSenha ? "text" : "password"}
                    name="senha"
                    placeholder="Crie sua senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={toggleShowSenha}
                    className="rounded-end"
                  >
                    <i
                      className={`bi ${
                        formData.showSenha ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                <Form.Label>Confirme a Senha</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={formData.showConfirmaSenha ? "text" : "password"}
                    name="confirmaSenha"
                    placeholder="Confirme sua senha"
                    value={formData.confirmaSenha}
                    onChange={handleChange}
                    required
                    isInvalid={
                      !!formData.confirmaSenha &&
                      formData.senha !== formData.confirmaSenha
                    }
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={toggleShowConfirmaSenha}
                    className="rounded-end"
                  >
                    <i
                      className={`bi ${
                        formData.showSenha ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    As senhas não coincidem.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <hr />

              <Form.Group className="mb-3" controlId="formProfissionalCheckbox">
                <Form.Check
                  type="checkbox"
                  name="isProfissional"
                  label="Sou um Advogado(a) ou Psicólogo(a) e quero me cadastrar como voluntário(a)"
                  checked={formData.isProfissional}
                  onChange={handleChange}
                />
              </Form.Group>

              {formData.isProfissional && (
                <Form.Group className="mb-3">
                  <Form.Label>Especialidade:</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Advogado(a)"
                      name="tipoProfissional"
                      value="ADVOGADO"
                      checked={formData.tipoProfissional === "ADVOGADO"}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Psicólogo(a)"
                      name="tipoProfissional"
                      value="PSICOLOGO"
                      checked={formData.tipoProfissional === "PSICOLOGO"}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Container className="d-flex justify-content-center p-1 gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={
                      formData.senha !== formData.confirmaSenha ||
                      !formData.senha
                    }
                  >
                    Criar Conta
                  </Button>
                  <Link to="/login" className="btn btn-secondary">
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
