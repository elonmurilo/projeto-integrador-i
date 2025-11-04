import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Spinner, Modal } from "react-bootstrap";
import { supabase } from "../../config/supabase";
import { RegisterServiceModal } from "../../components/modals/RegisterServiceModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../../App.css";

export const Services: React.FC = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [serviceEditing, setServiceEditing] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [serviceDeleting, setServiceDeleting] = useState<any | null>(null);
  const pageSize = 10;

  const fetchServicos = async () => {
    setLoading(true);
    const from = (currentPage - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("agenda")
      .select(
        `
        id_rea,
        data_rea,
        hora_rea,
        id_cli,
        id_car,
        clientes (id_cli, nome),
        carros (id_car, modelo, marca, id_por, placas (placa)),
        servicos (id_serv, id_por, valor),
        agenda_servico (id_lavserv)
      `,
        { count: "exact" }
      )
      .order("data_rea", { ascending: false })
      .order("hora_rea", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Erro ao buscar agendamentos:", error);
    } else {
      setAgendamentos(data || []);
      setTotalRecords(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServicos();
  }, [currentPage]);

  const handleEdit = (servico: any) => {
    setServiceEditing(servico);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!serviceDeleting) return;

    try {
      const { error: errAgendaServico } = await supabase
        .from("agenda_servico")
        .delete()
        .eq("id_rea", serviceDeleting.id_rea);
      if (errAgendaServico) throw errAgendaServico;

      const { error: errAgenda } = await supabase
        .from("agenda")
        .delete()
        .eq("id_rea", serviceDeleting.id_rea);
      if (errAgenda) throw errAgenda;

      const { error: errServico } = await supabase
        .from("servicos")
        .delete()
        .eq("id_serv", serviceDeleting.servicos?.id_serv);
      if (errServico) throw errServico;

      setServiceDeleting(null);
      fetchServicos();
    } catch (error) {
      alert("Erro ao excluir serviço. Tente novamente.");
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);
  const isMobile = window.innerWidth <= 768;

  return (
    <div
      className="services-page"
      style={{
        backgroundColor: "#ddeeff",
        minHeight: "100vh",
      }}
    >
      <main
        className="container-fluid py-4 main-content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingInline: window.innerWidth > 991 ? "2rem" : "1rem",
          transition: "padding 0.3s ease",
        }}
      >
        <header className="mb-4 text-center text-md-start">
          <h5>Olá {user?.user_metadata?.name || "Usuário"} 👋</h5>
        </header>

        <section
          className="container p-3 p-md-4 bg-white rounded shadow-sm"
          aria-label="Gerenciamento de serviços"
        >
          <header className="d-flex justify-content-between align-items-center flex-wrap mb-3">
            <h5 className="text-center text-md-start mb-3 mb-md-0">
              Todos os Serviços
            </h5>
            <Button
              variant="primary"
              style={{ backgroundColor: "#B197FC", border: "none" }}
              onClick={() => {
                setServiceEditing(null);
                setShowModal(true);
              }}
            >
              Cadastrar Novo Serviço
            </Button>
          </header>

          {/* Renderização híbrida */}
          {isMobile ? (
            <div className="service-cards mt-3">
              {loading && (
                <p className="text-center text-muted py-3">
                  <Spinner animation="border" size="sm" /> Carregando...
                </p>
              )}
              {!loading && agendamentos.length === 0 && (
                <p className="text-center text-muted py-3">
                  Nenhum serviço agendado.
                </p>
              )}
              {!loading &&
                agendamentos.map((a) => (
                  <div key={a.id_rea} className="service-card">
                    <div className="service-info">
                      <strong>{a.clientes?.nome}</strong>
                      <p>
                        🚗 {a.carros?.marca} {a.carros?.modelo} —{" "}
                        {a.carros?.placas?.placa || "—"}
                      </p>
                      <p>📅 {a.data_rea} às {a.hora_rea}</p>
                      <p>💰 R$ {parseFloat(a.servicos?.valor || 0).toFixed(2)}</p>
                    </div>
                    <div className="actions">
                      <FaEdit
                        style={{ cursor: "pointer", color: "#6C2BD9" }}
                        onClick={() => handleEdit(a)}
                      />
                      <FaTrash
                        style={{ cursor: "pointer", color: "#D9534F" }}
                        onClick={() => setServiceDeleting(a)}
                      />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Cliente</th>
                    <th>Carro</th>
                    <th>Porte</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Valor (R$)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={7} className="text-center">
                        <Spinner animation="border" size="sm" /> Carregando...
                      </td>
                    </tr>
                  )}
                  {!loading && agendamentos.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center">
                        Nenhum serviço agendado.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    agendamentos.map((a) => (
                      <tr key={a.id_rea}>
                        <td>{a.clientes?.nome}</td>
                        <td>
                          {a.carros?.placas?.placa || "—"} — {a.carros?.marca}{" "}
                          {a.carros?.modelo}
                        </td>
                        <td>{a.carros?.id_por}</td>
                        <td>{a.data_rea}</td>
                        <td>{a.hora_rea}</td>
                        <td>{parseFloat(a.servicos?.valor || 0).toFixed(2)}</td>
                        <td className="d-flex gap-2 justify-content-center">
                          <button
                            onClick={() => handleEdit(a)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setServiceDeleting(a)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <footer className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
              <small className="text-muted">
                Mostrando {agendamentos.length} de {totalRecords} registros
              </small>
              <ul className="pagination pagination-sm mb-0 justify-content-center justify-content-md-end">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    ‹
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    ›
                  </button>
                </li>
              </ul>
            </footer>
          )}
        </section>
      </main>

      {/* Modal de cadastro/edição */}
      {showModal && (
        <RegisterServiceModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSuccess={fetchServicos}
          servicoEditando={serviceEditing}
        />
      )}

      {/* Modal de exclusão */}
      <Modal show={!!serviceDeleting} onHide={() => setServiceDeleting(null)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja realmente excluir o serviço agendado para{" "}
          <strong>{serviceDeleting?.clientes?.nome}</strong>? Esta ação não poderá ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setServiceDeleting(null)}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Confirmar Remoção
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
