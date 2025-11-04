import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { IncomeHeader } from "./components/IncomeHeader";
import { IncomeGoals } from "./components/IncomeGoals";
import "../../App.css";

export const Income: React.FC = () => {
  const { user } = useAuth();

  return (
    <div
      className="income-page"
      style={{
        backgroundColor: "#ddeeff",
        minHeight: "100vh",
      }}
    >
      <main
        className="container-fluid py-4 main-content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingInline: window.innerWidth > 991 ? "2rem" : "1rem",
          transition: "padding 0.3s ease",
        }}
      >
        {/* Cabeçalho e cartões de indicadores */}
        <section className="container p-3 p-md-4 bg-white rounded shadow-sm mb-4">
          <IncomeHeader user={user} />
        </section>

        {/* Metas e faturamento */}
        <section className="container p-3 p-md-4 bg-white rounded shadow-sm">
          <IncomeGoals />
        </section>
      </main>
    </div>
  );
};
