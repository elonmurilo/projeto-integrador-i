import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { styles } from "./styles";
import { Header } from "./components/Header";
import { Clients } from "../clients/Clients";

export const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ backgroundColor: "#ddeeff", minHeight: "100vh" }}>

      <main className="container-fluid py-4 main-content" style={styles.container}>
        <header className="mb-4">
          <h5>
            Olá {user?.user_metadata?.name || "Usuário"} 👋
          </h5>
        </header>

        <Header />

        <Clients isHomepage />
      </main>
    </div>
  );
};
