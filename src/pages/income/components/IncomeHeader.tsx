import { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaCarSide,
  FaChessPawn,
  FaChartLine,
} from "react-icons/fa";
import { useServices } from "../../../hooks/useServices";
import { User } from "@supabase/auth-js";
import { Spinner } from "react-bootstrap";

interface IncomeHeaderProps {
  user: User | null;
}

export const IncomeHeader: React.FC<IncomeHeaderProps> = ({ user }) => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [newCustomers, setNewCustomers] = useState<number>(0);

  const {
    getServiceMonths,
    getServiceYears,
    calculateTotalRevenue,
    calculateMonthServices,
    calculateServiceGrowth,
    calculateNewMonthCustomers,
    loading,
  } = useServices();

  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    if (!loading && !selectedMonth && !selectedYear) {
      const currentDate = new Date();
      const currentMonthName = getServiceMonths().find(
        (month) =>
          month.toUpperCase() ===
          currentDate.toLocaleString("pt-BR", { month: "long" }).toUpperCase()
      );
      const currentYear = currentDate.getFullYear().toString();

      setSelectedMonth(currentMonthName || getServiceMonths()[0] || "");
      setSelectedYear(currentYear);
    }
  }, [loading, getServiceMonths, getServiceYears, selectedMonth, selectedYear]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const revenue = calculateTotalRevenue(selectedMonth, selectedYear);
      setTotalRevenue(revenue);

      calculateNewMonthCustomers(selectedMonth, selectedYear).then((result) => {
        setNewCustomers(result);
      });
    }
  }, [
    selectedMonth,
    selectedYear,
    calculateTotalRevenue,
    calculateNewMonthCustomers,
  ]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" size="sm" /> Carregando dados...
      </div>
    );
  }

  return (
    <div className="income-header-container">
      {/* === Cabeçalho com filtros === */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h5 className="mb-2">Olá {user?.user_metadata?.name || "Usuário"} 👋</h5>
          <h4 className="fw-semibold mb-0 text-primary">
            Análise de Faturamento
          </h4>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <div>
            <label htmlFor="month-select" className="me-2 fw-semibold">
              Mês
            </label>
            <select
              id="month-select"
              className="form-select d-inline-block w-auto"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {getServiceMonths().map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year-select" className="me-2 fw-semibold">
              Ano
            </label>
            <select
              id="year-select"
              className="form-select d-inline-block w-auto"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {getServiceYears().map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* === Cards === */}
      <div className="income-cards">
        {/* Faturamento */}
        <div className="card text-center p-3 shadow-sm border-0 rounded-4">
          <div className="card-body">
            <div className="fs-1 mb-2 text-primary">
              <FaDollarSign />
            </div>
            <h5 className="fw-bold mb-1">{`R$ ${totalRevenue.toFixed(2)}`}</h5>
            <p className="text-muted small mb-0">Faturamento</p>
          </div>
        </div>

        {/* Serviços realizados */}
        <div className="card text-center p-3 shadow-sm border-0 rounded-4">
          <div className="card-body">
            <div className="fs-1 mb-2 text-info">
              <FaCarSide />
            </div>
            <h5 className="fw-bold mb-1">
              {calculateMonthServices(selectedMonth, selectedYear)}
            </h5>
            <p className="text-muted small mb-0">Serviços Realizados</p>
          </div>
        </div>

        {/* Clientes novos */}
        <div className="card text-center p-3 shadow-sm border-0 rounded-4">
          <div className="card-body">
            <div className="fs-1 mb-2 text-success">
              <FaChessPawn />
            </div>
            <h5 className="fw-bold mb-1">{newCustomers}</h5>
            <p className="text-muted small mb-0">Clientes Novos</p>
          </div>
        </div>

        {/* Crescimento */}
        <div className="card text-center p-3 shadow-sm border-0 rounded-4">
          <div className="card-body">
            <div className="fs-1 mb-2 text-warning">
              <FaChartLine />
            </div>
            <h5 className="fw-bold mb-1">
              {calculateServiceGrowth(selectedMonth, selectedYear)}%
            </h5>
            <p className="text-muted small mb-0">Crescimento Mês Anterior</p>
          </div>
        </div>
      </div>
    </div>
  );
};
