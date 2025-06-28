import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Earnings = () => {
  const [data, setData] = useState({ totalEarnings: 0, totalOrders: 0 });
  const [monthlyEarnings, setMonthlyEarnings] = useState({});
  const [productEarnings, setProductEarnings] = useState({});
  const [monthlyProductEarnings, setMonthlyProductEarnings] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem("token");

        const [summaryRes, detailsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vendor/earnings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vendor/earnings/details`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setData(summaryRes.data);
        setMonthlyEarnings(detailsRes.data.monthlyEarnings);
        setProductEarnings(detailsRes.data.productEarnings);
        setMonthlyProductEarnings(detailsRes.data.monthlyProductEarnings || {});
      } catch (err) {
        toast.error("Failed to fetch earnings");
        console.error(err);
      }
    };

    fetchEarnings();
  }, []);

  const allMonths = Object.keys(monthlyEarnings).sort();

  const filteredMonths =
    selectedMonth === "all"
      ? allMonths
      : allMonths.filter((m) => m === selectedMonth);

  const filteredData = filteredMonths.map((key) => monthlyEarnings[key]);

  const currentProductEarnings =
    selectedMonth === "all"
      ? productEarnings
      : monthlyProductEarnings[selectedMonth] || {};

  const productLabels = Object.keys(currentProductEarnings);
  const productData = productLabels.map((key) => currentProductEarnings[key]);

  const lineChartData = {
    labels: filteredMonths,
    datasets: [
      {
        label: "Monthly Earnings ($)",
        data: filteredData,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    layout: {
      padding: { left: 10, right: 10 },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
          color: "#9ca3af", // gray-400
        },
      },
      x: {
        ticks: {
          color: "#9ca3af",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#9ca3af",
        },
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const barChartData = {
    labels: productLabels,
    datasets: [
      {
        label: "Earnings by Product ($)",
        data: productData,
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
          color: "#9ca3af",
        },
      },
      x: {
        ticks: {
          color: "#9ca3af",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#9ca3af",
        },
        position: "top",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
        My Earnings
      </h2>

      {/* Summary */}
      <div className="bg-base-100 text-base-content p-6 rounded-md shadow-md space-y-2">
        <p className="text-lg font-semibold">
          Total Earnings:{" "}
          <span className="text-primary">${data.totalEarnings.toFixed(2)}</span>
        </p>
        <p className="text-lg">
          Total Orders:{" "}
          <span className="text-secondary">{data.totalOrders}</span>
        </p>
      </div>

      {/* Month Filter */}
      <div className="max-w-md mx-auto">
        <label className="label">
          <span className="label-text font-medium text-base-content">
            Filter by Month
          </span>
        </label>
        <select
          className="select select-bordered w-full"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="all">All (Last 12 Months)</option>
          {allMonths.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Line Chart */}
      <div className="bg-base-100 text-base-content p-4 rounded shadow max-w-4xl mx-auto h-[400px]">
        <h3 className="text-lg font-semibold mb-2">Earnings by Month</h3>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>

      {/* Bar Chart */}
      <div className="bg-base-100 text-base-content p-4 rounded shadow max-w-4xl mx-auto h-[400px]">
        <h3 className="text-lg font-semibold mb-2">Earnings by Product</h3>
        <Bar data={barChartData} options={barChartOptions} />
      </div>
    </div>
  );
};

export default Earnings;
