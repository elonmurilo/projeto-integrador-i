import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../../config/supabase";

/* === COMPONENTE DE FEEDBACK === */
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

/* === MODAL PRINCIPAL === */
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
    cep: "",
    ende: "",
    bairro: "",
    cidade: "",
    estado: "",
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
  const [loadingCep, setLoadingCep] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const cliente = clienteEditando;

  /* === Carregar portes === */
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

  /* === Preencher dados se for edição === */
  useEffect(() => {
    if (cliente) {
      setForm({
        nome: cliente.nome || "",
        cep: cliente.cep || "",
        ende: cliente.ende || "",
        bairro: cliente.bairro || "",
        cidade: cliente.cidade || "",
        estado: cliente.estado || "",
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

  /* === Atualização de campos === */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* === Consulta automática de CEP === */
  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (!cep || cep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      setLoadingCep(false);

      if (data.erro) {
        alert("CEP não encontrado!");
        return;
      }

      setForm((prev) => ({
        ...prev,
        ende: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setLoadingCep(false);
      alert("Não foi possível consultar o CEP.");
    }
  };

  /* === Salvar cliente === */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const idPorNumber = Number(form.id_por) || 1;

      // Exemplo: inserir ou atualizar cliente
      const { error } = await supabase
        .from("clientes")
        .upsert({
          nome: form.nome,
          cep: form.cep,
          ende: form.ende,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado,
          tel1: form.tel1,
          tel2: form.tel2,
          mail: form.mail,
          cpf_cnpj: form.cpf_cnpj,
        });

      if (error) throw error;

      setShowFeedback(true);
    } catch (err: any) {
      console.error("Erro ao salvar cliente:", err);
      setError(err?.message || "Erro desconhecido ao salvar cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowFeedback(false);
    onSuccess();
    onHide();
  };

  /* === Renderização === */
  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{cliente ? "Editar Cliente" : "Cadastrar Novo Cliente"}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            {/* === DADOS DO CLIENTE === */}
            <h5 className="mb-3">🧝 Dados do Cliente</h5>
            <Row className="mb-3">
              <Col md={7}>
                <Form.Group controlId="cliente-nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group controlId="cliente-cpf">
                  <Form.Label>CPF/CNPJ</Form.Label>
                  <Form.Control
                    name="cpf_cnpj"
                    value={form.cpf_cnpj}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={2}>
                <Form.Group controlId="cliente-cep">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    name="cep"
                    value={form.cep}
                    onChange={handleChange}
                    onBlur={handleCepBlur}
                    placeholder="Ex: 01310-000"
                  />
                  {loadingCep && (
                    <small className="text-muted">Consultando CEP...</small>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="cliente-endereco">
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control
                    name="ende"
                    value={form.ende}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="cliente-bairro">
                  <Form.Label>Bairro</Form.Label>
                  <Form.Control
                    name="bairro"
                    value={form.bairro}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="cliente-cidade">
                  <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    name="cidade"
                    value={form.cidade}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="cliente-estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Control
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    maxLength={2}
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group controlId="cliente-email">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="mail"
                    value={form.mail}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="cliente-tel1">
                  <Form.Label>Telefone 1</Form.Label>
                  <Form.Control
                    name="tel1"
                    value={form.tel1}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* === DADOS DO VEÍCULO === */}
            <h5 className="mb-3">🚗 Dados do Veículo</h5>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="veiculo-marca">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control name="marca" value={form.marca} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="veiculo-modelo">
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control name="modelo" value={form.modelo} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="veiculo-ano">
                  <Form.Label>Ano</Form.Label>
                  <Form.Control name="ano" value={form.ano} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="veiculo-cor">
                  <Form.Label>Cor</Form.Label>
                  <Form.Control name="cor" value={form.cor} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="veiculo-placa">
                  <Form.Label>Placa</Form.Label>
                  <Form.Control name="placa" value={form.placa} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="veiculo-porte">
                  <Form.Label>Porte</Form.Label>
                  <Form.Select
                    name="id_por"
                    value={form.id_por}
                    onChange={handleChange}
                    required
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
            <Button variant="secondary" onClick={onHide} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <Spinner size="sm" animation="border" role="status" />
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
