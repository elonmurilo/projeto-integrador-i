import React from "react";
import "./Sidebar.css";
import {
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaMoneyBill,
  FaTags,
  FaQuestion,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { CiLogout } from "react-icons/ci";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao deslogar:", error.message);
      } else {
        console.log("Usuário deslogado com sucesso");
        navigate("/login");
      }
    } catch (err) {
      console.error("Erro inesperado ao deslogar:", err);
    }
  };

  return (
    <nav className="sidebar" aria-label="Menu principal">
      {/* Cabeçalho */}
      <div className="sidebar-header">
        <span className="logo-icon">
          <img src="/logo.png" alt="Logo CleanTrack" className="avatar" />
        </span>
        <span className="logo-text">CleanTrack</span>
      </div>

      {/* Menu principal */}
      <ul className="sidebar-menu">
        <li>
          <button
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => navigate("/")}
            aria-label="Ir para Página Inicial"
            aria-current={location.pathname === "/" ? "page" : undefined}
          >
            <FaHome aria-hidden="true" />
            <span>Página Inicial</span>
          </button>
        </li>

        <li>
          <button
            className={location.pathname === "/servicos" ? "active" : ""}
            onClick={() => navigate("/servicos")}
            aria-label="Ir para Serviços"
            aria-current={location.pathname === "/servicos" ? "page" : undefined}
          >
            <FaCalendarAlt aria-hidden="true" />
            <span>Serviços</span>
          </button>
        </li>

        <li>
          <button
            className={location.pathname.startsWith("/clientes") ? "active" : ""}
            onClick={() => navigate("/clientes")}
            aria-label="Ir para Clientes"
            aria-current={location.pathname.startsWith("/clientes") ? "page" : undefined}
          >
            <FaUser aria-hidden="true" />
            <span>Clientes</span>
          </button>
        </li>

        <li>
          <button
            className={location.pathname.startsWith("/faturamento") ? "active" : ""}
            onClick={() => navigate("/faturamento")}
            aria-label="Ir para Faturamento"
            aria-current={location.pathname.startsWith("/faturamento") ? "page" : undefined}
          >
            <FaMoneyBill aria-hidden="true" />
            <span>Faturamento</span>
          </button>
        </li>

        <li>
          <button
            className={location.pathname === "/promocoes" ? "active" : ""}
            onClick={() => navigate("/promocoes")}
            aria-label="Ir para Promoções"
            aria-current={location.pathname === "/promocoes" ? "page" : undefined}
          >
            <FaTags aria-hidden="true" />
            <span>Promoções</span>
          </button>
        </li>

        <li>
          <button
            className={location.pathname === "/ajuda" ? "active" : ""}
            onClick={() => navigate("/ajuda")}
            aria-label="Ir para Ajuda"
            aria-current={location.pathname === "/ajuda" ? "page" : undefined}
          >
            <FaQuestion aria-hidden="true" />
            <span>Ajuda</span>
          </button>
        </li>
      </ul>

      {/* Rodapé */}
      <footer className="sidebar-footer">
        <img src="/avatar.png" alt="Foto do usuário" className="avatar" />

        <div
          className="user-info"
          onClick={() => navigate("/perfil")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/perfil")}
          aria-label="Abrir perfil do usuário"
        >
          <div className="name">
            {user?.user_metadata?.name || "Nome não informado"}
          </div>
          <div className="role">Administrador(a)</div>
        </div>

        <button
          onClick={handleLogout}
          className="logout-button"
          aria-label="Sair da conta"
        >
          <CiLogout aria-hidden="true" />
        </button>
      </footer>
    </nav>
  );
};
