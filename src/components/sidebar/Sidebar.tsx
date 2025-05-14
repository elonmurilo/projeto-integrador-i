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


export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="logo-icon">
          <img src="/logo.png" alt="Logo CleanTrack" className="avatar" />
        </span>
        <span className="logo-text">CleanTrack</span>
      </div>

      <ul className="sidebar-menu">
        <li
          className={location.pathname === "/" ? "active" : ""}
          onClick={() => navigate("/")}
        >
          <FaHome />
          <span>Página Inicial</span>
        </li>
        <li
          className={location.pathname === "/servicos" ? "active" : ""}
          onClick={() => navigate("/servicos")}
        >
          <FaCalendarAlt />
          <span>Serviços</span>
        </li>
        <li
          className={location.pathname.startsWith("/clientes") ? "active" : ""}
          onClick={() => navigate("/clientes")}
        >
          <FaUser />
          <span>Clientes</span>
        </li>
        <li
          className={location.pathname.startsWith("/faturamento") ? "active" : ""}
          onClick={() => navigate("/faturamento")}
        >
          <FaMoneyBill />
          <span>Faturamento</span>
        </li>
        <li
          className={location.pathname === "/promocoes" ? "active" : ""}
          onClick={() => navigate("/promocoes")}
        >
          <FaTags />
          <span>Promoções</span>
        </li>
        <li
          className={location.pathname === "/ajuda" ? "active" : ""}
          onClick={() => navigate("/ajuda")}
        >
          <FaQuestion />
          <span>Ajuda</span>
        </li>
      </ul>

      <div className="sidebar-footer">
        <img src="/avatar.png" alt="Usuário" className="avatar" />
        <div className="user-info" onClick={() => navigate("/perfil")} style={{ cursor: "pointer" }}>
          <div className="name">Edmarcia</div>
          <div className="role">Administradora</div>
        </div>
      </div>
    </div>
  );
};
