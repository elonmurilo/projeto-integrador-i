import React from "react";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { styles } from "./styles";
import { IncomeHeader } from "./components/IncomeHeader";
import { IncomeGoals } from "./components/IncomeGoals";

export const Income: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ backgroundColor: "#ddeeff", minHeight: "100vh" }}>
      {user && <Sidebar />}

      <main className="container-fluid py-4 main-content" style={styles.container}>
        <IncomeHeader user={user} />

        <div className="divider my-4" style={styles.divider} />

        <IncomeGoals />
      </main>
    </div>
  );
};
