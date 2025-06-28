import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalEarnings: 0,
    recentOrders: [],
    bestSellingProduct: null,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
       `${import.meta.env.VITE_API_BASE_URL}/api/vendor/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to fetch dashboard stats");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-base-content">
        Vendor Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-base-100 p-6 rounded shadow text-base-content">
          <h3 className="text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-base-100 p-6 rounded shadow text-base-content">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-base-100 p-6 rounded shadow text-base-content">
          <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold">
            ${stats.totalEarnings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Best Selling Product */}
      {stats.bestSellingProduct && (
        <div className="bg-base-100 p-6 rounded shadow max-w-2xl mx-auto text-base-content">
          <h3 className="text-xl font-semibold mb-2">Best-Selling Product</h3>
          <p>
            {stats.bestSellingProduct.name} —{" "}
            <span className="font-bold">
              {stats.bestSellingProduct.quantity} sold
            </span>
          </p>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-base-100 p-6 rounded shadow max-w-4xl mx-auto text-base-content">
        <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No recent orders found.
          </p>
        ) : (
          <div className="divide-y divide-base-300">
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="py-3">
                <p className="font-semibold">
                  Order ID: {order._id}{" "}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({new Date(order.createdAt).toLocaleString()})
                  </span>
                </p>
                <p>Total: ${order.totalAmount.toFixed(2)}</p>
                <div className="mt-1 space-y-1 text-sm">
                  {order.products.map((p, i) => (
                    <p key={i}>
                      {p.name} × {p.quantity} —{" "}
                      <em className="text-gray-600 dark:text-gray-400">
                        {p.status}
                      </em>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
