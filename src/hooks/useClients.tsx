import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export const useClients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [clienteExcluindo, setClienteExcluindo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("nome_asc");
  const pageSize = 10;

  const fetchClients = async (page: number, search: string = "") => {
    setLoading(true);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const orderBy =
      sortOrder === "recentes"
        ? { column: "id_cli", ascending: false }
        : sortOrder === "antigos"
        ? { column: "id_cli", ascending: true }
        : { column: "nome", ascending: true };

    const query = supabase
      .from("clientes")
      .select(
        `
        id_cli,
        nome,
        tel1,
        tel2,
        mail,
        cpf_cnpj,
        cep,
        ende,
        bairro,
        cidade,
        estado,
        carros (
          id_car,
          modelo,
          marca,
          ano,
          cor,
          id_por,
          placas (id_pla, placa)
        )
        `,
        { count: "exact" }
      )
      .range(from, to)
      .order(orderBy.column, { ascending: orderBy.ascending });

    if (search) {
      query.ilike("nome", `%${search}%`);
    }

    const [{ data, error }, { count }] = await Promise.all([
      query,
      supabase
        .from("clientes")
        .select("id_cli", { count: "exact", head: true })
        .ilike("nome", `%${search}%`),
    ]);

    if (error) {
      console.error("Erro ao buscar clientes:", error.message);
    } else {
      setClients(data || []);
      setTotalClients(count || 0);
    }

    setLoading(false);
  };

  const deleteClient = async () => {
    if (!clienteExcluindo) return;

    const id_cli = clienteExcluindo.id_cli;
    const carros = clienteExcluindo.carros || [];
    const carro = carros[0];

    setLoading(true);

    try {
      // Remove vínculos dependentes primeiro (se existirem)
      if (carro) {
        if (carro.id_car) {
          const { error: errCar } = await supabase
            .from("carros")
            .delete()
            .eq("id_car", carro.id_car);
          if (errCar) throw errCar;
        }

        if (carro.placas?.id_pla) {
          const { error: errPla } = await supabase
            .from("placas")
            .delete()
            .eq("id_pla", carro.placas.id_pla);
          if (errPla) throw errPla;
        }
      }

      // Remove o cliente
      const { error: errCliente } = await supabase
        .from("clientes")
        .delete()
        .eq("id_cli", id_cli);

      if (errCliente) throw errCliente;

      // Atualiza listagem após a exclusão
      await fetchClients(currentPage, searchTerm);

      console.info(`Cliente ${id_cli} excluído com sucesso.`);
    } catch (error: any) {
      console.error("Erro ao excluir cliente:", error.message || error);
      alert("Erro ao excluir cliente. Verifique o console para mais detalhes.");
    } finally {
      setClienteExcluindo(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(currentPage, searchTerm);
  }, [currentPage, searchTerm, sortOrder]);

  return {
    fetchClients,
    clients,
    clienteExcluindo,
    setClienteExcluindo,
    loading,
    currentPage,
    setCurrentPage,
    totalClients,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    deleteClient,
  };
};
