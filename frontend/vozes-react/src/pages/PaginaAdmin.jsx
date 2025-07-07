import { useState, useEffect } from "react";
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
  const [paginaAtualUsuarios, setPaginaAtualUsuarios] = useState(0);
  const [totalPaginasUsuarios, setTotalPaginasUsuarios] = useState(0);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editUserFormData, setEditUserFormData] = useState({});

  // --- ESTADOS PARA "GERENCIAR DENÚNCIAS" ---
  const [denuncias, setDenuncias] = useState([]);
  const [paginaAtualDenuncias, setPaginaAtualDenuncias] = useState(0);
  const [totalPaginasDenuncias, setTotalPaginasDenuncias] = useState(0);
  const [denunciaToDelete, setDenunciaToDelete] = useState(null);
  const [denunciaToEdit, setDenunciaToEdit] = useState(null);
  const [editDenunciaFormData, setEditDenunciaFormData] = useState({});

  // --- ESTADOS PARA "GERENCIAR CONTATOS" ---
  const [contatos, setContatos] = useState([]);
  const [paginaAtualContatos, setPaginaAtualContatos] = useState(0);
  const [totalPaginasContatos, setTotalPaginasContatos] = useState(0);
  const [contatoToView, setContatoToView] = useState(null);
  const [contatoToDelete, setContatoToDelete] = useState(null);

  // Buscar usuários
  useEffect(() => {
    if (
      activeTab === "gerenciarUsuarios" &&
      user?.role === "ADMIN" &&
      !loading
    ) {
      console.log(`🔍 Carregando usuários - página: ${paginaAtualUsuarios}`);
      api
        .get(`/usuarios?page=${paginaAtualUsuarios}&size=5&sort=id,desc`)
        .then((response) => {
          console.log("📊 Dados de usuários recebidos:", response.data);
          setUsers(response.data.content || []);
          setTotalPaginasUsuarios(
            response.data.page?.totalPages ?? response.data.totalPages ?? 0
          );
        })
        .catch((error) => {
          console.error("❌ Erro na requisição de usuários:", error);
          setError("Falha ao carregar usuários.");
        });
    }
  }, [paginaAtualUsuarios, activeTab, user, loading]);

  // Buscar denúncias
  useEffect(() => {
    if (
      activeTab === "gerenciarDenuncias" &&
      user?.role === "ADMIN" &&
      !loading
    ) {
      console.log(`🔍 Carregando denúncias - página: ${paginaAtualDenuncias}`);
      api
        .get(`/denuncias?page=${paginaAtualDenuncias}&size=5&sort=id,desc`)
        .then((response) => {
          console.log("📊 Dados de denúncias recebidos:", response.data);
          setDenuncias(response.data.content || []);
          setTotalPaginasDenuncias(
            response.data.page?.totalPages ?? response.data.totalPages ?? 0
          );
        })
        .catch((error) => {
          console.error("❌ Erro na requisição de denúncias:", error);
          setError("Falha ao carregar denúncias.");
        });
    }
  }, [paginaAtualDenuncias, activeTab, user, loading]);

  // Buscar contatos
  useEffect(() => {
    if (
      activeTab === "gerenciarContatos" &&
      user?.role === "ADMIN" &&
      !loading
    ) {
      console.log(`🔍 Carregando contatos - página: ${paginaAtualContatos}`);
      api
        .get(`/contatos?page=${paginaAtualContatos}&size=5&sort=idContato,desc`)
        .then((response) => {
          console.log("📊 Dados de contatos recebidos:", response.data);
          setContatos(response.data.content || []);
          setTotalPaginasContatos(
            response.data.page?.totalPages ?? response.data.totalPages ?? 0
          );
        })
        .catch((error) => {
          console.error("❌ Erro na requisição de contatos:", error);
          setError("Falha ao carregar as mensagens de contato.");
        });
    }
  }, [paginaAtualContatos, activeTab, user, loading]);

  // Reset da paginação quando muda de aba (CORRIGIDO)
  useEffect(() => {
    console.log(`🔄 Mudando para aba: ${activeTab}`);
    setPaginaAtualUsuarios(0);
    setPaginaAtualDenuncias(0);
    setPaginaAtualContatos(0);
    // Limpar mensagens de erro/sucesso quando muda de aba
    setError("");
    setSuccess("");
  }, [activeTab]);

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
    } catch (error) {
      console.error("Erro ao atualizar admin:", error);
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
      reloadUsersData();
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setError("Falha ao atualizar usuário.");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/usuarios/${userToDelete.id}`);
      setUserToDelete(null);
      setSuccess(`Usuário ${userToDelete.nome} deletado com sucesso.`);
      reloadUsersData();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      setError("Falha ao deletar usuário.");
      setUserToDelete(null);
    }
  };

  // HANDLER CORRIGIDO PARA MODAL DE DENÚNCIAS
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
      reloadDenunciasData();
    } catch (error) {
      console.error("Erro ao atualizar denúncia:", error);
      setError("Falha ao atualizar a denúncia.");
    }
  };

  const handleDeleteDenuncia = async () => {
    if (!denunciaToDelete) return;
    try {
      await api.delete(`/denuncias/${denunciaToDelete.id}`);
      setDenunciaToDelete(null);
      setSuccess(`Denúncia #${denunciaToDelete.id} deletada com sucesso.`);
      reloadDenunciasData();
    } catch (error) {
      console.error("Erro ao deletar denúncia:", error);
      setError("Falha ao deletar denúncia.");
      setDenunciaToDelete(null);
    }
  };

  const handleDeleteContato = async () => {
    if (!contatoToDelete) return;
    try {
      await api.delete(`/contatos/${contatoToDelete.idContato}`);
      setContatoToDelete(null);
      setSuccess(`Mensagem de ${contatoToDelete.nome} deletada com sucesso.`);
      reloadContatosData();
    } catch (error) {
      console.error("Erro ao deletar contato:", error);
      setError("Falha ao deletar a mensagem de contato.");
      setContatoToDelete(null);
    }
  };

  // --- HANDLERS DE PAGINAÇÃO (CORRIGIDOS) ---
  const handleUsersPageChange = (newPage) => {
    console.log(`📄 Mudando página de usuários para: ${newPage}`);
    setPaginaAtualUsuarios(newPage);
  };

  const handleDenunciasPageChange = (newPage) => {
    console.log(`📄 Mudando página de denúncias para: ${newPage}`);
    setPaginaAtualDenuncias(newPage);
  };

  const handleContatosPageChange = (newPage) => {
    console.log(`📄 Mudando página de contatos para: ${newPage}`);
    setPaginaAtualContatos(newPage);
  };

  // --- FUNÇÕES DE RECARREGAMENTO (CORRIGIDAS) ---
  const reloadUsersData = () => {
    console.log(
      `Recarregando dados de usuários - página: ${paginaAtualUsuarios}`
    );
    api
      .get(`/usuarios?page=${paginaAtualUsuarios}&size=5&sort=id,desc`)
      .then((response) => {
        setUsers(response.data.content || []);
        setTotalPaginasUsuarios(response.data.page?.totalPages || 0);
      })
      .catch((error) => console.error("Erro ao recarregar usuários:", error));
  };

  const reloadDenunciasData = () => {
    console.log(
      `Recarregando dados de denúncias - página: ${paginaAtualDenuncias}`
    );
    api
      .get(`/denuncias?page=${paginaAtualDenuncias}&size=5&sort=id,desc`)
      .then((response) => {
        setDenuncias(response.data.content || []);
        setTotalPaginasDenuncias(response.data.page?.totalPages || 0);
      })
      .catch((error) => console.error("Erro ao recarregar denúncias:", error));
  };

  const reloadContatosData = () => {
    console.log(
      `Recarregando dados de contatos - página: ${paginaAtualContatos}`
    );
    api
      .get(`/contatos?page=${paginaAtualContatos}&size=5&sort=idContato,desc`)
      .then((response) => {
        setContatos(response.data.content || []);
        setTotalPaginasContatos(response.data.page?.totalPages || 0);
      })
      .catch((error) => console.error("Erro ao recarregar contatos:", error));
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

            {/* ABA 2: GERENCIAR USUÁRIOS - PAGINAÇÃO CORRIGIDA */}
            <Tab eventKey="gerenciarUsuarios" title="Gerenciar Usuários">
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <small className={dark ? "text-light" : "text-muted"}>
                  Mostrando {users.length} usuários - Página{" "}
                  {paginaAtualUsuarios + 1} de {totalPaginasUsuarios}
                </small>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => {
                    console.log("🔧 Debug - Forçando reload de usuários");
                    api
                      .get(
                        `/usuarios?page=${paginaAtualUsuarios}&size=5&sort=id,desc`
                      )
                      .then((response) => {
                        console.log("📊 Response completa:", response.data);
                        setUsers(response.data.content || []);
                        setTotalPaginasUsuarios(
                          response.data.page?.totalPages || 0
                        );
                      });
                  }}
                >
                  <i className="bi bi-arrow-repeat pe-1"></i>Atualizar
                </Button>
              </div>

              <Table
                striped
                bordered
                hover
                responsive="sm"
                variant={dark ? "dark" : ""}
                className="admin-table"
                style={{ verticalAlign: "middle" }}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th style={{ textAlign: "center" }}>Tipo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        {loading
                          ? "Carregando usuários..."
                          : "Nenhum usuário encontrado"}
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.nome}</td>
                        <td>{u.email}</td>
                        <td
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <div className="d-flex justify-content-center gap-1">
                            <Badge
                              bg={
                                u.tipoUsuario === "PROFISSIONAL"
                                  ? "warning text-dark"
                                  : "secondary"
                              }
                            >
                              {u.tipoUsuario}
                            </Badge>
                            {u.role === "ADMIN" && (
                              <Badge bg="danger" className="ms-1">
                                <i className="bi bi-shield-fill-check pe-1"></i>{" "}
                                ADMIN
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-1">
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
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* PAGINAÇÃO CORRIGIDA */}
              {totalPaginasUsuarios > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination className="admin-pagination">
                    <Pagination.First
                      onClick={() => {
                        console.log("📄 Primeira página de usuários");
                        handleUsersPageChange(0);
                      }}
                      disabled={paginaAtualUsuarios === 0}
                    />
                    <Pagination.Prev
                      onClick={() => {
                        console.log("📄 Página anterior de usuários");
                        handleUsersPageChange(paginaAtualUsuarios - 1);
                      }}
                      disabled={paginaAtualUsuarios === 0}
                    />

                    {Array.from({ length: totalPaginasUsuarios }, (_, i) => (
                      <Pagination.Item
                        key={i}
                        active={i === paginaAtualUsuarios}
                        onClick={() => {
                          console.log(`📄 Página ${i + 1} de usuários`);
                          handleUsersPageChange(i);
                        }}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next
                      onClick={() => {
                        console.log("📄 Próxima página de usuários");
                        handleUsersPageChange(paginaAtualUsuarios + 1);
                      }}
                      disabled={paginaAtualUsuarios >= totalPaginasUsuarios - 1}
                    />
                    <Pagination.Last
                      onClick={() => {
                        console.log("📄 Última página de usuários");
                        handleUsersPageChange(totalPaginasUsuarios - 1);
                      }}
                      disabled={paginaAtualUsuarios >= totalPaginasUsuarios - 1}
                    />
                  </Pagination>
                </div>
              )}
            </Tab>

            {/* ABA 3: GERENCIAR DENÚNCIAS - PAGINAÇÃO CORRIGIDA */}
            <Tab eventKey="gerenciarDenuncias" title="Gerenciar Denúncias">
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <small className={dark ? "text-light" : "text-muted"}>
                  Mostrando {denuncias.length} denúncias - Página{" "}
                  {paginaAtualDenuncias + 1} de {totalPaginasDenuncias}
                </small>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => {
                    console.log("🔧 Debug - Forçando reload de denúncias");
                    api
                      .get(
                        `/denuncias?page=${paginaAtualDenuncias}&size=5&sort=id,desc`
                      )
                      .then((response) => {
                        console.log("📊 Response completa:", response.data);
                        setDenuncias(response.data.content || []);
                        setTotalPaginasDenuncias(
                          response.data.page?.totalPages || 0
                        );
                      });
                  }}
                >
                  <i className="bi bi-arrow-repeat pe-1"></i>Atualizar
                </Button>
              </div>

              <Table
                striped
                bordered
                hover
                responsive="sm"
                variant={dark ? "dark" : ""}
                className="admin-table"
                style={{ verticalAlign: "middle" }}
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
                  {denuncias.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        {loading
                          ? "Carregando denúncias..."
                          : "Nenhuma denúncia encontrada"}
                      </td>
                    </tr>
                  ) : (
                    denuncias.map((d) => (
                      <tr key={d.id}>
                        <td>{d.id}</td>
                        <td>{d.nome || "Anônimo"}</td>
                        <td>{new Date(d.data).toLocaleDateString("pt-BR")}</td>
                        <td>{d.localIncidente}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-1">
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
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* PAGINAÇÃO CORRIGIDA */}
              {totalPaginasDenuncias > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination className="admin-pagination">
                    <Pagination.First
                      onClick={() => {
                        console.log("📄 Primeira página de denúncias");
                        handleDenunciasPageChange(0);
                      }}
                      disabled={paginaAtualDenuncias === 0}
                    />
                    <Pagination.Prev
                      onClick={() => {
                        console.log("📄 Página anterior de denúncias");
                        handleDenunciasPageChange(paginaAtualDenuncias - 1);
                      }}
                      disabled={paginaAtualDenuncias === 0}
                    />

                    {Array.from({ length: totalPaginasDenuncias }, (_, i) => (
                      <Pagination.Item
                        key={i}
                        active={i === paginaAtualDenuncias}
                        onClick={() => {
                          console.log(`📄 Página ${i + 1} de denúncias`);
                          handleDenunciasPageChange(i);
                        }}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next
                      onClick={() => {
                        console.log("📄 Próxima página de denúncias");
                        handleDenunciasPageChange(paginaAtualDenuncias + 1);
                      }}
                      disabled={
                        paginaAtualDenuncias >= totalPaginasDenuncias - 1
                      }
                    />
                    <Pagination.Last
                      onClick={() => {
                        console.log("📄 Última página de denúncias");
                        handleDenunciasPageChange(totalPaginasDenuncias - 1);
                      }}
                      disabled={
                        paginaAtualDenuncias >= totalPaginasDenuncias - 1
                      }
                    />
                  </Pagination>
                </div>
              )}
            </Tab>

            {/* ABA 4: GERENCIAR CONTATOS - PAGINAÇÃO CORRIGIDA */}
            <Tab eventKey="gerenciarContatos" title="Gerenciar Contatos">
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <small className={dark ? "text-light" : "text-muted"}>
                  Mostrando {contatos.length} contatos - Página{" "}
                  {paginaAtualContatos + 1} de {totalPaginasContatos}
                </small>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => {
                    console.log("🔧 Debug - Forçando reload de contatos");
                    api
                      .get(
                        `/contatos?page=${paginaAtualContatos}&size=5&sort=idContato,desc`
                      )
                      .then((response) => {
                        console.log("📊 Response completa:", response.data);
                        setContatos(response.data.content || []);
                        setTotalPaginasContatos(
                          response.data.page?.totalPages || 0
                        );
                      });
                  }}
                >
                  <i className="bi bi-arrow-repeat pe-1"></i>Atualizar
                </Button>
              </div>

              <Table
                striped
                bordered
                hover
                responsive="sm"
                variant={dark ? "dark" : ""}
                className="admin-table"
                style={{ verticalAlign: "middle" }}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th style={{ textAlign: "center" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contatos.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        {loading
                          ? "Carregando contatos..."
                          : "Nenhum contato encontrado"}
                      </td>
                    </tr>
                  ) : (
                    contatos.map((contato) => (
                      <tr key={contato.idContato}>
                        <td>{contato.idContato}</td>
                        <td>{contato.nome}</td>
                        <td>{contato.email}</td>
                        <td
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <div className="d-flex justify-content-center gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => setContatoToView(contato)}
                            >
                              Visualizar Mensagem
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => setContatoToDelete(contato)}
                            >
                              Deletar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              {/* PAGINAÇÃO CORRIGIDA */}
              {totalPaginasContatos > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination className="admin-pagination">
                    <Pagination.First
                      onClick={() => {
                        console.log("📄 Primeira página de contatos");
                        handleContatosPageChange(0);
                      }}
                      disabled={paginaAtualContatos === 0}
                    />
                    <Pagination.Prev
                      onClick={() => {
                        console.log("📄 Página anterior de contatos");
                        handleContatosPageChange(paginaAtualContatos - 1);
                      }}
                      disabled={paginaAtualContatos === 0}
                    />

                    {Array.from({ length: totalPaginasContatos }, (_, i) => (
                      <Pagination.Item
                        key={i}
                        active={i === paginaAtualContatos}
                        onClick={() => {
                          console.log(`📄 Página ${i + 1} de contatos`);
                          handleContatosPageChange(i);
                        }}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}

                    <Pagination.Next
                      onClick={() => {
                        console.log("📄 Próxima página de contatos");
                        handleContatosPageChange(paginaAtualContatos + 1);
                      }}
                      disabled={paginaAtualContatos >= totalPaginasContatos - 1}
                    />
                    <Pagination.Last
                      onClick={() => {
                        console.log("📄 Última página de contatos");
                        handleContatosPageChange(totalPaginasContatos - 1);
                      }}
                      disabled={paginaAtualContatos >= totalPaginasContatos - 1}
                    />
                  </Pagination>
                </div>
              )}
            </Tab>
          </Tabs>
        </Container>
      </main>
      {/* === MODAIS === */}
      {/* Modal de confirmação de exclusão de usuário */}
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

      {/* Modal de confirmação de exclusão de denúncia */}
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

      {/* Modal de confirmação de exclusão de contato */}
      <Modal
        show={!!contatoToDelete}
        onHide={() => setContatoToDelete(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja deletar a mensagem de{" "}
          <strong>{contatoToDelete?.nome}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setContatoToDelete(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteContato}>
            Confirmar Exclusão
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de edição de usuário */}
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
                onAccept={handleEditUserTelefoneChange}
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
                  <option value="PSICOLOGO">PSICÓLOGO</option>
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

      {/* Modal de edição de denúncia - CORRIGIDO */}
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
                    ? new Date(editDenunciaFormData.data).toLocaleString(
                        "pt-BR"
                      )
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
              <Button
                variant="secondary"
                onClick={() => setDenunciaToEdit(null)}
              >
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                Salvar Alterações
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de visualização de contato */}
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
