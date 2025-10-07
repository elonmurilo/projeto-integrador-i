import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { Button, Table, Spinner } from "react-bootstrap";
import { supabase } from "../../config/supabase";
import { RegisterServiceModal } from "../../components/modals/RegisterServiceModal";
import { FaEdit, FaTrash } from "react-icons/fa";

export const Services: React.FC = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [serviceEditing, setServiceEditing] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
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

  const handleDelete = async (agendamento: any) => {
    const confirmDelete = window.confirm(
      `Deseja realmente excluir o serviço agendado para ${agendamento.clientes?.nome}?`
    );
    if (!confirmDelete) return;

    try {
      const { error: errAgendaServico } = await supabase
        .from("agenda_servico")
        .delete()
        .eq("id_rea", agendamento.id_rea);
      if (errAgendaServico) throw errAgendaServico;

      const { error: errAgenda } = await supabase
        .from("agenda")
        .delete()
        .eq("id_rea", agendamento.id_rea);
      if (errAgenda) throw errAgenda;

      const { error: errServico } = await supabase
        .from("servicos")
        .delete()
        .eq("id_serv", agendamento.servicos?.id_serv);
      if (errServico) throw errServico;

      fetchServicos();
    } catch (error) {
      alert("Erro ao excluir serviço. Tente novamente.");
    }
  };

  return (
    <div style={{ backgroundColor: "#eef4ff", minHeight: "100vh" }}>
      {user && <Sidebar />}

      {/* Ajuste de responsividade: padding controlado via CSS */}
      <main className="container-fluid py-4 main-content">
        <header className="mb-4">
          <h5>Olá {user?.user_metadata?.name || "Usuário"} 👋</h5>
        </header>

        <section
          className="container p-4 bg-white rounded shadow-sm"
          aria-label="Gerenciamento de serviços"
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
            <Button
              variant="primary"
              style={{ backgroundColor: "#B197FC", border: "none" }}
              onClick={() => {
                setServiceEditing(null);
                setShowModal(true);
              }}
              aria-label="Cadastrar novo serviço"
              title="Cadastrar novo serviço"
            >
              Cadastrar Novo Serviço
            </Button>
          </div>

          <div aria-live="polite">
            <Table bordered hover responsive>
              <thead className="table-light">
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Carro</th>
                  <th scope="col">Porte</th>
                  <th scope="col">Data</th>
                  <th scope="col">Hora</th>
                  <th scope="col">Valor (R$)</th>
                  <th scope="col">Ações</th>
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
                          aria-label={`Editar serviço de ${a.clientes?.nome}`}
                          title="Editar serviço"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(a)}
                          className="btn btn-sm btn-outline-danger"
                          aria-label={`Excluir serviço de ${a.clientes?.nome}`}
                          title="Excluir serviço"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>

          {totalRecords > pageSize && (
            <nav
              className="d-flex justify-content-between align-items-center mt-3"
              aria-label="Paginação dos serviços"
            >
              <small>
                Mostrando {agendamentos.length} de {totalRecords} agendamentos
                encontrados
              </small>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    aria-label="Página anterior"
                  >
                    ‹
                  </button>
                </li>
                {Array.from({ length: Math.ceil(totalRecords / pageSize) }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                      aria-label={`Ir para página ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === Math.ceil(totalRecords / pageSize)
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, Math.ceil(totalRecords / pageSize))
                      )
                    }
                    aria-label="Próxima página"
                  >
                    ›
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </section>
      </main>

      {showModal && (
        <RegisterServiceModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSuccess={fetchServicos}
          servicoEditando={serviceEditing}
        />
      )}
    </div>
  );
};
