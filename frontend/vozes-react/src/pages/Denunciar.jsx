import {
  Container,
  Card,
  Button,
  Form,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Para pegar o usuário logado
import api from "../services/api";

import "../style/Denunciar.css";

function Denunciar() {
  // Pega o usuário do contexto de autenticação, se houver
  const { user } = useAuth();

  // Estado para o tema
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );

  // Estado único para gerenciar todos os dados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    data: new Date().toISOString().split("T")[0], // Data de hoje como padrão
    localincidente: "",
    descricao: "",
    isAnonymous: false, // Checkbox para denúncia anônima
  });

  // Estados para os alertas de feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Efeito que preenche nome e email se o usuário estiver logado
  /*  
  useEffect(() => {
    if (user && !formData.isAnonymous) {
      setFormData(prev => ({
        ...prev,
        nome: user.nome,
        email: user.email
      }));
    }
  }, [user]);
  */

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

  // Handler genérico para atualizar o estado do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Função principal que envia os dados para a API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Monta o payload (dados) para enviar ao back-end
    const payload = {
      data: formData.data,
      localincidente: formData.localincidente,
      descricao: formData.descricao,
      anexos: [], // Funcionalidade de anexo será implementada no futuro
    };

    // Se a denúncia NÃO for anônima, adiciona nome e email
    if (!formData.isAnonymous) {
      payload.nome = formData.nome;
      payload.email = formData.email;
    }

    try {
      // A baseURL do 'api' já é '/api', então o caminho aqui está correto.
      await api.post("/denuncias", payload);
      setSuccess(
        "Sua denúncia foi enviada com sucesso. Agradecemos por sua coragem e colaboração."
      );

      // Limpa os campos do formulário após o sucesso
      setFormData({
        nome: user ? user.nome : "",
        email: user ? user.email : "",
        data: new Date().toISOString().split("T")[0],
        localincidente: "",
        descricao: "",
        isAnonymous: false,
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Ocorreu um erro ao enviar sua denúncia.";
      setError(message);
    }
  };

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
          <Card.Text className="text-center mb-4 display-4">
            Formulário de Denúncia
          </Card.Text>
          <Card.Body>
            {success && (
              <Alert
                variant="success"
                onClose={() => setSuccess("")}
                dismissible
              >
                {success}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" onClose={() => setError("")} dismissible>
                {error}
              </Alert>
            )}

            <Form className="text-start" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formAnonymousCheckbox">
                <Form.Check
                  type="checkbox"
                  name="isAnonymous"
                  label="Desejo Manter Anonimato (seu nome e e-mail não serão enviados)"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Seu Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  placeholder={
                    formData.isAnonymous
                      ? "Denúncia Anônima"
                      : "Digite Seu Nome"
                  }
                  value={formData.nome}
                  onChange={handleChange}
                  disabled={formData.isAnonymous}
                  required={!formData.isAnonymous}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Seu E-mail</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder={
                    formData.isAnonymous
                      ? "Denúncia Anônima"
                      : "Digite Seu Email"
                  }
                  value={formData.email}
                  onChange={handleChange}
                  disabled={formData.isAnonymous}
                  required={!formData.isAnonymous}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formData">
                <Form.Label>Data do Incidente</Form.Label>
                <Form.Control
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLocalIncidente">
                <Form.Label>Local do Incidente</Form.Label>
                <Form.Control
                  type="text"
                  name="localincidente"
                  placeholder="Nome da Rua, Bairro, Cidade, Estado, etc"
                  value={formData.localincidente}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescricao">
                <InputGroup>
                  <InputGroup.Text>Descrição</InputGroup.Text>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="descricao"
                    placeholder="Descreva o que aconteceu com o máximo de detalhes possível..."
                    value={formData.descricao}
                    onChange={handleChange}
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formFile">
                <Form.Label>Anexar Arquivo (opcional)</Form.Label>
                <Form.Control type="file" disabled />
              </Form.Group>

              <Button variant="primary" type="submit">
                Enviar Denúncia
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default Denunciar;
