import React from "react";
import { FaRegUser } from "react-icons/fa";
import { CircularButton, Label } from "../StyledComponents";
import { ReactComponent as ClientIcon } from "./svg/client-header.svg";
import { ReactComponent as ServicesIcon } from "./svg/services-header.svg";
import { ReactComponent as ClientsIcon } from "./svg/clients-header.svg";
import { useRegisterClient } from "../../../hooks/useRegisterClient";
import { RegisterClientModal } from "../../../components/modals/RegisterClientModal";
import { useClients } from "../../../hooks/useClients";
import { useDailyServices } from "../../../hooks/useDailyServices";
import { useClientsCount } from "../../../hooks/useClientsCount";
import { useServices } from "../../../hooks/useServices";

export const Header: React.FC = () => {
  const { fetchClients, currentPage, searchTerm } = useClients();
  const {
    showModal,
    openRegisterClientModal,
    closeRegisterClientModal,
    clienteEditando,
  } = useRegisterClient();
  const { dailyServices, loading: loadingDailyServices } = useDailyServices();
  const { totalServices, loading: loadingTotalServices } = useServices();
  const { totalClients, loading: loadingClients } = useClientsCount();

  const dailyServicesCount = dailyServices.length;

  return (
    <header className="header">
      {/* Saudação e botão de novo cliente */}
      <div className="header-top">
        <div className="user-section">
          <CircularButton
            onClick={openRegisterClientModal}
            aria-label="Cadastrar novo cliente"
            title="Cadastrar novo cliente"
          >
            <FaRegUser size={28} color="black" />
          </CircularButton>
          <Label className="mt-2 text-center">Cadastrar Novo Cliente</Label>
        </div>
      </div>

      {/* Cards de status */}
      <div className="metrics">
        {/* Total de Serviços Hoje */}
        <div className="metric-card">
          <ClientsIcon width={50} height={50} />
          <div className="metric-info">
            <span className="metric-title">Total de Serviços Hoje</span>
            <span className="metric-value">
              {loadingDailyServices ? "..." : dailyServicesCount}
            </span>
          </div>
        </div>

        {/* Total de Clientes */}
        <div className="metric-card">
          <ClientIcon width={50} height={50} />
          <div className="metric-info">
            <span className="metric-title">Clientes</span>
            <span className="metric-value">
              {loadingClients ? "..." : totalClients}
            </span>
          </div>
        </div>

        {/* Total de Serviços do Mês */}
        <div className="metric-card">
          <ServicesIcon width={50} height={50} />
          <div className="metric-info">
            <span className="metric-title">Total de Serviços do Mês</span>
            <span className="metric-value">
              {loadingTotalServices ? "..." : totalServices}
            </span>
          </div>
        </div>
      </div>

      {/* Modal de cadastro */}
      {showModal && (
        <RegisterClientModal
          show={showModal}
          onHide={closeRegisterClientModal}
          onSuccess={() => fetchClients(currentPage, searchTerm)}
          clienteEditando={clienteEditando}
        />
      )}
    </header>
  );
};
