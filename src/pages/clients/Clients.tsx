import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Modal } from "react-bootstrap";
import { RegisterClientModal } from "../../components/modals/RegisterClientModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Search } from "../../components/common/Search";
import { useRegisterClient } from "../../hooks/useRegisterClient";
import { useClients } from "../../hooks/useClients";
import { useLocation } from "react-router-dom";
import "../../App.css";

interface ClientsProps {
  isHomepage?: boolean;
}

export const Clients: React.FC<ClientsProps> = ({ isHomepage }) => {
  const { user } = useAuth();
  const {
    fetchClients,
    clients,
    clienteExcluindo,
    setClienteExcluindo,
    loading,
    currentPage,
    setCurrentPage,
    totalClients,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    deleteClient,
  } = useClients();

  const {
    showModal,
    clienteEditando,
    openRegisterClientModal,
    closeRegisterClientModal,
  } = useRegisterClient();

  const totalPages = Math.ceil(totalClients / 10);
  const location = useLocation();

  // Detecta se é mobile para alternar entre tabela e cards
  const isMobile = window.innerWidth <= 768;

  return (
    <div
      className="clients-page"
      style={{
        ...(location.pathname === "/clientes" && { minHeight: "100vh" }),
      }}
    >
      <main
        className={`container-fluid py-4 ${!isHomepage ? "main-content" : ""}`}
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingInline: window.innerWidth > 991 ? "2rem" : "1rem",
          transition: "padding 0.3s ease",
        }}
      >
        {/* Saudação */}
        {!isHomepage && (
          <h5 className="mb-4 text-center text-md-start">
            Olá {user?.user_metadata?.name || "Usuário"} 👋
          </h5>
        )}

        {/* Seção principal */}
        <section
          className="container p-3 p-md-4 bg-white rounded shadow-sm"
          aria-label="Gerenciamento de clientes"
        >
          {/* Cabeçalho */}
          <header className="header-clientes">
            <h5 className="text-center text-md-start">Todos os Clientes</h5>

            <div className="actions">
              {!isHomepage && (
                <button
                  className="btn btn-primary"
                  onClick={() => openRegisterClientModal()}
                >
                  Cadastrar Novo Cliente
                </button>
              )}
              <Search
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />
            </div>
          </header>

          {/* Renderização híbrida */}
          {isMobile ? (
            <div className="client-cards mt-3">
              {loading && (
                <p className="text-center text-muted py-3">Carregando...</p>
              )}

              {!loading && clients.length === 0 && (
                <p className="text-center text-muted py-3">
                  Nenhum cliente encontrado.
                </p>
              )}

              {!loading &&
                clients.map((client, index) => (
                  <div key={index} className="client-card">
                    <div className="client-info">
                      <strong>{client.nome}</strong>
                      <p>📞 {client.tel1 || "—"}</p>
                      <p>📧 {client.mail || "—"}</p>
                      <p>
                        🚗 {client.carros?.[0]?.modelo || "—"} •{" "}
                        {client.carros?.[0]?.placas?.placa || "—"}
                      </p>
                    </div>
                    {!isHomepage && (
                      <div className="actions">
                        <FaEdit
                          title="Editar"
                          style={{ cursor: "pointer", color: "#6C2BD9" }}
                          onClick={() => openRegisterClientModal(client)}
                        />
                        <FaTrash
                          title="Excluir"
                          style={{ cursor: "pointer", color: "#D9534F" }}
                          onClick={() => setClienteExcluindo(client)}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="table-responsive mt-3">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nome do Cliente</th>
                    <th>Telefone</th>
                    <th>E-mail</th>
                    <th>Carro</th>
                    <th>Placa</th>
                    {!isHomepage && <th>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={7} className="text-center py-3">
                        Carregando...
                      </td>
                    </tr>
                  )}

                  {!loading && clients.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-3">
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    clients.map((client, index) => (
                      <tr key={index}>
                        <td>{client.nome}</td>
                        <td>{client.tel1}</td>
                        <td>{client.mail}</td>
                        <td>{client.carros?.[0]?.modelo || "—"}</td>
                        <td>{client.carros?.[0]?.placas?.placa || "—"}</td>
                        {!isHomepage && (
                          <td className="d-flex justify-content-evenly">
                            <FaEdit
                              style={{ cursor: "pointer", color: "#6C2BD9" }}
                              onClick={() => openRegisterClientModal(client)}
                            />
                            <FaTrash
                              style={{ cursor: "pointer", color: "#D9534F" }}
                              onClick={() => setClienteExcluindo(client)}
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginação */}
          <footer className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
            <small className="text-muted text-center text-md-start">
              Mostrando {clients.length} de {totalClients} cadastros encontrados
            </small>

            {totalPages > 1 && (
              <nav aria-label="Paginação dos clientes">
                <ul className="pagination pagination-sm mb-0 justify-content-center justify-content-md-end">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <span
                      className="page-link"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      role="button"
                    >
                      ‹
                    </span>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i + 1}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <span
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                        role="button"
                      >
                        {i + 1}
                      </span>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <span
                      className="page-link"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      role="button"
                    >
                      ›
                    </span>
                  </li>
                </ul>
              </nav>
            )}
          </footer>
        </section>
      </main>

      {/* Modais */}
      {showModal && (
        <RegisterClientModal
          show={showModal}
          onHide={closeRegisterClientModal}
          onSuccess={() => fetchClients(currentPage, searchTerm)}
          clienteEditando={clienteEditando}
        />
      )}

      <Modal
        show={!!clienteExcluindo}
        onHide={() => setClienteExcluindo(null)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza de que deseja remover o cliente{" "}
          <strong>{clienteExcluindo?.nome}</strong>? Esta ação não poderá ser
          desfeita.
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setClienteExcluindo(null)}
          >
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={deleteClient}>
            Confirmar Remoção
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
