import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export const useServices = () => {
  const [totalServices, setTotalServices] = useState<number>(0);
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

  useEffect(() => {
    fetchTotalServices();
  }, []);

  return { totalServices, loading, fetchTotalServices };
};
