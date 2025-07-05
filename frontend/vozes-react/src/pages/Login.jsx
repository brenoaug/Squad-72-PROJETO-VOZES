import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // MUDANÇA 1: Importar useNavigate
import { useAuth } from "../context/AuthContext"; // MUDANÇA 2: Importar nosso hook de autenticação

function Login() {
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );

  // MUDANÇA 3: Estados para os campos do formulário e para erros
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(""); // Para guardar mensagens de erro

  const navigate = useNavigate(); // Hook para nos permitir redirecionar o usuário
  const { login } = useAuth(); // Pega a função de login do nosso contexto global

  // Seu useEffect para o tema escuro continua perfeito
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


  // MUDANÇA 4: Função para lidar com a submissão do formulário
  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede que a página recarregue
    setError(""); // Limpa erros anteriores

    try {
      // Chama a função 'login' que veio do nosso AuthContext
      await login(email, senha);
      // Se o login der certo, redireciona o usuário para a página de "Minha Conta"
      navigate("/minha-conta"); 
    } catch (err) {
      // Se o login falhar (ex: senha errada), o AuthContext vai lançar um erro.
      // Nós o capturamos aqui e o exibimos para o usuário.
      setError(err.message);
    }
  };


  return (
    <main
      className={`pt-5 pb-5 ${
        dark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >
      <Container style={{ maxWidth: "600px" }}>
        <Card
          className={`card-contato ${
            dark ? "bg-secondary text-light" : "bg-white"
          }`}
        >
          <Card.Body>
            <Card.Title className="display-5 text-center mb-1">
              <i className="icone-login bi bi-person-circle mb-1"></i>
            </Card.Title>
            <Card.Title className="display-5 text-center mb-4">
              Login
            </Card.Title>
            
            {/* MUDANÇA 5: Exibição condicional do alerta de erro */}
            {error && <Alert variant="danger">{error}</Alert>}
            
            {/* MUDANÇA 6: Conectando a função e os estados ao formulário */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Seu E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-center p-1 gap-2">
                <Button variant={dark ? "light" : "secondary"} as={Link} to="/criar-conta">
                  Criar Conta
                </Button>
                <Button variant="primary" type="submit">
                  Entrar
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default Login;