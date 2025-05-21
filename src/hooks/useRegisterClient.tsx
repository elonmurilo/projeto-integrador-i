import { useState } from "react";

export const useRegisterClient = () => {
  const [showModal, setShowModal] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<any | null>(null);

  const openRegisterClientModal = (client: any = null) => {
    setClienteEditando(client);
    setShowModal(true);
  };

  const closeRegisterClientModal = () => {
    setShowModal(false);
    setClienteEditando(null);
  };

  const handleEditClientModal = (client: any) => {
    setClienteEditando(client);
    setShowModal(true);
  };

  return {
    showModal,
    clienteEditando,
    openRegisterClientModal,
    closeRegisterClientModal,
    handleEditClientModal,
  };
};
