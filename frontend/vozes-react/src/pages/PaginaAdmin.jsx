import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Card,
  Tabs,
  Tab,
  Table,
  Button,
  Pagination,
  Modal,
  Alert,
  Form,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";
import api from "../services/api";
import "../style/PaginaAdmin.css";

function PaginaAdmin() {
  const { user, updateUser, loading } = useAuth();
  const navigate = useNavigate();

  // --- ESTADOS GERAIS ---
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );
  const [activeTab, setActiveTab] = useState("minhaConta");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- ESTADOS PARA "MINHA CONTA" ---
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    nome: "",
    telefone: "",
    localizacao: "",
  });

  // --- ESTADOS PARA "GERENCIAR USUÁRIOS" ---
  const [users, setUsers] = useState([]);
  const [usersPageInfo, setUsersPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
  });
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editUserFormData, setEditUserFormData] = useState({});

  // --- ESTADOS PARA "GERENCIAR DENÚNCIAS" ---
  const [denuncias, setDenuncias] = useState([]);
  const [denunciasPageInfo, setDenunciasPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
  });
  const [denunciaToDelete, setDenunciaToDelete] = useState(null);
  const [denunciaToEdit, setDenunciaToEdit] = useState(null);
  const [editDenunciaFormData, setEditDenunciaFormData] = useState({});

  // --- ESTADOS PARA "GERENCIAR CONTATOS" ---
  const [contatos, setContatos] = useState([]);
  const [contatosPageInfo, setContatosPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
  });
  const [contatoToView, setContatoToView] = useState(null);

  // --- FUNÇÕES DE BUSCA DE DADOS (FETCH) ---
  const fetchUsers = async (page) => {
    try {
      const response = await api.get(
        `/usuarios?page=${page}&size=15&sort=nome`
      );
      setUsers(response.data.content || []);
      setUsersPageInfo({
        currentPage: page,
        totalPages: response.data.totalPages || 0,
      });
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
      setError("Falha ao carregar usuários.");
    }
  };

  const fetchDenuncias = async (page) => {
    try {
      const response = await api.get(
        `/denuncias?page=${page}&size=15&sort=id,desc`
      );
      setDenuncias(response.data.content || []);
      setDenunciasPageInfo({
        currentPage: page,
        totalPages: response.data.totalPages || 0,
      });
    } catch (err) {
      console.error("Erro ao carregar denúncias:", err);
      setError("Falha ao carregar denúncias.");
    }
  };

  // CORREÇÃO PRINCIPAL: Função fetchContatos adaptada para a estrutura real da API
  const fetchContatos = async (page) => {
    try {
      console.log(`🔍 Buscando contatos - página: ${page}`);
      const response = await api.get(
        `/contatos?page=${page}&size=15&sort=idContato,desc`
      );
      console.log("📦 Resposta da API contatos:", response.data);
      
      // CORREÇÃO: Verificar se a API retorna array direto ou estrutura paginada
      if (Array.isArray(response.data)) {
        // API retorna array direto (caso atual)
        console.log("✅ API retorna array direto com", response.data.length, "contatos");
        setContatos(response.data);
        setContatosPageInfo({
          currentPage: 0,
          totalPages: response.data.length > 0 ? 1 : 0,
        });
      } else if (response.data && response.data.content) {
        // API retorna estrutura paginada (caso esperado)
        console.log("✅ API retorna estrutura paginada");
        setContatos(response.data.content || []);
        setContatosPageInfo({
          currentPage: page,
          totalPages: response.data.totalPages || 0,
        });
      } else {
        // Estrutura inesperada
        console.warn("⚠️ Estrutura de resposta inesperada:", response.data);
        setContatos([]);
        setContatosPageInfo({
          currentPage: 0,
          totalPages: 0,
        });
      }
    } catch (err) {
      console.error("❌ Erro ao carregar contatos:", err);
      setError("Falha ao carregar as mensagens de contato.");
      setContatos([]);
      setContatosPageInfo({
        currentPage: 0,
        totalPages: 0,
      });
    }
  };

  // useEffect principal para carregar dados quando a aba muda
  useEffect(() => {
    if (!user || user.role !== "ADMIN" || loading) return;

    console.log(`🔄 Aba ativa mudou para: ${activeTab}`);

    if (activeTab === "gerenciarUsuarios") {
      fetchUsers(0);
    } else if (activeTab === "gerenciarDenuncias") {
      fetchDenuncias(0);
    } else if (activeTab === "gerenciarContatos") {
      fetchContatos(0);
    }
  }, [activeTab, user, loading]);

  // useEffects separados para mudanças de página
  useEffect(() => {
    if (!user || user.role !== "ADMIN" || loading) return;
    if (activeTab === "gerenciarUsuarios") {
      fetchUsers(usersPageInfo.currentPage);
    }
  }, [usersPageInfo.currentPage]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN" || loading) return;
    if (activeTab === "gerenciarDenuncias") {
      fetchDenuncias(denunciasPageInfo.currentPage);
    }
  }, [denunciasPageInfo.currentPage]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN" || loading) return;
    if (activeTab === "gerenciarContatos") {
      fetchContatos(contatosPageInfo.currentPage);
    }
  }, [contatosPageInfo.currentPage]);

  // Efeito para popular o formulário do admin
  useEffect(() => {
    if (user) {
      setAdminFormData({
        nome: user.nome || "",
        telefone: user.telefone || "",
        localizacao: user.localizacao || "",
      });
    }
  }, [user]);

  // Efeito para o tema escuro
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.body.classList.contains("dark-theme"))
    );
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Efeito de redirecionamento
  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // --- HANDLERS (FUNÇÕES DE AÇÃO) ---
  const handleAdminFormChange = (e) =>
    setAdminFormData({ ...adminFormData, [e.target.name]: e.target.value });
  const handleAdminTelefoneChange = (value) =>
    setAdminFormData((prev) => ({ ...prev, telefone: value }));

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const dataToUpdate = {
        nome: adminFormData.nome,
        telefone: adminFormData.telefone.replace(/\D/g, ""),
        localizacao: adminFormData.localizacao,
      };
      const response = await api.patch(`/usuarios/${user.id}`, dataToUpdate);
      updateUser(response.data);
      setSuccess("Seus dados foram atualizados com sucesso!");
      setIsEditingAdmin(false);
    } catch (err) {
      setError("Falha ao atualizar seus dados.");
    }
  };

  const handleAdminCancelEdit = () => {
    if (user) {
      setAdminFormData({
        nome: user.nome || "",
        telefone: user.telefone || "",
        localizacao: user.localizacao || "",
      });
    }
    setIsEditingAdmin(false);
  };

  const handleOpenEditModal = (userToEdit) => {
    setUserToEdit(userToEdit);
    setEditUserFormData({
      nome: userToEdit.nome,
      email: userToEdit.email,
      telefone: userToEdit.telefone || "",
      localizacao: userToEdit.localizacao || "",
      tipoProfissional: userToEdit.tipoProfissional || "ADVOGADO",
    });
  };

  const handleEditUserFormChange = (e) =>
    setEditUserFormData({
      ...editUserFormData,
      [e.target.name]: e.target.value,
    });
  const handleEditUserTelefoneChange = (value) =>
    setEditUserFormData((prev) => ({ ...prev, telefone: value }));

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const dataToUpdate = {
        ...editUserFormData,
        telefone: editUserFormData.telefone.replace(/\D/g, ""),
      };
      await api.patch(`/usuarios/${userToEdit.id}`, dataToUpdate);
      setUserToEdit(null);
      setSuccess(`Usuário ${userToEdit.nome} atualizado com sucesso.`);
      fetchUsers(usersPageInfo.currentPage);
    } catch (err) {
      setError("Falha ao atualizar usuário.");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/usuarios/${userToDelete.id}`);
      setUserToDelete(null);
      setSuccess(`Usuário ${userToDelete.nome} deletado com sucesso.`);
      fetchUsers(usersPageInfo.currentPage);
    } catch (err) {
      setError("Falha ao deletar usuário.");
      setUserToDelete(null);
    }
  };

  const handleOpenEditDenunciaModal = (denuncia) => {
    setDenunciaToEdit(denuncia);
    setEditDenunciaFormData({
      nome: denuncia.nome || "Anônimo",
      email: denuncia.email || "Não informado",
      data: denuncia.data,
      localIncidente: denuncia.localIncidente,
      descricao: denuncia.descricao,
    });
  };

  const handleEditDenunciaFormChange = (e) => {
    setEditDenunciaFormData({
      ...editDenunciaFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateDenuncia = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.put(`/denuncias/${denunciaToEdit.id}`, editDenunciaFormData);
      setDenunciaToEdit(null);
      setSuccess(`Denúncia #${denunciaToEdit.id} atualizada com sucesso.`);
      fetchDenuncias(denunciasPageInfo.currentPage);
    } catch (err) {
      setError("Falha ao atualizar a denúncia.");
    }
  };

  const handleDeleteDenuncia = async () => {
    if (!denunciaToDelete) return;
    try {
      await api.delete(`/denuncias/${denunciaToDelete.id}`);
      setDenunciaToDelete(null);
      setSuccess(`Denúncia #${denunciaToDelete.id} deletada com sucesso.`);
      fetchDenuncias(denunciasPageInfo.currentPage);
    } catch (err) {
      setError("Falha ao deletar denúncia.");
      setDenunciaToDelete(null);
    }
  };

  // Handler para mudança de página dos contatos (adaptado para API sem paginação)
  const handleContatosPageChange = (page) => {
    console.log(`📄 Tentativa de mudança para página ${page} dos contatos`);
    // Como a API atual retorna todos os contatos, não há paginação real
    // Mas mantemos a interface para consistência
    setContatosPageInfo({
      ...contatosPageInfo,
      currentPage: page,
    });
  };

  if (loading || !user) {
    return <div>Verificando permissões...</div>;
  }

  return (
    <>
      <main
        className={`admin-main text-center text-lg-start pt-5 pb-5 ${
          dark ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        <Container className="admin-container">
          <h1
            className={`display-4 mb-4 admin-title ${
              dark ? "text-light" : "text-dark"
            }`}
          >
            Painel de Administração
          </h1>
          {success && (
            <Alert variant="success" onClose={() => setSuccess("")} dismissible>
              {success}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" onClose={() => setError("")} dismissible>
              {error}
            </Alert>
          )}

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            id="admin-tabs"
            className="mb-3 admin-tabs"
            fill
          >
            {/* ABA 1: MINHA CONTA (ADMIN) */}
            <Tab eventKey="minhaConta" title="Minha Conta">
              <Card
                className={`admin-form-container mt-0 p-4 ${
                  dark ? "bg-dark text-light" : "bg-white text-dark"
                }`}
              >
                <Form onSubmit={handleAdminUpdate}>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Email
                    </Form.Label>
                    <Col sm="9">
                      <Form.Control
                        plaintext
                        readOnly
                        value={user.email}
                        className={dark ? "text-light" : ""}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Nome
                    </Form.Label>
                    <Col sm="9">
                      {isEditingAdmin ? (
                        <Form.Control
                          type="text"
                          name="nome"
                          value={adminFormData.nome}
                          onChange={handleAdminFormChange}
                        />
                      ) : (
                        <Form.Control
                          plaintext
                          readOnly
                          value={user.nome}
                          className={dark ? "text-light" : ""}
                        />
                      )}
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Telefone
                    </Form.Label>
                    <Col sm="9">
                      {isEditingAdmin ? (
                        <Form.Control
                          as={IMaskInput}
                          mask="(00) 00000-0000"
                          name="telefone"
                          value={adminFormData.telefone}
                          onAccept={handleAdminTelefoneChange}
                        />
                      ) : (
                        <Form.Control
                          plaintext
                          readOnly
                          value={user.telefone}
                          className={dark ? "text-light" : ""}
                        />
                      )}
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="3">
                      Localização
                    </Form.Label>
                    <Col sm="9">
                      {isEditingAdmin ? (
                        <Form.Control
                          type="text"
                          name="localizacao"
                          value={adminFormData.localizacao}
                          onChange={handleAdminFormChange}
                        />
                      ) : (
                        <Form.Control
                          plaintext
                          readOnly
                          value={user.localizacao}
                          className={dark ? "text-light" : ""}
                        />
                      )}
                    </Col>
                  </Form.Group>
                  <div className="text-end mt-3">
                    {isEditingAdmin ? (
                      <>
                        <Button
                          variant="outline-secondary"
                          className="me-2"
                          onClick={handleAdminCancelEdit}
                        >
                          Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                          Salvar Alterações
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline-primary"
                        type="button"
                        onClick={() => setIsEditingAdmin(true)}
                      >
                        Editar Dados
                      </Button>
                    )}
                  </div>
                </Form>
              </Card>
            </Tab>

            {/* ABA 2: GERENCIAR USUÁRIOS */}
            <Tab eventKey="gerenciarUsuarios" title="Gerenciar Usuários">
              <Table
                striped
                bordered
                hover
                responsive="sm"
                variant={dark ? "dark" : ""}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.nome}</td>
                      <td>{u.email}</td>
                      <td>
                        <Badge
                          bg={
                            u.tipoUsuario === "PROFISSIONAL"
                              ? "info"
                              : "secondary"
                          }
                        >
                          {u.tipoUsuario}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleOpenEditModal(u)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setUserToDelete(u)}
                        >
                          Deletar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="justify-content-center">
                {[...Array(usersPageInfo.totalPages).keys()].map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === usersPageInfo.currentPage}
                    onClick={() =>
                      setUsersPageInfo({ ...usersPageInfo, currentPage: page })
                    }
                  >
                    {page + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Tab>

            {/* ABA 3: GERENCIAR DENÚNCIAS */}
            <Tab eventKey="gerenciarDenuncias" title="Gerenciar Denúncias">
              <Table
                striped
                bordered
                hover
                responsive="sm"
                variant={dark ? "dark" : ""}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Denunciante</th>
                    <th>Data</th>
                    <th>Local</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {denuncias.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.nome || "Anônimo"}</td>
                      <td>{new Date(d.data).toLocaleDateString("pt-BR")}</td>
                      <td>{d.localIncidente}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleOpenEditDenunciaModal(d)}
                        >
                          Ver/Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => setDenunciaToDelete(d)}
                        >
                          Deletar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="justify-content-center">
                {[...Array(denunciasPageInfo.totalPages).keys()].map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === denunciasPageInfo.currentPage}
                    onClick={() =>
                      setDenunciasPageInfo({
                        ...denunciasPageInfo,
                        currentPage: page,
                      })
                    }
                  >
                    {page + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Tab>

            {/* ABA 4: GERENCIAR CONTATOS - CORRIGIDA PARA ESTRUTURA REAL DA API */}
            <Tab eventKey="gerenciarContatos" title="Gerenciar Contatos">
              {/* Debug info para desenvolvimento 
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-3 p-2 bg-info text-dark rounded">
                  <small>
                    <strong>Debug:</strong> {contatos.length} contatos carregados | 
                    Página atual: {contatosPageInfo.currentPage} | 
                    Total de páginas: {contatosPageInfo.totalPages} |
                    Loading: {loading ? 'true' : 'false'} |
                    User role: {user?.role}
                  </small>
                </div>
              )}*/}
              
              <Table
                striped
                bordered
                hover
                responsive="sm"
                variant={dark ? "dark" : ""}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contatos.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        {loading ? "Carregando contatos..." : "Nenhum contato encontrado"}
                      </td>
                    </tr>
                  ) : (
                    contatos.map((contato) => (
                      <tr key={contato.idContato}>
                        <td>{contato.idContato}</td>
                        <td>{contato.nome}</td>
                        <td>{contato.email}</td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => setContatoToView(contato)}
                          >
                            Visualizar Mensagem
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
              
              {/* Paginação - adaptada para API sem paginação real */}
              {contatosPageInfo.totalPages > 1 && (
                <Pagination className="justify-content-center">
                  {[...Array(contatosPageInfo.totalPages).keys()].map((page) => (
                    <Pagination.Item
                      key={page}
                      active={page === contatosPageInfo.currentPage}
                      onClick={() => handleContatosPageChange(page)}
                    >
                      {page + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              )}
            </Tab>
          </Tabs>
        </Container>
      </main>

      {/* === MODAIS === */}
      <Modal
        show={!!userToDelete}
        onHide={() => setUserToDelete(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja deletar o usuário{" "}
          <strong>{userToDelete?.nome}</strong>? Esta ação é irreversível.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setUserToDelete(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Confirmar Exclusão
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={!!denunciaToDelete}
        onHide={() => setDenunciaToDelete(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja deletar a denúncia{" "}
          <strong>#{denunciaToDelete?.id}</strong>, feita por{" "}
          {denunciaToDelete?.nome || "Anônimo"}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDenunciaToDelete(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteDenuncia}>
            Confirmar Exclusão
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={!!userToEdit} onHide={() => setUserToEdit(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuário: {userToEdit?.nome}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateUser}>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={editUserFormData.nome || ""}
                onChange={handleEditUserFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editUserFormData.email || ""}
                onChange={handleEditUserFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                as={IMaskInput}
                mask="(00) 00000-0000"
                name="telefone"
                value={editUserFormData.telefone || ""}
                onAccept={(value) =>
                  setEditUserFormData((prev) => ({ ...prev, telefone: value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Localização</Form.Label>
              <Form.Control
                type="text"
                name="localizacao"
                value={editUserFormData.localizacao || ""}
                onChange={handleEditUserFormChange}
              />
            </Form.Group>
            {userToEdit?.tipoUsuario === "PROFISSIONAL" && (
              <Form.Group className="mb-3">
                <Form.Label>Tipo Profissional</Form.Label>
                <Form.Select
                  name="tipoProfissional"
                  value={editUserFormData.tipoProfissional}
                  onChange={handleEditUserFormChange}
                >
                  <option value="ADVOGADO">ADVOGADO</option>
                  <option value="PSICOLOGO">PSICOLOGO</option>
                </Form.Select>
              </Form.Group>
            )}
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setUserToEdit(null)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar Alterações
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={!!denunciaToEdit}
        onHide={() => setDenunciaToEdit(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Denúncia #{denunciaToEdit?.id} - {denunciaToEdit?.nome || "Anônimo"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateDenuncia}>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={editDenunciaFormData.nome || ""}
                onChange={handleEditDenunciaFormChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editDenunciaFormData.email || ""}
                onChange={handleEditDenunciaFormChange}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="text"
                name="data"
                value={
                  editDenunciaFormData.data
                    ? new Date(editDenunciaFormData.data).toLocaleString("pt-BR")
                    : ""
                }
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Local do Incidente</Form.Label>
              <Form.Control
                type="text"
                name="localIncidente"
                value={editDenunciaFormData.localIncidente || ""}
                onChange={handleEditDenunciaFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="descricao"
                value={editDenunciaFormData.descricao || ""}
                onChange={handleEditDenunciaFormChange}
                rows={4}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setDenunciaToEdit(null)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar Alterações
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={!!contatoToView}
        onHide={() => setContatoToView(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Mensagem de: {contatoToView?.nome}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>ID:</strong> {contatoToView?.idContato}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${contatoToView?.email}`}>
              {contatoToView?.email}
            </a>
          </p>
          <hr />
          <h5>Mensagem:</h5>
          <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {contatoToView?.mensagem}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setContatoToView(null)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PaginaAdmin;
