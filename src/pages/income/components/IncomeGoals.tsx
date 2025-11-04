import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useGoal } from "../../../hooks/useGoal";
import { useServices } from "../../../hooks/useServices";

export const IncomeGoals: React.FC = () => {
  const { calculateTotalRevenue, getServiceMonths, getServiceYears } = useServices();
  const { goal, loading, updateGoal } = useGoal();

  const [realized, setRealized] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState<number>(goal);

  const currentMonth = getServiceMonths()[0];
  const currentYear = getServiceYears()[0];

  // Atualiza valores ao carregar dados
  useEffect(() => {
    if (currentMonth && currentYear) {
      const totalRevenue = calculateTotalRevenue(currentMonth, currentYear);
      setRealized(totalRevenue);
    }
  }, [goal, currentMonth, currentYear, calculateTotalRevenue]);

  const handleGoalClick = () => setShowModal(true);

  const handleSave = async () => {
    await updateGoal(newGoal);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" size="sm" /> Carregando...
      </div>
    );
  }

  const difference = goal - realized;
  const percentageRealized = goal > 0 ? (realized / goal) * 100 : 0;

  return (
    <div className="income-goals-container">
      <h4 className="mb-4 text-center text-md-start fw-semibold">
        Faturamento Realizado x Meta
      </h4>

      {/* === Cards de Meta, Realizado e % === */}
      <div className="income-cards">
        {/* Meta */}
        <div
          className="card text-center p-3 shadow-sm border-0 rounded-4 goal-card"
          style={{ backgroundColor: "#EFFFF6", cursor: "pointer" }}
          onClick={handleGoalClick}
        >
          <div className="card-body">
            <h6 className="fw-semibold text-success mb-1">Meta</h6>
            <h5 className="fw-bold">{`R$ ${goal.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}</h5>
          </div>
        </div>

        {/* Realizado */}
        <div className="card text-center p-3 shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h6 className="fw-semibold text-primary mb-1">Realizado</h6>
            <h5 className="fw-bold">{`R$ ${realized.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}</h5>
          </div>
        </div>

        {/* % Realizado */}
        <div className="card text-center p-3 shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h6 className="fw-semibold text-warning mb-1">% Realização</h6>
            <h5 className="fw-bold">{`${percentageRealized.toFixed(2)} %`}</h5>
          </div>
        </div>

        {/* Diferença restante */}
        <div className="card text-center p-3 shadow-sm border-0 rounded-4">
          <div className="card-body">
            <h6 className="fw-semibold text-danger mb-1">Restante p/ Meta</h6>
            <h5 className="fw-bold">{`R$ ${difference.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}`}</h5>
          </div>
        </div>
      </div>

      {/* === Modal para edição da meta === */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Meta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewGoal">
              <Form.Label>Nova Meta (R$)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={newGoal}
                onChange={(e) => setNewGoal(Number(e.target.value))}
                style={{ maxWidth: "100%" }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
