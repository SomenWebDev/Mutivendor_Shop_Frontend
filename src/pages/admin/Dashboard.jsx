import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Line as LineChart,
  Pie as PieChart,
  Bar as BarChart,
} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [monthlyOrders, setMonthlyOrders] = useState([]);
  const [vendorRevenue, setVendorRevenue] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, ordersRes, revenueRes, categoryRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard/stats`,
          {
            headers,
          }
        ),
        axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/admin/dashboard/monthly-orders`,
          {
            headers,
          }
        ),
        axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/admin/dashboard/vendor-revenue`,
          {
            headers,
          }
        ),
        axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/admin/dashboard/category-products`,
          { headers }
        ),
      ]);

      setStats(statsRes.data);
      setMonthlyOrders(ordersRes.data);
      setVendorRevenue(revenueRes.data);
      setCategoryProducts(categoryRes.data);
    } catch (err) {
      toast.error("Failed to load dashboard", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const lineChartData = {
    labels: monthlyOrders.map((item) => `Month ${item.month}`),
    datasets: [
      {
        label: "Orders",
        data: monthlyOrders.map((item) => item.orders),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const pieChartData = {
    labels: categoryProducts.map((c) => c.name),
    datasets: [
      {
        label: "Products",
        data: categoryProducts.map((c) => c.count),
        backgroundColor: [
          "#4ade80",
          "#facc15",
          "#f87171",
          "#60a5fa",
          "#a78bfa",
          "#fb923c",
        ],
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const dataArr = context.chart.data.datasets[0].data;
          const total = dataArr.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
      },
      legend: {
        position: "bottom",
        labels: {
          color: "#999", // text in dark mode
        },
      },
    },
  };

  const barChartData = {
    labels: vendorRevenue.map((v) => v.name),
    datasets: [
      {
        label: "Revenue ($)",
        data: vendorRevenue.map((v) => v.revenue),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  return (
    <div className="space-y-8 p-4 md:p-6">
      <h2 className="text-2xl font-bold text-base-content">Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-base-100 rounded shadow text-center">
          <p className="text-sm text-neutral-content">Users</p>
          <h3 className="text-xl font-bold text-base-content">
            {stats.totalUsers || 0}
          </h3>
        </div>
        <div className="p-4 bg-base-100 rounded shadow text-center">
          <p className="text-sm text-neutral-content">Customers</p>
          <h3 className="text-xl font-bold text-base-content">
            {stats.totalCustomers || 0}
          </h3>
        </div>
        <div className="p-4 bg-base-100 rounded shadow text-center">
          <p className="text-sm text-neutral-content">Vendors</p>
          <h3 className="text-xl font-bold text-base-content">
            {stats.totalVendors || 0}
          </h3>
        </div>
        <div className="p-4 bg-base-100 rounded shadow text-center">
          <p className="text-sm text-neutral-content">Products</p>
          <h3 className="text-xl font-bold text-base-content">
            {stats.totalProducts || 0}
          </h3>
        </div>
        <div className="p-4 bg-base-100 rounded shadow text-center">
          <p className="text-sm text-neutral-content">Orders</p>
          <h3 className="text-xl font-bold text-base-content">
            {stats.totalOrders || 0}
          </h3>
        </div>
        <div className="p-4 bg-base-100 rounded shadow text-center">
          <p className="text-sm text-neutral-content">Revenue</p>
          <h3 className="text-xl font-bold text-base-content">
            ${stats.totalRevenue?.toFixed(2) || "0.00"}
          </h3>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-base-100 rounded shadow p-4 max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold mb-2 text-base-content">
          Monthly Orders
        </h3>
        <LineChart data={lineChartData} />
      </div>

      {/* Bar and Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <div className="bg-base-100 rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-base-content">
            Top Vendor Revenue
          </h3>
          <BarChart data={barChartData} />
        </div>

        <div className="bg-base-100 rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-2 text-base-content">
            Products by Category
          </h3>
          <PieChart data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
