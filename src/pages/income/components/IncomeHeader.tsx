import { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaCarSide,
  FaChessPawn,
  FaChartLine,
} from "react-icons/fa";
import { useServices } from "../../../hooks/useServices";
import { User } from "@supabase/auth-js";

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

      // Chama a função assíncrona para buscar novos clientes
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
      <div style={{ backgroundColor: "#ddeeff", minHeight: "100vh" }}>
        <div className="container py-4">
          <h2>Carregando...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row align-items-center mb-4">
        <div>
          <h5 className="mb-4">
            Olá {user?.user_metadata?.name || "Usuário"} 👋
          </h5>
        </div>

        <div className="col">
          <h2 className="mb-0">ANÁLISE DE FATURAMENTO</h2>
        </div>
        <div className="col-auto">
          <label htmlFor="month-select" className="me-2">
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
        <div className="col-auto">
          <label htmlFor="year-select" className="me-2">
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
      <div className="row">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="card-body">
              <div className="fs-1 mb-2">
                <FaDollarSign />
              </div>
              <h5 className="card-title">{`R$${totalRevenue.toFixed(2)}`}</h5>
              <p className="card-text">Faturamento</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="card-body">
              <div className="fs-1 mb-2">
                <FaCarSide />
              </div>
              <h5 className="card-title">
                {calculateMonthServices(selectedMonth, selectedYear)}
              </h5>
              <p className="card-text">Serviços Realizados</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="card-body">
              <div className="fs-1 mb-2">
                <FaChessPawn />
              </div>
              <h5 className="card-title">{newCustomers}</h5>
              <p className="card-text">Clientes Novos</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <div className="card-body">
              <div className="fs-1 mb-2">
                <FaChartLine />
              </div>
              <h5 className="card-title">
                {calculateServiceGrowth(selectedMonth, selectedYear)}%
              </h5>
              <p className="card-text">Crescimento mês anterior</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
