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
      {user && <Sidebar />}
      <div
        className="container-fluid py-4"
        style={(styles.container, { paddingLeft: user ? 180 : 0 })}
      >
        <div>
          <h5 className="mb-4" style={{ paddingLeft: 80 }}>
            Olá {user?.user_metadata?.name || "Usuário"} 👋
          </h5>
        </div>

        <Header />

        <Clients isHomepage />
      </div>
    </div>
  );
};
