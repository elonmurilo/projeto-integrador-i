import React from "react";
import { FaRegUser } from "react-icons/fa";
import { CircularButton, Label } from "../StyledComponents";
import { ReactComponent as ClientIcon } from "./svg/client-header.svg";
import { ReactComponent as ServicesIcon } from "./svg/services-header.svg";
import { ReactComponent as ClientsIcon } from "./svg/clients-header.svg";
import { styles } from "../styles";
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
    <div
      className="d-flex justify-content-start align-items-start flex-nowrap mb-4 px-3"
      style={{ gap: "2rem" }}
    >
      {/* Botão de cadastro */}
      <div className="button d-flex flex-column align-items-center">
        <CircularButton
          onClick={() => openRegisterClientModal()}
          aria-label="Cadastrar novo cliente"
          title="Cadastrar novo cliente"
        >
          <FaRegUser size={30} color="black" />
        </CircularButton>
        <Label className="mt-2 text-center">Cadastrar Novo Cliente</Label>
      </div>

      {/* Container principal de status */}
      <div
        className="status d-flex justify-content-around align-items-center text-center flex-grow-1"
        style={{
          ...(styles.headerContainer as React.CSSProperties),
          minWidth: "750px",
          maxWidth: "950px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Total de Serviços Hoje */}
        <div
          className="service-total d-flex align-items-center justify-content-center"
          style={styles.serviceTotal as React.CSSProperties}
        >
          <ClientsIcon width={60} height={60} />
          <div style={styles.statusTextContainer as React.CSSProperties}>
            <span style={styles.headerTitle}>Total de Serviços Hoje</span>
            <span style={styles.statusNumber}>
              {loadingDailyServices ? "Carregando..." : dailyServicesCount}
            </span>
          </div>
        </div>

        <div className="divider" style={styles.divider} />

        {/* Total de Clientes */}
        <div
          className="client-total d-flex align-items-center justify-content-center"
          style={styles.clientTotal as React.CSSProperties}
        >
          <ClientIcon width={60} height={60} />
          <div style={styles.statusTextContainer as React.CSSProperties}>
            <span style={styles.headerTitle}>Clientes</span>
            <span style={styles.statusNumber}>
              {loadingClients ? "Carregando..." : totalClients}
            </span>
          </div>
        </div>

        <div className="divider" style={styles.divider} />

        {/* Total de Serviços do Mês */}
        <div
          className="month-service-total d-flex align-items-center justify-content-center"
          style={styles.monthServiceTotal as React.CSSProperties}
        >
          <ServicesIcon width={60} height={60} />
          <div style={styles.statusTextContainer as React.CSSProperties}>
            <span style={styles.headerTitle}>Total de Serviços do Mês</span>
            <span style={styles.statusNumber}>
              {loadingTotalServices ? "Carregando..." : totalServices}
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <RegisterClientModal
          show={showModal}
          onHide={closeRegisterClientModal}
          onSuccess={() => fetchClients(currentPage, searchTerm)}
          clienteEditando={clienteEditando}
        />
      )}
    </div>
  );
};
