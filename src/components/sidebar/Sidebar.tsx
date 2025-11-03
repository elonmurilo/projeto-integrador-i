import React, { useState } from "react";
import "./Sidebar.css";
import {
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaMoneyBill,
  FaTags,
  FaQuestion,
  FaBars,
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { Offcanvas, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
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

  // --- Conteúdo principal do menu (desktop)
  const MenuItems = () => (
    <ul className="sidebar-menu">
      <li>
        <button
          className={location.pathname === "/" ? "active" : ""}
          onClick={() => navigate("/")}
        >
          <FaHome />
          {!isCollapsed && <span>Página Inicial</span>}
        </button>
      </li>

      <li>
        <button
          className={location.pathname === "/servicos" ? "active" : ""}
          onClick={() => navigate("/servicos")}
        >
          <FaCalendarAlt />
          {!isCollapsed && <span>Serviços</span>}
        </button>
      </li>

      <li>
        <button
          className={location.pathname.startsWith("/clientes") ? "active" : ""}
          onClick={() => navigate("/clientes")}
        >
          <FaUser />
          {!isCollapsed && <span>Clientes</span>}
        </button>
      </li>

      <li>
        <button
          className={location.pathname.startsWith("/faturamento") ? "active" : ""}
          onClick={() => navigate("/faturamento")}
        >
          <FaMoneyBill />
          {!isCollapsed && <span>Faturamento</span>}
        </button>
      </li>

      <li>
        <button
          className={location.pathname === "/promocoes" ? "active" : ""}
          onClick={() => navigate("/promocoes")}
        >
          <FaTags />
          {!isCollapsed && <span>Promoções</span>}
        </button>
      </li>

      <li>
        <button
          className={location.pathname === "/ajuda" ? "active" : ""}
          onClick={() => navigate("/ajuda")}
        >
          <FaQuestion />
          {!isCollapsed && <span>Ajuda</span>}
        </button>
      </li>
    </ul>
  );

  return (
    <>
      {/* Botão de alternância (Desktop) */}
      {isCollapsed && (
        <button
          className="menu-toggle-btn d-none d-md-block"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Alternar menu"
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar fixa no desktop */}
      <nav className={`sidebar d-none d-md-flex flex-column ${isCollapsed ? "collapsed" : "expanded"}`}>
        <div className="sidebar-header">
          <img src="/logo.png" alt="Logo CleanTrack" className="avatar" />
          {!isCollapsed && <span className="logo-text">CleanTrack</span>}
        </div>

        <MenuItems />

        <footer className="sidebar-footer">
          <img src="/avatar.png" alt="Foto do usuário" className="avatar" />
          {!isCollapsed && (
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
          )}
          <button onClick={handleLogout} className="logout-button">
            <CiLogout />
          </button>
        </footer>
      </nav>

      {/* Sidebar Offcanvas (Mobile) */}
      {!show && (
        <Button
          variant="light"
          onClick={() => setShow(true)}
          className="menu-toggle position-fixed m-3 d-md-none shadow-sm"
        >
          <FaBars size={20} />
        </Button>
      )}

      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        className="d-md-none offcanvas-cleantrack"
        placement="start"
      >
        <Offcanvas.Header closeButton className="offcanvas-header-custom">
          <div className="d-flex align-items-center w-100 justify-content-center">
            <img src="/logo.png" alt="Logo CleanTrack" className="avatar me-2" />
            <span className="logo-text-mobile">CleanTrack</span>
          </div>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <ul className="sidebar-menu mobile-menu">
            <li>
              <button
                className={location.pathname === "/" ? "active" : ""}
                onClick={() => {
                  navigate("/");
                  setShow(false);
                }}
              >
                <FaHome />
                <span>Página Inicial</span>
              </button>
            </li>
            <li>
              <button
                className={location.pathname === "/servicos" ? "active" : ""}
                onClick={() => {
                  navigate("/servicos");
                  setShow(false);
                }}
              >
                <FaCalendarAlt />
                <span>Serviços</span>
              </button>
            </li>
            <li>
              <button
                className={location.pathname.startsWith("/clientes") ? "active" : ""}
                onClick={() => {
                  navigate("/clientes");
                  setShow(false);
                }}
              >
                <FaUser />
                <span>Clientes</span>
              </button>
            </li>
            <li>
              <button
                className={location.pathname.startsWith("/faturamento") ? "active" : ""}
                onClick={() => {
                  navigate("/faturamento");
                  setShow(false);
                }}
              >
                <FaMoneyBill />
                <span>Faturamento</span>
              </button>
            </li>
            <li>
              <button
                className={location.pathname === "/promocoes" ? "active" : ""}
                onClick={() => {
                  navigate("/promocoes");
                  setShow(false);
                }}
              >
                <FaTags />
                <span>Promoções</span>
              </button>
            </li>
            <li>
              <button
                className={location.pathname === "/ajuda" ? "active" : ""}
                onClick={() => {
                  navigate("/ajuda");
                  setShow(false);
                }}
              >
                <FaQuestion />
                <span>Ajuda</span>
              </button>
            </li>
          </ul>

          <footer className="sidebar-footer text-center mt-4">
            <img src="/avatar.png" alt="Foto do usuário" className="avatar" />
            <div className="user-info mt-2">
              <div className="name">{user?.user_metadata?.name || "Usuário"}</div>
              <div className="role">Administrador(a)</div>
            </div>
            <button onClick={handleLogout} className="logout-button mt-2">
              <CiLogout />
            </button>
          </footer>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
