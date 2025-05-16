import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { Button, Table, Spinner } from "react-bootstrap";
import { supabase } from "../../config/supabase";
import { RegisterServiceModal } from "../../components/modals/RegisterServiceModal";
import { FaEdit, FaTrash } from "react-icons/fa";

export const Services: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [serviceEditing, setServiceEditing] = useState<any | null>(null);

  const [portes, setPortes] = useState<any>({});
  const [lavagens, setLavagens] = useState<any>({});

  const fetchServicos = async () => {
    setLoading(true);

    const [{ data: servicos }, { data: dadosPortes }, { data: dadosLavagens }] = await Promise.all([
      supabase.from("servicos").select("*"),
      supabase.from("porte").select("id_por, porte"),
      supabase.from("lavagem_servico").select("id_lavserv, lavtipo"),
    ]);

    if (dadosPortes) {
      const mapa = Object.fromEntries(dadosPortes.map((p) => [p.id_por, p.porte]));
      setPortes(mapa);
    }

    if (dadosLavagens) {
      const mapa = Object.fromEntries(dadosLavagens.map((l) => [l.id_lavserv, l.lavtipo]));
      setLavagens(mapa);
    }

    setServices(servicos || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchServicos();
  }, []);

  const handleEdit = (servico: any) => {
    setServiceEditing(servico);
    setShowModal(true);
  };

  const handleDelete = async (servico: any) => {
    const confirm = window.confirm(`Deseja realmente excluir o serviço para o porte "${portes[servico.id_por]}" e tipo de lavagem "${lavagens[servico.id_lavserv]}"?`);
    if (!confirm) return;

    const { error } = await supabase.from("servicos").delete().eq("id_serv", servico.id_serv);
    if (error) return alert("Erro ao excluir serviço.");
    fetchServicos();
  };

  return (
    <div style={{ backgroundColor: "#eef4ff", minHeight: "100vh" }}>
      {user && <Sidebar />}
      <div
        className="container-fluid py-4"
        style={{ paddingLeft: user ? 80 : 0 }}
      >
        <h5 className="mb-4" style={{ paddingLeft: 80 }}>
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

            <div className="d-flex gap-2 mt-2 mt-sm-0">
              <input
                type="text"
                placeholder="🔍 Procurar"
                className="form-control"
                style={{ maxWidth: "200px" }}
                disabled
              />
              <select
                className="form-select"
                style={{ maxWidth: "150px" }}
                disabled
              >
                <option>Ordenar por</option>
                <option value="porte">Porte</option>
                <option value="lavagem">Lavagem</option>
                <option value="valor_asc">Valor ↑</option>
                <option value="valor_desc">Valor ↓</option>
              </select>
            </div>
          </div>

          <Table bordered hover>
            <thead className="table-light">
              <tr>
                <th>Porte</th>
                <th>Tipo de Lavagem</th>
                <th>Valor (R$)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="text-center">
                    <Spinner animation="border" size="sm" /> Carregando...
                  </td>
                </tr>
              )}
              {!loading && services.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center">
                    Nenhum serviço cadastrado.
                  </td>
                </tr>
              )}
              {!loading &&
                services.map((servico) => (
                  <tr key={servico.id_serv}>
                    <td>{portes[servico.id_por]}</td>
                    <td>{lavagens[servico.id_lavserv]}</td>
                    <td>{parseFloat(servico.valor).toFixed(2)}</td>
                    <td className="d-flex gap-2">
                      <FaEdit
                        style={{ cursor: "pointer", color: "#6C2BD9" }}
                        onClick={() => handleEdit(servico)}
                      />
                      <FaTrash
                        style={{ cursor: "pointer", color: "#dc3545" }}
                        onClick={() => handleDelete(servico)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
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
