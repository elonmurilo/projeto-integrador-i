import { useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";

const monthNames = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

export const useServices = () => {
  const [totalServices, setTotalServices] = useState<number>(0);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllServices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("services").select("*");

    if (error) {
      console.error("Erro ao buscar todos os serviços:", error.message);
    } else {
      setAllServices(data || []);
    }
    setLoading(false);
  };

  const calculateTotalServices = useCallback(() => {
    setTotalServices(allServices.length);
  }, [allServices.length]);

  const calculateMonthServices = (month: string, year: string): number => {
    const selectedMonthIndex = monthNames.indexOf(month);
    if (selectedMonthIndex === -1) return 0;

    const totalServicesInMonth = allServices.filter((service) => {
      const date = new Date(service?.service_created_date);
      const serviceMonth = date.getMonth();
      const serviceYear = date.getFullYear().toString();

      return serviceMonth === selectedMonthIndex && serviceYear === year;
    }).length;

    return totalServicesInMonth;
  };

  const calculateNewMonthCustomers = async (
    month: string,
    year: string
  ): Promise<number> => {
    const selectedMonthIndex = monthNames.indexOf(month);
    if (selectedMonthIndex === -1) return 0;

    const { data, error } = await supabase
      .from("clientes")
      .select("customer_created_date");

    if (error) {
      console.error("Erro ao buscar clientes:", error.message);
      return 0;
    }

    const totalNewCustomers = (data || []).filter((customer) => {
      const date = new Date(customer?.customer_created_date);
      const customerMonth = date.getMonth();
      const customerYear = date.getFullYear().toString();

      return customerMonth === selectedMonthIndex && customerYear === year;
    }).length;

    return totalNewCustomers;
  };

  const calculateServiceGrowth = (month: string, year: string): number => {
    const selectedMonthIndex = monthNames.indexOf(month);
    if (selectedMonthIndex === -1 || selectedMonthIndex === 0) return 0;

    const previousMonthIndex = selectedMonthIndex - 1;
    const previousMonth = monthNames[previousMonthIndex];
    const previousYear =
      previousMonthIndex === 11 ? (parseInt(year) - 1).toString() : year;

    const currentMonthServices = calculateMonthServices(month, year);
    const previousMonthServices = calculateMonthServices(
      previousMonth,
      previousYear
    );

    if (previousMonthServices === 0) return 0;

    const growth =
      ((currentMonthServices - previousMonthServices) / previousMonthServices) *
      100;
    return growth;
  };

  const calculateTotalRevenue = (month: string, year: string): number => {
    const selectedMonthIndex = monthNames.indexOf(month);
    if (selectedMonthIndex === -1) return 0;

    const totalRevenue = allServices.reduce((acc, service) => {
      const date = new Date(service?.service_created_date);
      const serviceMonth = date.getMonth();
      const serviceYear = date.getFullYear().toString();
      const price =
        typeof service?.service_price === "string"
          ? parseFloat(service.service_price)
          : service?.service_price || 0;

      if (serviceMonth === selectedMonthIndex && serviceYear === year) {
        return acc + price;
      }
      return acc;
    }, 0);

    return totalRevenue;
  };

  const getServiceMonths = (): string[] => {
    const uniqueMonths = Array.from(
      new Set(
        allServices.map((service) => {
          const date = new Date(service?.service_created_date);
          return monthNames[date.getMonth()] || "";
        })
      )
    );

    return uniqueMonths;
  };

  const getServiceYears = (): string[] => {
    const uniqueYears = Array.from(
      new Set(
        allServices.map((service) => {
          const date = new Date(service?.service_created_date);
          return date.getFullYear().toString();
        })
      )
    );

    return uniqueYears;
  };

  useEffect(() => {
    fetchAllServices();
  }, []);

  useEffect(() => {
    calculateTotalServices();
  }, [allServices, calculateTotalServices]);

  return {
    totalServices,
    allServices,
    loading,
    fetchAllServices,
    calculateTotalServices,
    calculateMonthServices,
    calculateServiceGrowth,
    calculateTotalRevenue,
    calculateNewMonthCustomers,
    getServiceMonths,
    getServiceYears,
    setAllServices,
  };
};
