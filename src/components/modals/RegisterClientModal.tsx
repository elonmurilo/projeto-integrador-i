import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { supabase } from "../../config/supabase";
import axios from "axios";

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
    cpf_cnpj: "",
    cep: "",
    ende: "",
    bairro: "",
    cidade: "",
    estado: "",
    mail: "",
    tel1: "",
    tel2: "",
    marca: "",
    modelo: "",
    ano: "",
    cor: "",
    placa: "",
    id_por: 1,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(
    null
  );

  useEffect(() => {
    if (clienteEditando) {
      setForm({
        nome: clienteEditando.nome || "",
        cpf_cnpj: clienteEditando.cpf_cnpj || "",
        cep: clienteEditando.cep || "",
        ende: clienteEditando.ende || "",
        bairro: clienteEditando.bairro || "",
        cidade: clienteEditando.cidade || "",
        estado: clienteEditando.estado || "",
        mail: clienteEditando.mail || "",
        tel1: clienteEditando.tel1 || "",
        tel2: clienteEditando.tel2 || "",
        marca: clienteEditando.carros?.[0]?.marca || "",
        modelo: clienteEditando.carros?.[0]?.modelo || "",
        ano: clienteEditando.carros?.[0]?.ano || "",
        cor: clienteEditando.carros?.[0]?.cor || "",
        placa: clienteEditando.carros?.[0]?.placas?.placa || "",
        id_por: clienteEditando.carros?.[0]?.id_por || 1,
      });
    } else {
      setForm({
        nome: "",
        cpf_cnpj: "",
        cep: "",
        ende: "",
        bairro: "",
        cidade: "",
        estado: "",
        mail: "",
        tel1: "",
        tel2: "",
        marca: "",
        modelo: "",
        ano: "",
        cor: "",
        placa: "",
        id_por: 1,
      });
    }
  }, [clienteEditando]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "cep" && value.length === 9) {
      fetchAddressByCep(value);
    }
  };

  interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge?: string;
    gia?: string;
    ddd?: string;
    siafi?: string;
    erro?: boolean; // <- opcional, conforme a documentação
  }

  const fetchAddressByCep = async (cep: string) => {
    try {
      const cleanCep = cep.replace(/\D/g, "");
      const { data } = await axios.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );

      if (data && !data.erro) {
        setForm((prev) => ({
          ...prev,
          ende: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      } else {
        setMessage({ text: "CEP não encontrado.", type: "warning" });
      }
    } catch {
      setMessage({ text: "Erro ao buscar o CEP.", type: "danger" });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      let clienteId = clienteEditando?.id_cli;

      // === 1️⃣ Upsert do cliente ===
      const { data: clienteData, error: clienteError } = await supabase
        .from("clientes")
        .upsert(
          {
            id_cli: clienteId,
            nome: form.nome,
            cpf_cnpj: form.cpf_cnpj,
            cep: form.cep,
            ende: form.ende,
            bairro: form.bairro,
            cidade: form.cidade,
            estado: form.estado,
            mail: form.mail,
            tel1: form.tel1,
            tel2: form.tel2,
          },
          { onConflict: "id_cli" }
        )
        .select();

      if (clienteError) throw clienteError;

      const savedClient = clienteData?.[0];
      clienteId = savedClient.id_cli;

      // === 2️⃣ Upsert da placa ===
      let placaId: number | null = null;
      if (form.placa) {
        const { data: placaData, error: placaError } = await supabase
          .from("placas")
          .upsert(
            {
              placa: form.placa,
              id_cli: clienteId,
            },
            { onConflict: "placa" }
          )
          .select();

        if (placaError) throw placaError;
        placaId = placaData?.[0]?.id_pla || null;
      }

      // === 3️⃣ Upsert do carro ===
      if (placaId) {
        const { error: carError } = await supabase.from("carros").upsert(
          {
            marca: form.marca,
            modelo: form.modelo,
            ano: form.ano,
            cor: form.cor,
            id_por: form.id_por,
            id_cli: clienteId,
            id_pla: placaId,
          },
          { onConflict: "id_cli" }
        );

        if (carError) throw carError;
      }

      setMessage({ text: "Cliente salvo com sucesso!", type: "success" });
      onSuccess();
      setTimeout(() => onHide(), 800);
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error);
      setMessage({
        text: `Erro ao salvar: ${error.message || "tente novamente"}`,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {clienteEditando ? "Editar Cliente" : "Cadastrar Novo Cliente"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && (
          <Alert variant={message.type} className="text-center">
            {message.text}
          </Alert>
        )}

        <h5>🧍 Dados do Cliente</h5>
        <Form className="mb-4">
          <div className="row">
            <div className="col-md-8 mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <Form.Label>CPF/CNPJ</Form.Label>
              <Form.Control
                type="text"
                name="cpf_cnpj"
                value={form.cpf_cnpj}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-3 mb-3">
              <Form.Label>CEP</Form.Label>
              <Form.Control
                type="text"
                name="cep"
                value={form.cep}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-5 mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                name="ende"
                value={form.ende}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                type="text"
                name="bairro"
                value={form.bairro}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2 mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                name="estado"
                value={form.estado}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                name="mail"
                value={form.mail}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2 mb-3">
              <Form.Label>Telefone 1</Form.Label>
              <Form.Control
                type="text"
                name="tel1"
                value={form.tel1}
                onChange={handleChange}
              />
            </div>
          </div>
        </Form>

        <h5>🚗 Dados do Veículo</h5>
        <Form>
          <div className="row">
            <div className="col-md-3 mb-3">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="text"
                name="marca"
                value={form.marca}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <Form.Label>Modelo</Form.Label>
              <Form.Control
                type="text"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2 mb-3">
              <Form.Label>Ano</Form.Label>
              <Form.Control
                type="text"
                name="ano"
                value={form.ano}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2 mb-3">
              <Form.Label>Cor</Form.Label>
              <Form.Control
                type="text"
                name="cor"
                value={form.cor}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-2 mb-3">
              <Form.Label>Placa</Form.Label>
              <Form.Control
                type="text"
                name="placa"
                value={form.placa}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <Form.Label>Porte</Form.Label>
              <Form.Select
                name="id_por"
                value={form.id_por}
                onChange={handleChange}
              >
                <option value={1}>Pequeno</option>
                <option value={2}>Médio</option>
                <option value={3}>Grande</option>
              </Form.Select>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Salvar Alterações"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
