import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { IMaskInput } from 'react-imask';
import api from '../services/api';

function MinhaConta() {
  // Pega o usuário logado e a função para atualizá-lo do nosso contexto global
  const { user, updateUser } = useAuth();

  // Estado para controlar o tema escuro/claro
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );

  // Estado para controlar se o formulário está em modo de edição ou visualização
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado LOCAL para guardar os dados do formulário DURANTE a edição
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    localizacao: ''
  });

  // Estados para exibir mensagens de sucesso ou erro para o usuário
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Efeito que popula o formulário com os dados do usuário quando a página carrega
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        telefone: user.telefone || '',
        localizacao: user.localizacao || ''
      });
    }
  }, [user]); // Este efeito roda sempre que o objeto 'user' do contexto mudar

  // Efeito para observar mudanças no tema do site
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.body.classList.contains("dark-theme"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Handler genérico para atualizar o estado local 'formData'
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler específico para o campo de telefone com máscara
  const handleTelefoneChange = (value) => {
    setFormData(prev => ({ ...prev, telefone: value }));
  };

  // Função chamada ao clicar em "Salvar Alterações"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Prepara os dados para enviar, limpando a máscara do telefone
    const dadosParaAtualizar = {
      ...formData,
      telefone: formData.telefone.replace(/\D/g, '')
    };

    try {
      // Usa o PATCH para a atualização parcial. O ID vem do usuário logado no contexto.
      const response = await api.patch(`/usuarios/${user.id}`, dadosParaAtualizar);
      
      // Usa a função do contexto para atualizar os dados do usuário globalmente na aplicação
      updateUser(response.data);

      setSuccess('Seus dados foram atualizados com sucesso!');
      setIsEditing(false); // Volta para o modo de visualização

    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || "Ocorreu um erro ao atualizar os dados.";
      setError(message);
    }
  };

  // Se o usuário ainda não foi carregado do AuthContext, mostra uma mensagem de carregando
  if (!user) {
    return <div>Carregando dados do usuário...</div>;
  }

  // Renderização do componente
  return (
    <main className={`text-center text-lg-start pt-5 pb-5 ${dark ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <Container style={{ maxWidth: '800px' }}>
        <Card className={`p-4 ${dark ? "bg-secondary text-light" : "bg-light text-dark"}`}>
          <Card.Body>
            <Card.Title className="display-5 mb-4">Minha Conta</Card.Title>
            
            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3" controlId="formEmail">
                <Form.Label column sm="3">Email (não pode ser alterado)</Form.Label>
                <Col sm="9">
                  <Form.Control type="email" readOnly disabled value={user.email} />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formNome">
                <Form.Label column sm="3">Nome Completo</Form.Label>
                <Col sm="9">
                  {isEditing ? (
                    <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} />
                  ) : (
                    <Form.Control plaintext readOnly defaultValue={user.nome} />
                  )}
                </Col>
              </Form.Group>
              
              <Form.Group as={Row} className="mb-3" controlId="formTelefone">
                <Form.Label column sm="3">Telefone</Form.Label>
                <Col sm="9">
                  {isEditing ? (
                    <Form.Control 
                      as={IMaskInput} 
                      mask="(00) 00000-0000"
                      name="telefone"
                      value={formData.telefone}
                      onAccept={handleTelefoneChange}
                    />
                  ) : (
                    <Form.Control plaintext readOnly defaultValue={user.telefone} />
                  )}
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formLocalizacao">
                <Form.Label column sm="3">Localização</Form.Label>
                <Col sm="9">
                  {isEditing ? (
                    <Form.Control type="text" name="localizacao" value={formData.localizacao} onChange={handleChange} />
                  ) : (
                    <Form.Control plaintext readOnly defaultValue={user.localizacao} />
                  )}
                </Col>
              </Form.Group>

              <div className="mt-4">
                {isEditing ? (
                  <>
                    <Button variant="success" type="submit" className="me-2">Salvar Alterações</Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={() => setIsEditing(true)}>Editar Dados</Button>
                )}
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}

export default MinhaConta;