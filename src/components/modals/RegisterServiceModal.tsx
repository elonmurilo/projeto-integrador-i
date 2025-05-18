import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { supabase } from "../../config/supabase";

interface RegisterServiceModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  servicoEditando?: any;
}

export const RegisterServiceModal: React.FC<RegisterServiceModalProps> = ({
  show,
  onHide,
  onSuccess,
  servicoEditando,
}) => {
  const [form, setForm] = useState({
    id_cli: "",
    id_car: "",
    data_rea: "",
    hora_rea: "",
    id_por: "",
    id_lavserv: [] as string[],
    valor: "",
  });

  const [clientes, setClientes] = useState<any[]>([]);
  const [carros, setCarros] = useState<any[]>([]);
  const [portes, setPortes] = useState<any[]>([]);
  const [lavagens, setLavagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const servico = servicoEditando;

  useEffect(() => {
    const fetchData = async () => {
      const [cliRes, porRes, lavRes] = await Promise.all([
        supabase.from("clientes").select("id_cli, nome, cpf_cnpj"),
        supabase.from("porte").select("id_por, porte"),
        supabase.from("lavagem_servico").select("id_lavserv, lavtipo"),
      ]);
      if (!cliRes.error && cliRes.data) setClientes(cliRes.data);
      if (!porRes.error && porRes.data) setPortes(porRes.data);
      if (!lavRes.error && lavRes.data) setLavagens(lavRes.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (form.id_cli) {
      supabase
        .from("carros")
        .select("id_car, modelo, marca, cor, placas(placa)")
        .eq("id_cli", form.id_cli)
        .then(({ data }) => {
          if (data) setCarros(data);
        });
    } else {
      setCarros([]);
    }
  }, [form.id_cli]);

  useEffect(() => {
    if (servico) {
      setForm({
        id_cli: String(servico.id_cli || ""),
        id_car: String(servico.id_car || ""),
        data_rea: servico.data_rea || "",
        hora_rea: servico.hora_rea || "",
        id_por: String(servico.id_por || ""),
        id_lavserv: servico.id_lavserv ? [String(servico.id_lavserv)] : [],
        valor: String(servico.valor || ""),
      });
    } else {
      setForm({
        id_cli: "",
        id_car: "",
        data_rea: "",
        hora_rea: "",
        id_por: "",
        id_lavserv: [],
        valor: "",
      });
    }
  }, [servico]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      id_cli: Number(form.id_cli),
      id_car: Number(form.id_car),
      data_rea: form.data_rea,
      hora_rea: form.hora_rea,
      id_por: Number(form.id_por),
      id_lavserv: Number(form.id_lavserv),
      valor: parseFloat(form.valor),
    };

    try {
      if (servico) {
        const { error } = await supabase
          .from("servicos")
          .update(payload)
          .eq("id_serv", servico.id_serv);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("servicos").insert([payload]);
        if (error) throw error;
      }

      onSuccess();
      onHide();
    } catch (err: any) {
      alert(err.message || "Erro ao salvar o serviço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{servico ? "Editar Serviço" : "Novo Serviço"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nome do cliente</Form.Label>
                <Form.Select name="id_cli" value={form.id_cli} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {clientes.map((c) => (
                    <option key={c.id_cli} value={c.id_cli}>
                      {c.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Data do Agendamento</Form.Label>
                <Form.Control
                  type="date"
                  name="data_rea"
                  value={form.data_rea}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>CPF</Form.Label>
                <Form.Select name="id_car" value={form.id_car} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {carros.map((carro) => (
                    <option key={carro.id_car} value={carro.id_car}>
                      {carro.placas?.placa || "Sem placa"} — {carro.marca} {carro.modelo}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Horário do Agendamento</Form.Label>
                <Form.Control
                  type="time"
                  name="hora_rea"
                  value={form.hora_rea}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Porte do Veículo</Form.Label>
                <Form.Select name="id_por" value={form.id_por} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {portes.map((p) => (
                    <option key={p.id_por} value={p.id_por}>
                      {p.porte}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Tipos de Serviço</Form.Label>
                <div>
                  {lavagens.map((l) => (
                    <Form.Check
                      key={l.id_lavserv}
                      type="checkbox"
                      label={l.lavtipo}
                      value={l.id_lavserv}
                      checked={form.id_lavserv.includes(String(l.id_lavserv))}
                      onChange={(e) => {
                        const selectedId = String(e.target.value);
                        setForm((prev) => ({
                          ...prev,
                          id_lavserv: e.target.checked
                            ? [...prev.id_lavserv, selectedId]
                            : prev.id_lavserv.filter((id) => id !== selectedId),
                        }));
                      }}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Form.Label>Valor (R$)</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              name="valor"
              value={form.valor}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Cadastrar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
