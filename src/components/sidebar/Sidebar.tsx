import React, { useState } from "react";
import "./Sidebar.css";
import {
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaMoneyBill,
  FaTags,
  FaQuestion,
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { Offcanvas, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../contexts/AuthContext";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Erro ao deslogar:", error.message);
      else navigate("/login");
    } catch (err) {
      console.error("Erro inesperado ao deslogar:", err);
    }
  };

  // --- Conteúdo principal do menu (reutilizável)
  const MenuItems = () => (
    <>
      <ul className="sidebar-menu">
        <li>
          <button
            className={location.pathname === "/" ? "active" : ""}
            onClick={() => navigate("/")}
          >
            <FaHome />
            <span>Página Inicial</span>
          </button>
        </li>

        <li>
          <button
            className={location.pathname === "/servicos" ? "active" : ""}
            onClick={() => navigate("/servicos")}
          >
            <FaCalendarAlt />
            <span>Serviços</span>
          </button>
        </li>

        <li>
          <button
            className={location.pathname.startsWith("/clientes") ? "active" : ""}
            onClick={() => navigate("/clientes")}
          >
            <FaUser />
            <span>Clientes</span>
          </button>
        </li>

        <li>
          <button
            className={location.pathname.startsWith("/faturamento") ? "active" : ""}
            onClick={() => navigate("/faturamento")}
          >
            <FaMoneyBill />
            <span>Faturamento</span>
          </button>
        </li>

        <li>
          <button
            className={location.pathname === "/promocoes" ? "active" : ""}
            onClick={() => navigate("/promocoes")}
          >
            <FaTags />
            <span>Promoções</span>
          </button>
        </li>

        <li>
          <button
            className={location.pathname === "/ajuda" ? "active" : ""}
            onClick={() => navigate("/ajuda")}
          >
            <FaQuestion />
            <span>Ajuda</span>
          </button>
        </li>
      </ul>

      <footer className="sidebar-footer">
        <img src="/avatar.png" alt="Foto do usuário" className="avatar" />
        <div
          className="user-info"
          onClick={() => navigate("/perfil")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && navigate("/perfil")}
        >
          <div className="name">{user?.user_metadata?.name || "Usuário"}</div>
          <div className="role">Administrador(a)</div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <CiLogout />
        </button>
      </footer>
    </>
  );

  return (
    <>
      {/* === Botão hamburguer (aparece só no mobile) === */}
      <Button
        variant="light"
        className="menu-toggle d-md-none position-fixed top-0 start-0 m-2 shadow-sm"
        onClick={() => setShow(true)}
      >
        ☰
      </Button>

      {/* === Sidebar fixa no desktop === */}
      <nav className="sidebar d-none d-md-flex flex-column">
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo CleanTrack" className="avatar" />
          <span className="logo-text">CleanTrack</span>
        </div>
        <MenuItems />
      </nav>

      {/* === Offcanvas para mobile === */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        className="d-md-none"
        placement="start"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <MenuItems />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
