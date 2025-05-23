import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useGoal } from "../../../hooks/useGoal";
import { useServices } from "../../../hooks/useServices";

export const IncomeGoals: React.FC = () => {
  const { calculateTotalRevenue, getServiceMonths, getServiceYears } =
    useServices();
  const { goal, loading, updateGoal } = useGoal();

  const [realized, setRealized] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState<number>(goal);

  const currentMonth = getServiceMonths()[0];
  const currentYear = getServiceYears()[0];

  useEffect(() => {
    if (currentMonth && currentYear) {
      const totalRevenue = calculateTotalRevenue(currentMonth, currentYear);
      setRealized(goal - totalRevenue);
    }
  }, [goal, currentMonth, currentYear, calculateTotalRevenue]);

  const handleGoalClick = () => {
    setShowModal(true);
  };

  const handleSave = async () => {
    await updateGoal(newGoal);
    setShowModal(false);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  const percentageRealized = ((goal - realized) / goal) * 100;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 text-center text-md-left">
            FATURAMENTO REALIZADO X META
          </h2>
        </div>
      </div>
      <div className="row">
        {/* Card Meta */}
        <div className="col-12 col-sm-6 col-md-4 mb-3">
          <div
            className="card text-center p-3"
            style={{ cursor: "pointer", backgroundColor: "#EFFFF6" }}
            onClick={handleGoalClick}
          >
            <div className="card-body">
              <h5 className="card-title">Meta</h5>
              <p
                className="card-text text-truncate"
                style={{ fontSize: "1.2rem" }}
              >
                {`R$ ${goal.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`}
              </p>
            </div>
          </div>
        </div>

        {/* Card Realizado */}
        <div className="col-12 col-sm-6 col-md-4 mb-3">
          <div className="card text-center p-3">
            <div className="card-body">
              <h5 className="card-title">Realizado</h5>
              <p
                className="card-text text-truncate"
                style={{ fontSize: "1.2rem" }}
              >
                {`R$ ${realized.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`}
              </p>
            </div>
          </div>
        </div>

        {/* Card % Realizado */}
        <div className="col-12 col-sm-6 col-md-4 mb-3">
          <div className="card text-center p-3">
            <div className="card-body">
              <h5 className="card-title">% Realizado</h5>
              <p
                className="card-text text-truncate"
                style={{ fontSize: "1.2rem" }}
              >
                {`${percentageRealized.toFixed(2)} %`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para alterar a meta */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Meta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewGoal">
              <Form.Label>Nova Meta</Form.Label>
              <Form.Control
                type="number"
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
