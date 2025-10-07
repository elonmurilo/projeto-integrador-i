import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { supabase } from "../../config/supabase";

const FeedbackModal: React.FC<{
  show: boolean;
  title: string;
  message: string;
  variant: "success" | "danger";
  onClose: () => void;
}> = ({ show, title, message, variant, onClose }) => (
  <Modal
    show={show}
    onHide={onClose}
    centered
    aria-labelledby="feedback-modal-title"
    role="alertdialog"
    aria-live="assertive"
  >
    <Modal.Header closeButton className={`bg-${variant} text-white`}>
      <Modal.Title id="feedback-modal-title">{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant={variant} onClick={onClose} aria-label="Fechar mensagem de confirmação">
        Confirmar
      </Button>
    </Modal.Footer>
  </Modal>
);

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
  const [showFeedback, setShowFeedback] = useState(false);
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
    if (!servico) {
      setForm({
        id_cli: "",
        id_car: "",
        data_rea: "",
        hora_rea: "",
        id_por: "",
        id_lavserv: [],
        valor: "",
      });
      return;
    }

    setForm({
      id_cli: String(servico.id_cli || servico.clientes?.id_cli || ""),
      id_car: String(servico.id_car || servico.carros?.id_car || ""),
      data_rea: servico.data_rea || "",
      hora_rea: servico.hora_rea || "",
      id_por: String(servico.carros?.id_por || servico.servicos?.id_por || ""),
      valor: String(servico.servicos?.valor || ""),
      id_lavserv: servico.agenda_servico?.map((s: any) => String(s.id_lavserv)) || [],
    });
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

    if (!form.valor || isNaN(parseFloat(form.valor))) {
      alert("Por favor, informe um valor válido para o serviço.");
      setLoading(false);
      return;
    }

    try {
      let idServ = servico?.id_serv || servico?.servicos?.id_serv;
      let idRea = servico?.id_rea || servico?.servicos?.id_rea;

      if (!idServ || !idRea) {
        alert("Erro interno: IDs não identificados para edição.");
        setLoading(false);
        return;
      }

      if (servico) {
        const { error: errServUpdate } = await supabase
          .from("servicos")
          .update({
            id_por: Number(form.id_por),
            valor: parseFloat(form.valor),
          })
          .eq("id_serv", idServ);
        if (errServUpdate) throw errServUpdate;

        const { error: errAgendaUpdate } = await supabase
          .from("agenda")
          .update({
            id_cli: Number(form.id_cli),
            id_car: Number(form.id_car),
            data_rea: form.data_rea,
            hora_rea: form.hora_rea,
          })
          .eq("id_rea", idRea);
        if (errAgendaUpdate) throw errAgendaUpdate;

        await supabase.from("agenda_servico").delete().eq("id_rea", idRea);

        const novosServicos = form.id_lavserv.map((idLav) => ({
          id_rea: idRea,
          id_lavserv: Number(idLav),
        }));

        const { error: errAgServInsert } = await supabase
          .from("agenda_servico")
          .insert(novosServicos);
        if (errAgServInsert) throw errAgServInsert;
      } else {
        const { data: servicoData, error: errServico } = await supabase
          .from("servicos")
          .insert([
            {
              id_por: Number(form.id_por),
              valor: parseFloat(form.valor),
            },
          ])
          .select()
          .single();
        if (errServico || !servicoData) throw errServico;
        idServ = servicoData.id_serv;

        const { data: agendaData, error: errAgenda } = await supabase
          .from("agenda")
          .insert([
            {
              id_cli: Number(form.id_cli),
              id_car: Number(form.id_car),
              id_serv: idServ,
              data_rea: form.data_rea,
              hora_rea: form.hora_rea,
            },
          ])
          .select()
          .single();
        if (errAgenda || !agendaData) throw errAgenda;
        idRea = agendaData.id_rea;

        const novosServicos = form.id_lavserv.map((idLav) => ({
          id_rea: idRea,
          id_lavserv: Number(idLav),
        }));

        const { error: errAgServ } = await supabase
          .from("agenda_servico")
          .insert(novosServicos);
        if (errAgServ) throw errAgServ;
      }

      setShowFeedback(true);
    } catch (err: any) {
      alert(err.message || "Erro ao salvar o serviço.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowFeedback(false);
    onSuccess();
    onHide();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
        aria-labelledby="register-service-modal-title"
        role="dialog"
      >
        <Form
          onSubmit={handleSubmit}
          aria-label="Formulário de cadastro de serviço"
        >
          <Modal.Header closeButton>
            <Modal.Title id="register-service-modal-title">
              {servico ? "Editar Serviço" : "Novo Serviço"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row className="mb-3">
              <Col md={8}>
                <Form.Group controlId="service-cliente">
                  <Form.Label>Nome do cliente</Form.Label>
                  <Form.Select
                    name="id_cli"
                    value={form.id_cli}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-label="Selecione o cliente"
                  >
                    <option value="">Selecione</option>
                    {clientes.map((c) => (
                      <option key={c.id_cli} value={c.id_cli}>
                        {c.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="service-data">
                  <Form.Label>Data do Agendamento</Form.Label>
                  <Form.Control
                    type="date"
                    name="data_rea"
                    value={form.data_rea}
                    onChange={handleChange}
                    required
                    aria-label="Data do agendamento"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={8}>
                <Form.Group controlId="service-carro">
                  <Form.Label>Carro</Form.Label>
                  <Form.Select
                    name="id_car"
                    value={form.id_car}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-label="Selecione o veículo"
                  >
                    <option value="">Selecione</option>
                    {carros.map((carro) => (
                      <option key={carro.id_car} value={carro.id_car}>
                        {carro.placas?.placa || "Sem placa"} — {carro.marca}{" "}
                        {carro.modelo}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="service-horario">
                  <Form.Label>Horário do Agendamento</Form.Label>
                  <Form.Control
                    type="time"
                    name="hora_rea"
                    value={form.hora_rea}
                    onChange={handleChange}
                    required
                    aria-label="Horário do agendamento"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="service-tipos">
              <Form.Label>Tipos de Serviço</Form.Label>
              <Row>
                {lavagens.map((l) => (
                  <Col key={l.id_lavserv} md={4} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      label={l.lavtipo}
                      value={l.id_lavserv}
                      checked={form.id_lavserv.includes(String(l.id_lavserv))}
                      aria-label={`Selecionar tipo de serviço ${l.lavtipo}`}
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
                  </Col>
                ))}
              </Row>
            </Form.Group>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="service-valor">
                  <Form.Label>Valor (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="valor"
                    value={form.valor}
                    onChange={handleChange}
                    required
                    aria-label="Valor total do serviço em reais"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={onHide}
              disabled={loading}
              aria-label="Cancelar e fechar formulário"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              aria-label={servico ? "Atualizar serviço" : "Cadastrar serviço"}
            >
              {loading ? (
                <Spinner
                  size="sm"
                  animation="border"
                  role="status"
                  aria-label="Carregando"
                />
              ) : servico ? (
                "Atualizar"
              ) : (
                "Cadastrar"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <FeedbackModal
        show={showFeedback}
        title="Sucesso!"
        message={`Serviço ${servico ? "atualizado" : "cadastrado"} com sucesso!`}
        variant="success"
        onClose={handleSuccessConfirm}
      />
    </>
  );
};
