import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export const useDailyServices = () => {
  const [dailyServices, setDailyServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDailyServices = async () => {
    setLoading(true);

    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000; // Offset em milissegundos

    const startOfDay = new Date(
      today.setHours(0, 0, 0, 0) - timezoneOffset
    ).toISOString();
    const endOfDay = new Date(
      today.setHours(23, 59, 59, 999) - timezoneOffset
    ).toISOString();

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .gte("service_created_date", startOfDay)
      .lte("service_created_date", endOfDay);

    console.log("Data fetched:", data);
    if (error) {
      console.error("Erro ao buscar serviços do dia:", error.message);
    } else {
      console.log("Serviços do dia:", data);
      setDailyServices(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDailyServices();
  }, []);

  return { dailyServices, loading, fetchDailyServices };
};
