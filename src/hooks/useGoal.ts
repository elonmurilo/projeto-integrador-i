import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

export const useGoal = () => {
  const [goal, setGoal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchGoal = async () => {
    setLoading(true);

    const { data: userData, error: userError } = await supabase.auth.getUser(); // Obter o usuário autenticado
    if (userError || !userData?.user) {
      console.error("Erro ao obter usuário autenticado:", userError?.message);
      setLoading(false);
      return;
    }

    const userId = userData.user.id; // Obter o ID do usuário

    const { data, error } = await supabase
      .from("goals")
      .select("goal_value")
      .eq("user_id", userId) // Filtrar pelo user_id
      .single();

    if (error) {
      console.error("Erro ao buscar meta:", error.message);
    } else if (data) {
      setGoal(data.goal_value);
    }

    setLoading(false);
  };

  const updateGoal = async (newGoal: number) => {
    const { data: userData, error: userError } = await supabase.auth.getUser(); // Obter o usuário autenticado
    if (userError || !userData?.user) {
      console.error("Erro ao obter usuário autenticado:", userError?.message);
      return;
    }

    const userId = userData.user.id; // Obter o ID do usuário

    const { error } = await supabase.from("goals").upsert(
      {
        user_id: userId, // Certifique-se de enviar o user_id
        goal_value: newGoal,
        goal_created_date: new Date().toISOString(),
      },
      { onConflict: "user_id" } // Especificar a coluna de conflito
    );

    if (error) {
      console.error("Erro ao salvar meta:", error.message);
    } else {
      setGoal(newGoal);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, []);

  return { goal, loading, fetchGoal, updateGoal };
};
