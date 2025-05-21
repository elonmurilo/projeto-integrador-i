import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export const useDailyServices = () => {
  const [dailyServices, setDailyServices] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDailyServices = async () => {
    setLoading(true);

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { count, error } = await supabase
      .from("services")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfDay)
      .lte("created_at", endOfDay);

    if (error) {
      console.error("Erro ao buscar serviços do dia:", error.message);
    } else {
      setDailyServices(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDailyServices();
  }, []);

  return { dailyServices, loading, fetchDailyServices };
};
