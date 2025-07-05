import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { IMaskInput } from 'react-imask';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../style/Contato.css';

function MinhaConta() {
  // 1. DADOS GLOBAIS E ESTADO DO COMPONENTE
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [dark, setDark] = useState(document.body.classList.contains("dark-theme"));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    localizacao: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 2. EFEITOS (LÓGICAS QUE RODAM EM RESPOSTA A MUDANÇAS)
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        localizacao: user.localizacao || ''
      });
    }
  }, [user]);

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


  // 3. HANDLERS (FUNÇÕES DE EVENTO)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTelefoneChange = (value) => {
    setFormData(prev => ({ ...prev, telefone: value }));
  };

  // CORREÇÃO PRINCIPAL: Adicionado preventDefault para evitar comportamento padrão do form
  const handleEditClick = (e) => {
    e.preventDefault(); // Previne o comportamento padrão
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const dadosParaAtualizar = {
      ...formData,
      telefone: formData.telefone.replace(/\D/g, '')
    };

    try {
      const response = await api.patch(`/usuarios/${user.id}`, dadosParaAtualizar);
      
      updateUser(response.data);
      setSuccess('Seus dados foram atualizados com sucesso!');
      setIsEditing(false);

    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || "Ocorreu um erro ao atualizar os dados.";
      setError(message);
    }
  };
  
  const handleCancel = (e) => {
    e.preventDefault(); // Previne o comportamento padrão
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        localizacao: user.localizacao || ''
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setError('');
    try {
        await api.delete(`/usuarios/${user.id}`);
        alert('Sua conta foi deletada com sucesso. Você será desconectado.');
        logout(); // Limpa o estado global e o localStorage
        navigate('/'); // Redireciona para a página inicial
    } catch (err) {
        const message = err.response?.data?.message || "Não foi possível deletar a conta.";
        setError(message);
        setShowDeleteModal(false); // Fecha o modal em caso de erro
    } finally {
        setIsDeleting(false);
    }
  };

  if (!user) {
    return <div>Carregando dados do usuário...</div>;
  }

  // 4. RENDERIZAÇÃO (JSX)
  return (
    <>
      <main className={`pt-5 pb-5 ${dark ? "bg-dark text-light" : "bg-light text-dark"}`}>
        <Container style={{ maxWidth: '800px' }}>
          <Card className={`card-contato ${dark ? "bg-secondary text-light" : "bg-white text-dark"}`}>
            <Card.Body>
              <Card.Title className={`display-5 mb-1 text-center ${dark ? "text-light" : "text-dark"}`}>
                <i className="bi bi-person-gear mb-1" style={{ fontSize: '3rem', color: dark ? "#fff" : "#212529" }}></i>
              </Card.Title>
              <Card.Title className={`display-5 mb-4 text-center ${dark ? "text-light" : "text-dark"}`}>Minha Conta</Card.Title>
              
              {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
              {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

              <Form onSubmit={isEditing ? handleSubmit : undefined}>
                <Form.Group as={Row} className="mb-3" controlId="formEmail">
                  <Form.Label column sm="3" className={`text-end ${dark ? "text-light" : "text-dark"}`}>Email</Form.Label>
                  <Col sm="9">
                    <Form.Control
                      type="email"
                      readOnly
                      disabled
                      value={user.email || ''}
                      className={dark ? "text-light bg-secondary" : "text-dark bg-white"}
                      title="O email não pode ser alterado"
                      style={{ cursor: "not-allowed" }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formNome">
                  <Form.Label column sm="3" className={`text-end ${dark ? "text-light" : "text-dark"}`}>Nome Completo</Form.Label>
                  <Col sm="9">
                    {isEditing ? (
                      <Form.Control 
                        type="text" 
                        name="nome" 
                        value={formData.nome} 
                        onChange={handleChange}
                        required
                        className={dark ? "text-light bg-secondary" : "text-dark bg-white"}
                      />
                    ) : (
                      <Form.Control plaintext readOnly defaultValue={user.nome} className={`text-start ${dark ? "text-light" : "text-dark"}`} />
                    )}
                  </Col>
                </Form.Group>
                
                <Form.Group as={Row} className="mb-3" controlId="formTelefone">
                  <Form.Label column sm="3" className={`text-end ${dark ? "text-light" : "text-dark"}`}>Telefone</Form.Label>
                  <Col sm="9">
                    {isEditing ? (
                      <Form.Control 
                        as={IMaskInput} 
                        mask="(00) 00000-0000"
                        name="telefone"
                        value={formData.telefone}
                        onAccept={handleTelefoneChange}
                        required
                        className={dark ? "text-light bg-secondary" : "text-dark bg-white"}
                      />
                    ) : (
                      <Form.Control plaintext readOnly defaultValue={user.telefone} className={`text-start ${dark ? "text-light" : "text-dark"}`} />
                    )}
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formLocalizacao">
                  <Form.Label column sm="3" className={`text-start ${dark ? "text-light" : "text-dark"} text-end`}>Localização</Form.Label>
                  <Col sm="9">
                    {isEditing ? (
                      <Form.Control 
                        type="text" 
                        name="localizacao" 
                        value={formData.localizacao} 
                        onChange={handleChange}
                        required
                        className={dark ? "text-light bg-secondary" : "text-dark bg-white"}
                      />
                    ) : (
                      <Form.Control plaintext readOnly defaultValue={user.localizacao} className={`text-start ${dark ? "text-light" : "text-dark"}`} />
                    )}
                  </Col>
                </Form.Group>

                <Container className="mt-4 text-center">
                  {isEditing ? (
                    <>
                      <Button variant="success" type="submit" className="me-2">
                        Salvar Alterações
                      </Button>
                      <Button variant={dark ? "light" : "secondary"} type="button" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button variant="primary" type="button" onClick={handleEditClick}>
                      Editar Dados
                    </Button>
                  )}
                  <Button variant="danger" className="ms-2" onClick={() => setShowDeleteModal(true)} title="A exclusão da conta não pode ser desfeita">
                      Deletar Minha Conta
                  </Button>
                </Container>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </main>

      {/* Modal de confirmação de exclusão */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              background: dark ? "#343a40" : "#fff",
              color: dark ? "#fff" : "#212529",
              borderRadius: 8,
              padding: "2rem",
              minWidth: 320,
              maxWidth: "90vw",
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
              textAlign: "center"
            }}
          >
            <h4 className="mb-3">Confirmação de Exclusão</h4>
            <p>Tem certeza que deseja excluir sua conta? Esta ação não poderá ser desfeita.</p>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Sim, eu confirmo"}
              </Button>
              <Button
                variant={dark ? "light" : "secondary"}
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Não, Voltar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MinhaConta;

