import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/categories`
      );
      setCategories(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch categories", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { search, status, category, page },
        }
      );

      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, status, category, page]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-base-200 dark:bg-base-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-base-content dark:text-base-content">
        Admin Order Management
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input input-bordered w-full sm:w-auto flex-grow dark:bg-base-100 dark:text-base-content"
        />
        <select
          className="select select-bordered w-full sm:w-auto dark:bg-base-100 dark:text-base-content"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          className="select select-bordered w-full sm:w-auto dark:bg-base-100 dark:text-base-content"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <p className="text-base-content dark:text-base-content">
          No orders found.
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-md p-4 bg-base-100 dark:bg-base-200 shadow"
              >
                <p className="text-base-content dark:text-base-content">
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p className="text-base-content dark:text-base-content">
                  <strong>Customer:</strong> {order.customer?.name} (
                  {order.customer?.email})
                </p>
                <p className="text-base-content dark:text-base-content">
                  <strong>Phone:</strong> {order.phone || "N/A"}
                </p>
                <p className="text-base-content dark:text-base-content">
                  <strong>Address:</strong> {order.address || "N/A"}
                </p>
                <p className="text-base-content dark:text-base-content">
                  <strong>Placed:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <p className="mt-2 font-medium text-base-content dark:text-base-content">
                  Products:
                </p>
                <ul className="pl-5 list-disc text-base-content dark:text-base-content">
                  {order.products.map((item, i) => (
                    <li key={i}>
                      <strong>{item.product?.name}</strong> × {item.quantity} ($
                      {item.price}) —{" "}
                      <span className="capitalize">{item.status}</span> |
                      Vendor: {item.vendor?.name || "N/A"}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-semibold text-lg text-base-content dark:text-base-content">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              className="btn btn-sm w-full sm:w-auto"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span className="font-semibold text-sm text-base-content dark:text-base-content">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-sm w-full sm:w-auto"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
