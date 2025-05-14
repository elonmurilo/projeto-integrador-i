import React from "react";
import { Modal, Button } from "react-bootstrap";

interface FeedbackModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: "success" | "danger";
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  show,
  onClose,
  title,
  message,
  variant = "success",
}) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className={`bg-${variant} text-white`}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant={variant} onClick={onClose}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
