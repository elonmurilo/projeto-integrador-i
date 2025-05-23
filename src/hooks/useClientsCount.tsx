import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export const useClientsCount = () => {
  const [totalClients, setTotalClients] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTotalClients = async () => {
    setLoading(true);
    const { count, error } = await supabase
      .from("clientes")
      .select("id_cli", { count: "exact", head: true });

    if (error) {
      console.error("Erro ao buscar total de clientes:", error.message);
    } else {
      setTotalClients(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTotalClients();
  }, []);

  return { totalClients, loading, fetchTotalClients };
};
