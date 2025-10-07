import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
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

interface RegisterClientModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  clienteEditando?: any;
}

export const RegisterClientModal: React.FC<RegisterClientModalProps> = ({
  show,
  onHide,
  onSuccess,
  clienteEditando,
}) => {
  const [form, setForm] = useState({
    nome: "",
    ende: "",
    tel1: "",
    tel2: "",
    mail: "",
    cpf_cnpj: "",
    id_por: "",
    modelo: "",
    marca: "",
    ano: "",
    cor: "",
    placa: "",
  });

  const [portes, setPortes] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const cliente = clienteEditando;

  useEffect(() => {
    const fetchPortes = async () => {
      const { data, error } = await supabase
        .from("porte")
        .select("id_por, porte")
        .order("id_por");

      if (!error && data) {
        setPortes(data);
        setForm((prev) => ({
          ...prev,
          id_por:
            prev.id_por ||
            String(data.find((p) => p.id_por === 1)?.id_por || data[0]?.id_por || ""),
        }));
      }
    };
    fetchPortes();
  }, []);

  useEffect(() => {
    if (cliente) {
      setForm({
        nome: cliente.nome || "",
        ende: cliente.ende || "",
        tel1: cliente.tel1 || "",
        tel2: cliente.tel2 || "",
        mail: cliente.mail || "",
        cpf_cnpj: cliente.cpf_cnpj || "",
        id_por: String(cliente.carros?.[0]?.id_por || ""),
        modelo: cliente.carros?.[0]?.modelo || "",
        marca: cliente.carros?.[0]?.marca || "",
        ano: cliente.carros?.[0]?.ano || "",
        cor: cliente.carros?.[0]?.cor || "",
        placa: cliente.carros?.[0]?.placas?.placa || "",
      });
    }
  }, [cliente]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const idPorNumber = Number(form.id_por) || 1;
      // (processo de insert/update igual ao original)
      // ...
      setShowFeedback(true);
    } catch (err: any) {
      console.error("Erro ao salvar cliente:", err);
      setError(
        err?.message || JSON.stringify(err) || "Erro desconhecido ao salvar cliente."
      );
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
        size="xl"
        centered
        aria-labelledby="register-client-modal-title"
        role="dialog"
      >
        <Form onSubmit={handleSubmit} aria-label="Formulário de cadastro de cliente">
          <Modal.Header closeButton>
            <Modal.Title id="register-client-modal-title">
              {cliente ? "Editar Cliente" : "Cadastrar Novo Cliente"}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {error && (
              <Alert variant="danger" role="alert" aria-live="assertive">
                {error}
              </Alert>
            )}

            <h5 className="mb-3">🧝 Dados do Cliente</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="cliente-nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-label="Nome completo do cliente"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cliente-cpf">
                  <Form.Label>CPF/CNPJ</Form.Label>
                  <Form.Control
                    name="cpf_cnpj"
                    value={form.cpf_cnpj}
                    onChange={handleChange}
                    aria-label="CPF ou CNPJ do cliente"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={8}>
                <Form.Group controlId="cliente-endereco">
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control
                    name="ende"
                    value={form.ende}
                    onChange={handleChange}
                    aria-label="Endereço completo"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="cliente-email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="mail"
                    value={form.mail}
                    onChange={handleChange}
                    aria-label="E-mail do cliente"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="cliente-tel1">
                  <Form.Label>Telefone 1</Form.Label>
                  <Form.Control
                    name="tel1"
                    value={form.tel1}
                    onChange={handleChange}
                    aria-label="Telefone principal do cliente"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cliente-tel2">
                  <Form.Label>Telefone 2</Form.Label>
                  <Form.Control
                    name="tel2"
                    value={form.tel2}
                    onChange={handleChange}
                    aria-label="Telefone secundário do cliente"
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mb-3">🚗 Dados do Veículo</h5>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="veiculo-marca">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    name="marca"
                    value={form.marca}
                    onChange={handleChange}
                    aria-label="Marca do veículo"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="veiculo-modelo">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control
                    name="modelo"
                    value={form.modelo}
                    onChange={handleChange}
                    aria-label="Modelo do veículo"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="veiculo-ano">
                  <Form.Label>Ano</Form.Label>
                  <Form.Control
                    name="ano"
                    value={form.ano}
                    onChange={handleChange}
                    aria-label="Ano de fabricação do veículo"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="veiculo-cor">
                  <Form.Label>Cor</Form.Label>
                  <Form.Control
                    name="cor"
                    value={form.cor}
                    onChange={handleChange}
                    aria-label="Cor do veículo"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="veiculo-placa">
                  <Form.Label>Placa</Form.Label>
                  <Form.Control
                    name="placa"
                    value={form.placa}
                    onChange={handleChange}
                    aria-label="Placa do veículo"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="veiculo-porte">
                  <Form.Label>Porte do Veículo</Form.Label>
                  <Form.Select
                    name="id_por"
                    value={form.id_por}
                    onChange={handleChange}
                    required
                    aria-required="true"
                    aria-label="Selecione o porte do veículo"
                  >
                    {portes.map((p) => (
                      <option key={p.id_por} value={p.id_por}>
                        {p.porte}
                      </option>
                    ))}
                  </Form.Select>
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
              aria-label={cliente ? "Salvar alterações do cliente" : "Salvar novo cliente"}
            >
              {loading ? (
                <Spinner size="sm" animation="border" role="status" aria-label="Carregando" />
              ) : cliente ? (
                "Salvar Alterações"
              ) : (
                "Salvar Cliente"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <FeedbackModal
        show={showFeedback}
        title="Sucesso!"
        message={`Cliente ${cliente ? "atualizado" : "cadastrado"} com sucesso!`}
        variant="success"
        onClose={handleSuccessConfirm}
      />
    </>
  );
};
