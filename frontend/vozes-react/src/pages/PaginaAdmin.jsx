import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
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
  const [dark, setDark] = useState(
    document.body.classList.contains("dark-theme")
  );
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

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

  // --- ESTADOS GERAIS ---
  const [activeTab, setActiveTab] = useState("minhaConta");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --- ESTADOS PARA A ABA "MINHA CONTA" (ADMIN) ---
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    localizacao: "",
  });

  // --- ESTADOS PARA A ABA "GERENCIAR USUÁRIOS" ---
  const [users, setUsers] = useState([]);
  const [usersPageInfo, setUsersPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
  });
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editUserFormData, setEditUserFormData] = useState({});

  // --- ESTADOS PARA A ABA "GERENCIAR DENÚNCIAS" ---
  const [denuncias, setDenuncias] = useState([]);
  const [denunciasPageInfo, setDenunciasPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
  });
  const [denunciaToDelete, setDenunciaToDelete] = useState(null);

  // --- FUNÇÕES DE BUSCA DE DADOS (FETCH) ---
  const fetchUsers = async (page) => {
    try {
      const response = await api.get(
        `/usuarios?page=${page}&size=15&sort=nome`
      );
      setUsers(response.data.content);
      setUsersPageInfo({
        currentPage: page,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError("Falha ao carregar usuários.");
    }
  };

  const fetchDenuncias = async (page) => {
    try {
      const response = await api.get(
        `/denuncias?page=${page}&size=15&sort=data,desc`
      );
      setDenuncias(response.data.content);
      setDenunciasPageInfo({
        currentPage: page,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError("Falha ao carregar denúncias.");
    }
  };

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    if (activeTab === "gerenciarUsuarios") {
      fetchUsers(usersPageInfo.currentPage);
    } else if (activeTab === "gerenciarDenuncias") {
      fetchDenuncias(denunciasPageInfo.currentPage);
    }
  }, [
    activeTab,
    usersPageInfo.currentPage,
    denunciasPageInfo.currentPage,
    user,
  ]);

  // Efeito para popular o formulário do admin com os dados atuais do usuário
  useEffect(() => {
    if (user) {
      setAdminFormData({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
        localizacao: user.localizacao || "",
      });
    }
    // Aplica a classe do tema escuro ao body se necessário
    if (dark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [user]);

  // --- HANDLERS (FUNÇÕES DE AÇÃO) ---

  // Handlers para o formulário do próprio Admin
  const handleAdminFormChange = (e) =>
    setAdminFormData({ ...adminFormData, [e.target.name]: e.target.value });
  const handleAdminTelefoneChange = (value) =>
    setAdminFormData((prev) => ({ ...prev, telefone: value }));

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // Prepara os dados para enviar, excluindo o email (que não pode ser alterado por si mesmo)
      // e limpando a máscara do telefone.
      const { email, ...dataToUpdate } = adminFormData;
      dataToUpdate.telefone = dataToUpdate.telefone.replace(/\D/g, "");

      const response = await api.patch(`/usuarios/${user.id}`, dataToUpdate);
      updateUser(response.data); // Atualiza o usuário no contexto global
      setSuccess("Seus dados foram atualizados com sucesso!");
      setIsEditingAdmin(false); // Volta para o modo de visualização
    } catch (err) {
      setError("Falha ao atualizar seus dados.");
    }
  };

  const handleAdminCancelEdit = () => {
    // Restaura os dados do formulário para os valores originais do usuário
    if (user) {
      setAdminFormData({
        nome: user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
        localizacao: user.localizacao || "",
      });
    }
    setIsEditingAdmin(false);
  };

  // Abre o modal de edição de usuário e popula o formulário
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

  // Salva as alterações feitas no modal de edição de usuário
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // Admin usa PATCH para poder alterar qualquer campo, inclusive o email
      await api.patch(`/usuarios/${userToEdit.id}`, editUserFormData);
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

  if (!user || user.role !== "ADMIN") {
    navigate("/");
    return null;
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
            {/* === ABA 1: MINHA CONTA (ADMIN) === */}
            <Tab eventKey="minhaConta" title="Minha Conta">
              <Container
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
                        className={`ps-3 rounded-3 ${
                          dark
                            ? "bg-secondary text-light"
                            : "bg-white text-dark"
                        }`}
                        plaintext
                        readOnly
                        value={user.email}
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
                          className={`ps-3 rounded-3 ${
                            dark
                              ? "bg-secondary text-light"
                              : "bg-white text-dark"
                          }`}
                          plaintext
                          readOnly
                          defaultValue={user.nome}
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
                          as={IMaskInput}
                          mask="(00) 00000-0000"
                          className={`ps-3 rounded-3 ${
                            dark
                              ? "bg-secondary text-light"
                              : "bg-white text-dark"
                          }`}
                          plaintext
                          readOnly
                          defaultValue={user.telefone}
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
                          defaultValue={user.localizacao}
                          className={`ps-3 rounded-3 ${
                            dark
                              ? "bg-secondary text-light"
                              : "bg-white text-dark"
                          }`}
                        />
                      )}
                    </Col>
                  </Form.Group>
                  {!isEditingAdmin ? (
                    <div className="text-end mt-3">
                      <Button
                        variant="outline-primary"
                        onClick={() => setIsEditingAdmin(true)}
                      >
                        Editar Dados
                      </Button>
                    </div>
                  ) : (
                    <div className="text-end mt-3">
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
                    </div>
                  )}
                </Form>
              </Container>
            </Tab>
            {/* === ABA 2: GERENCIAR USUÁRIOS === */}
            <Tab eventKey="gerenciarUsuarios" title="Gerenciar Usuários">
              <Table
                striped
                bordered
                hover
                responsive="sm"
                className="admin-table"
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
              <Pagination className="justify-content-center admin-pagination">
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
            {/* === ABA 3: GERENCIAR DENÚNCIAS === */}
            <Tab eventKey="gerenciarDenuncias" title="Gerenciar Denúncias">
              <Table
                striped
                bordered
                hover
                responsive="sm"
                className="admin-table"
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
                          onClick={() =>
                            alert(
                              "Funcionalidade de Editar denúncia a ser implementada."
                            )
                          }
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
              <Pagination className="justify-content-center admin-pagination">
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
            <Tab
              eventKey="gerenciarContatos"
              title="Gerenciar Contatos"
              onEnter={() =>
                alert(
                  "Funcionalidade de Gerenciar Contatos ainda não está implementada."
                )
              }
            >
              <Table
                striped
                bordered
                hover
                responsive="sm"
                className="admin-table"
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Mensagem</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Maria Silva</td>
                    <td>maria@email.com</td>
                    <td>Gostaria de saber mais sobre o projeto.</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>João Souza</td>
                    <td>joao@email.com</td>
                    <td>Encontrei um problema no site.</td>
                  </tr>
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Container>
      </main>

      {/* === MODAIS DE CONFIRMAÇÃO E EDIÇÃO === */}
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
                type="text"
                name="telefone"
                value={editUserFormData.telefone || ""}
                onChange={handleEditUserFormChange}
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
    </>
  );
}

export default PaginaAdmin;
