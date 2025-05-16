import React, { useState, useEffect } from "react";
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
    id_por: "",
    id_lavserv: "",
    valor: "",
  });

  const [portes, setPortes] = useState<any[]>([]);
  const [lavagens, setLavagens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const servico = servicoEditando;

  useEffect(() => {
    const fetchOptions = async () => {
      const [porteRes, lavagemRes] = await Promise.all([
        supabase.from("porte").select("id_por, porte").order("id_por"),
        supabase.from("lavagem_servico").select("id_lavserv, lavtipo").order("id_lavserv"),
      ]);

      if (!porteRes.error && porteRes.data) setPortes(porteRes.data);
      if (!lavagemRes.error && lavagemRes.data) setLavagens(lavagemRes.data);
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (servico) {
      setForm({
        id_por: String(servico.id_por || ""),
        id_lavserv: String(servico.id_lavserv || ""),
        valor: String(servico.valor || ""),
      });
    } else {
      setForm({
        id_por: "",
        id_lavserv: "",
        valor: "",
      });
    }
  }, [servico]);

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
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
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{servico ? "Editar Serviço" : "Cadastrar Serviço"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tipo de Lavagem</Form.Label>
                <Form.Select name="id_lavserv" value={form.id_lavserv} onChange={handleChange} required>
                  <option value="">Selecione</option>
                  {lavagens.map((l) => (
                    <option key={l.id_lavserv} value={l.id_lavserv}>
                      {l.lavtipo}
                    </option>
                  ))}
                </Form.Select>
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
            {loading ? <Spinner size="sm" animation="border" /> : "Salvar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
