import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export const useServices = () => {
  const [totalServices, setTotalServices] = useState<number>(0);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTotalServices = async () => {
    setLoading(true);
    const { count, error } = await supabase
      .from("services")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("Erro ao buscar total de serviços:", error.message);
    } else {
      setTotalServices(count || 0);
    }
    setLoading(false);
  };

  const fetchAllServices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("services").select("*");

    if (error) {
      console.error("Erro ao buscar todos os serviços:", error.message);
    } else {
      setAllServices(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTotalServices();
  }, []);

  return {
    totalServices,
    allServices,
    loading,
    fetchTotalServices,
    fetchAllServices,
    setAllServices,
  };
};
