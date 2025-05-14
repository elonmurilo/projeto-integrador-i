import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { Button, Modal } from "react-bootstrap";
import { supabase } from "../../config/supabase";
import { RegisterClientModal } from "../../components/modals/RegisterClientModal";
import { FaEdit, FaTrash } from "react-icons/fa";

export const Clients: React.FC = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [clienteEditando, setClienteEditando] = useState<any | null>(null);
  const [clienteExcluindo, setClienteExcluindo] = useState<any | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("nome_asc");
  const pageSize = 10;

  const fetchClients = async (page: number, search: string = "") => {
    setLoading(true);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const orderBy =
      sortOrder === "recentes"
        ? { column: "id_cli", ascending: false }
        : sortOrder === "antigos"
        ? { column: "id_cli", ascending: true }
        : { column: "nome", ascending: true };

    const query = supabase
      .from("clientes")
      .select(
        `id_cli, nome, tel1, mail, cpf_cnpj, ende, tel2, 
         carros (
           id_car, modelo, marca, ano, cor, id_por,
           placas (id_pla, placa)
         )`,
        { count: "exact" }
      )
      .range(from, to)
      .order(orderBy.column, { ascending: orderBy.ascending });

    if (search) {
      query.ilike("nome", `%${search}%`);
    }

    const [{ data, error }, { count }] = await Promise.all([
      query,
      supabase
        .from("clientes")
        .select("id_cli", { count: "exact", head: true })
        .ilike("nome", `%${search}%`),
    ]);

    if (error) {
      console.error("Erro ao buscar clientes:", error.message);
    } else {
      setClients(data || []);
      setTotalClients(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchClients(currentPage, searchTerm);
  }, [currentPage, searchTerm, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (client: any) => {
    setClienteEditando(client);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!clienteExcluindo) return;

    const id_cli = clienteExcluindo.id_cli;
    const carros = clienteExcluindo.carros || [];
    const carro = carros[0];

    try {
      // Deleta carro
      if (carro?.id_car) {
        await supabase.from("carros").delete().eq("id_car", carro.id_car);
      }

      // Deleta placa
      if (carro?.placas?.id_pla) {
        await supabase.from("placas").delete().eq("id_pla", carro.placas.id_pla);
      }

      // Deleta cliente
      const { error: errDelete } = await supabase.from("clientes").delete().eq("id_cli", id_cli);
      if (errDelete) throw errDelete;

      // Atualiza lista
      fetchClients(currentPage, searchTerm);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    } finally {
      setShowConfirmDelete(false);
      setClienteExcluindo(null);
    }
  };

  const totalPages = Math.ceil(totalClients / pageSize);

  return (
    <div style={{ backgroundColor: "#ddeeff", minHeight: "100vh" }}>
      {user && <Sidebar />}

      <div
        className="container-fluid py-4"
        style={{ paddingLeft: user ? 80 : 0, transition: "margin-left 0.3s ease" }}
      >
        <h5 className="mb-4" style={{ paddingLeft: 80 }}>
          Olá {user?.user_metadata?.name || "Usuário"} 👋
        </h5>

        <div
          className="container p-4"
          style={{
            backgroundColor: "#fff",
            borderRadius: "1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
            <Button
              variant="primary"
              style={{ backgroundColor: "#B197FC", border: "none" }}
              onClick={() => {
                setClienteEditando(null);
                setShowModal(true);
              }}
            >
              Cadastrar Novo Cliente
            </Button>

            <div className="d-flex gap-2 mt-2 mt-sm-0">
              <input
                type="text"
                placeholder="🔍 Procurar"
                className="form-control"
                value={searchTerm}
                onChange={handleSearch}
                style={{ maxWidth: "200px" }}
              />
              <select
                className="form-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ maxWidth: "150px" }}
              >
                <option value="recentes">Recentes</option>
                <option value="antigos">Antigos</option>
                <option value="nome_asc">Nome A-Z</option>
              </select>
            </div>
          </div>

          <h5 className="mb-3">Todos os Clientes</h5>

          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nome do Cliente</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Carro</th>
                  <th>Placa</th>
                  <th>Ações</th>
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
                      <td className="d-flex gap-2 justify-content-evenly">
                        <FaEdit
                          style={{ cursor: "pointer", color: "#6C2BD9" }}
                          onClick={() => handleEdit(client)}
                        />
                        <FaTrash
                          style={{ cursor: "pointer", color: "#D9534F" }}
                          onClick={() => {
                            setClienteExcluindo(client);
                            setShowConfirmDelete(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <small>
              Mostrando {clients.length} de {totalClients} cadastros encontrados
            </small>
            {totalPages > 1 && (
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <span
                      className="page-link"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      role="button"
                    >
                      ‹
                    </span>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i + 1}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <span
                      className="page-link"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      role="button"
                    >
                      ›
                    </span>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <RegisterClientModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSuccess={() => fetchClients(currentPage, searchTerm)}
          clienteEditando={clienteEditando}
        />
      )}

      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza de que deseja remover o cliente{" "}
          <strong>{clienteExcluindo?.nome}</strong>? Esta ação não poderá ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirmar Remoção
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};
