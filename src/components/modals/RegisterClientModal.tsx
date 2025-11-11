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
    id_cli: null as number | null,
    id_car: null as number | null,
    id_pla: null as number | null,
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
        id_cli: clienteEditando.id_cli || null,
        id_car: clienteEditando.carros?.[0]?.id_car || null,
        id_pla: clienteEditando.carros?.[0]?.placas?.id_pla || null,
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
        id_cli: null,
        id_car: null,
        id_pla: null,
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
      let clientId = form.id_cli;
      let plateId = form.id_pla;
      let carId = form.id_car;

      // === 1️⃣ CLIENTE ===
      const clientData = {
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
      };

      if (!clientId) {
        const { data, error } = await supabase
          .from("clientes")
          .insert([clientData])
          .select("id_cli")
          .single();
        if (error) throw error;
        clientId = data.id_cli;
      } else {
        const { error } = await supabase
          .from("clientes")
          .update(clientData)
          .eq("id_cli", clientId);
        if (error) throw error;
      }

      // === 2️⃣ PLACA ===
      if (form.placa) {
        const plateData = {
          placa: form.placa,
          id_cli: clientId,
        };

        if (!plateId) {
          const { data, error } = await supabase
            .from("placas")
            .insert([plateData])
            .select("id_pla")
            .single();
          if (error) throw error;
          plateId = data.id_pla;
        } else {
          const { error } = await supabase
            .from("placas")
            .update(plateData)
            .eq("id_pla", plateId);
          if (error) throw error;
        }
      }

      // === 3️⃣ CARRO ===
      if (form.marca || form.modelo) {
        const carData = {
          marca: form.marca,
          modelo: form.modelo,
          ano: form.ano,
          cor: form.cor,
          id_por: form.id_por,
          id_cli: clientId,
          id_pla: plateId!,
        };

        if (!carId) {
          const { error } = await supabase.from("carros").insert([carData]);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("carros")
            .update(carData)
            .eq("id_car", carId);
          if (error) throw error;
        }
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
          {form.id_cli ? "Editar Cliente" : "Cadastrar Novo Cliente"}
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
            <div className="col-md-1 mb-3">
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
            <div className="col-md-3 mb-3">
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
