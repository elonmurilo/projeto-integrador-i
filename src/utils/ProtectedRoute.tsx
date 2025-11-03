import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Sidebar } from "../components/sidebar/Sidebar";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Estado para controlar se a Sidebar está recolhida ou expandida
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return (
    <div
      className={`app-container ${isCollapsed ? "collapsed" : "expanded"}`}
      style={{ display: "flex", minHeight: "100vh", width: "100%" }}
    >
      {/* Passa o setter para a Sidebar controlar o estado */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main className="main-content" style={{ flexGrow: 1 }}>
        {children}
      </main>
    </div>
  );
};
