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
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton className={`bg-${variant} text-white`}>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant={variant} onClick={onClose}>
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
      const { data, error } = await supabase.from("porte").select("id_por, porte").order("id_por");

      if (!error && data) {
        setPortes(data);
        setForm(prev => ({
          ...prev,
          id_por: prev.id_por || String(data.find(p => p.id_por === 1)?.id_por || data[0]?.id_por || "")
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" && "checked" in e.target ? (e.target as HTMLInputElement).checked : undefined;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const idPorNumber = Number(form.id_por) || 1;

      if (cliente) {
        const carro = cliente.carros?.[0];
        const placaObj = carro?.placas;

        const { error: errUpdateCliente } = await supabase.from("clientes").update({
          nome: form.nome,
          ende: form.ende,
          tel1: form.tel1,
          tel2: form.tel2,
          mail: form.mail,
          cpf_cnpj: form.cpf_cnpj,
        }).eq("id_cli", cliente.id_cli);
        if (errUpdateCliente) throw errUpdateCliente;

        if (placaObj?.id_pla) {
          const { error: errUpdatePlaca } = await supabase
            .from("placas")
            .update({ placa: form.placa })
            .eq("id_pla", placaObj.id_pla);
          if (errUpdatePlaca) throw errUpdatePlaca;
        } else {
          const { error: errInsertPlaca } = await supabase
            .from("placas")
            .insert([{ placa: form.placa, id_cli: cliente.id_cli }]);
          if (errInsertPlaca) throw errInsertPlaca;
        }

        if (carro?.id_car) {
          const { error: errUpdateCarro } = await supabase
            .from("carros")
            .update({
              modelo: form.modelo,
              marca: form.marca,
              ano: form.ano,
              cor: form.cor,
              id_por: idPorNumber,
            })
            .eq("id_car", carro.id_car);
          if (errUpdateCarro) throw errUpdateCarro;
        } else {
          const { data: placaInserida, error: errBuscaPlaca } = await supabase
            .from("placas")
            .select("id_pla")
            .eq("placa", form.placa)
            .eq("id_cli", cliente.id_cli)
            .single();
          if (errBuscaPlaca || !placaInserida) throw errBuscaPlaca;

          const { error: errInsertCarro } = await supabase.from("carros").insert([{
            modelo: form.modelo,
            marca: form.marca,
            ano: form.ano,
            cor: form.cor,
            id_por: idPorNumber,
            id_pla: placaInserida.id_pla,
            id_cli: cliente.id_cli,
          }]);
          if (errInsertCarro) throw errInsertCarro;
        }
      } else {
        const { data: clienteData, error: errCliente } = await supabase
          .from("clientes")
          .insert([{
            nome: form.nome,
            ende: form.ende,
            tel1: form.tel1,
            tel2: form.tel2,
            mail: form.mail,
            cpf_cnpj: form.cpf_cnpj,
          }])
          .select()
          .single();

        if (errCliente || !clienteData?.id_cli) {
          console.error("Erro ao criar cliente:", errCliente);
          throw new Error("Erro ao criar cliente. Verifique os campos obrigatórios.");
        }

        const { data: placaData, error: errPlaca } = await supabase
          .from("placas")
          .insert([{ placa: form.placa, id_cli: clienteData.id_cli }])
          .select()
          .single();
        if (errPlaca || !placaData) throw errPlaca;

        const { error: errCarro } = await supabase.from("carros").insert([{
          modelo: form.modelo,
          marca: form.marca,
          ano: form.ano,
          cor: form.cor,
          id_pla: placaData.id_pla,
          id_cli: clienteData.id_cli,
          id_por: idPorNumber,
        }]);
        if (errCarro) throw errCarro;
      }

      setShowFeedback(true);
    } catch (err: any) {
      console.error("Erro ao salvar cliente:", err);
      setError(err?.message || JSON.stringify(err) || "Erro desconhecido ao salvar cliente.");
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
      <Modal show={show} onHide={onHide} size="xl" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{cliente ? "Editar Cliente" : "Cadastrar Novo Cliente"}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

            <h5 className="mb-3">🧝 Dados do Cliente</h5>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control name="nome" value={form.nome} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>CPF/CNPJ</Form.Label>
                  <Form.Control name="cpf_cnpj" value={form.cpf_cnpj} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Endereço</Form.Label>
                  <Form.Control name="ende" value={form.ende} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email" name="mail" value={form.mail} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Telefone 1</Form.Label>
                  <Form.Control name="tel1" value={form.tel1} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Telefone 2</Form.Label>
                  <Form.Control name="tel2" value={form.tel2} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mb-3">🚗 Dados do Veículo</h5>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Marca</Form.Label>
                  <Form.Control name="marca" value={form.marca} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Modelo</Form.Label>
                  <Form.Control name="modelo" value={form.modelo} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Ano</Form.Label>
                  <Form.Control name="ano" value={form.ano} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Cor</Form.Label>
                  <Form.Control name="cor" value={form.cor} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>Placa</Form.Label>
                  <Form.Control name="placa" value={form.placa} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Porte do Veículo</Form.Label>
                  <Form.Select name="id_por" value={form.id_por} onChange={handleChange} required>
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
              {loading ? <Spinner size="sm" animation="border" /> : cliente ? "Salvar Alterações" : "Salvar Cliente"}
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
