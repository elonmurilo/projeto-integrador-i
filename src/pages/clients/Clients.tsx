import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { Modal } from "react-bootstrap";
import { RegisterClientModal } from "../../components/modals/RegisterClientModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Search } from "../../components/common/Search";
import { useRegisterClient } from "../../hooks/useRegisterClient";
import { useClients } from "../../hooks/useClients";
import "../../App.css"; // garante que os estilos globais estejam aplicados

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

  return (
    <div style={{ backgroundColor: "#ddeeff", minHeight: "100vh" }}>
      {user && <Sidebar />}

      {/* 🔹 Área principal do conteúdo */}
      <main
        className={`container-fluid py-4 ${!isHomepage ? "main-content" : ""}`}
        style={{ paddingRight: "60px" }}
      >
        {/* Saudação do usuário */}
        {!isHomepage && (
          <h5 className="mb-4">
            Olá {user?.user_metadata?.name || "Usuário"} 👋
          </h5>
        )}

        <section
          className="container p-4 bg-white rounded shadow-sm"
          aria-label="Gerenciamento de clientes"
        >
          {/* Cabeçalho da seção de clientes */}
          <header className="header-clientes">
            <h5>Todos os Clientes</h5>

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

          {/* Tabela de clientes */}
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nome do Cliente</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Carro</th>
                  <th>Placa</th>
                  {!isHomepage ? <th>Ações</th> : null}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Carregando...
                    </td>
                  </tr>
                )}

                {!loading && clients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center">
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
                      {!isHomepage ? (
                        <td className="d-flex gap-2 justify-content-evenly">
                          <FaEdit
                            style={{ cursor: "pointer", color: "#6C2BD9" }}
                            onClick={() => openRegisterClientModal(client)}
                          />
                          <FaTrash
                            style={{ cursor: "pointer", color: "#D9534F" }}
                            onClick={() => setClienteExcluindo(client)}
                          />
                        </td>
                      ) : null}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <footer className="d-flex justify-content-between align-items-center mt-3">
            <small>
              Mostrando {clients.length} de {totalClients} cadastros encontrados
            </small>

            {totalPages > 1 && (
              <nav aria-label="Paginação dos clientes">
                <ul className="pagination pagination-sm mb-0">
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

      {/* Modal de cadastro/edição */}
      {showModal && (
        <RegisterClientModal
          show={showModal}
          onHide={closeRegisterClientModal}
          onSuccess={() => fetchClients(currentPage, searchTerm)}
          clienteEditando={clienteEditando}
        />
      )}

      {/* Modal de confirmação de exclusão */}
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
          <strong>{clienteExcluindo?.nome}</strong>? Esta ação não poderá ser desfeita.
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
