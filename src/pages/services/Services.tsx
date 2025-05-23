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
    const confirm = window.confirm(
      `Deseja realmente excluir o serviço agendado para ${agendamento.clientes?.nome}?`
    );
    if (!confirm) return;

    // Exclui a agenda_servico, depois a agenda e o serviço vinculado
    const { error: errAgendaServico } = await supabase
      .from("agenda_servico")
      .delete()
      .eq("id_rea", agendamento.id_rea);

    if (errAgendaServico) return alert("Erro ao excluir tipos de serviço.");

    const { error: errAgenda } = await supabase
      .from("agenda")
      .delete()
      .eq("id_rea", agendamento.id_rea);

    if (errAgenda) return alert("Erro ao excluir agendamento.");

    const { error: errServico } = await supabase
      .from("servicos")
      .delete()
      .eq("id_serv", agendamento.servicos?.id_serv);

    if (errServico) return alert("Erro ao excluir serviço.");

    fetchServicos();
  };

  return (
    <div style={{ backgroundColor: "#eef4ff", minHeight: "100vh" }}>
      {user && <Sidebar />}
      <div className="container-fluid py-4" style={{ paddingLeft: 260 }}>
        <h5 className="mb-4">
          Olá {user?.user_metadata?.name || "Usuário"} 👋
        </h5>

        <div className="container p-4 bg-white rounded shadow-sm">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
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
          </div>

          <Table bordered hover>
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
                      {a.carros?.placas?.placa || "—"} — {a.carros?.marca}
                      {a.carros?.modelo}
                    </td>
                    <td>{a.carros?.id_por}</td>
                    <td>{a.data_rea}</td>
                    <td>{a.hora_rea}</td>
                    <td>{parseFloat(a.servicos?.valor || 0).toFixed(2)}</td>
                    <td className="d-flex gap-2">
                      <FaEdit
                        style={{ cursor: "pointer", color: "#6C2BD9" }}
                        onClick={() => handleEdit(a)}
                      />
                      <FaTrash
                        style={{ cursor: "pointer", color: "#dc3545" }}
                        onClick={() => handleDelete(a)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {totalRecords > pageSize && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small>
                Mostrando {agendamentos.length} de {totalRecords} agendamentos
                encontrados
              </small>
              <nav>
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
                  {Array.from(
                    { length: Math.ceil(totalRecords / pageSize) },
                    (_, i) => (
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
                    )
                  )}
                  <li
                    className={`page-item ${
                      currentPage === Math.ceil(totalRecords / pageSize)
                        ? "disabled"
                        : ""
                    }`}
                  >
                    <span
                      className="page-link"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, Math.ceil(totalRecords / pageSize))
                        )
                      }
                      role="button"
                    >
                      ›
                    </span>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

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
