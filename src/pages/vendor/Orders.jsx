import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/vendor/orders?page=${page}&limit=5&search=${search}&sortBy=${sortBy}`,
        {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [page, search, sortBy]);

  const handleStatusChange = async (orderId, productId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/vendor/orders/update-status`,
        { orderId, productId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status", err);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-base-content">My Orders</h2>

      {/* 🔍 Search and Sort Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by customer name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input input-bordered w-full md:max-w-md"
        />

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="select select-bordered w-full md:w-60"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="totalHigh">Total High → Low</option>
          <option value="totalLow">Total Low → High</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <p className="text-base-content">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-md bg-base-100 shadow-md p-4"
            >
              <div className="space-y-1 text-sm text-base-content">
                <p className="font-semibold">Order ID: {order._id}</p>
                <p>
                  <strong>Customer:</strong> {order.customer.name}
                </p>
                <p>
                  <strong>Email:</strong> {order.customer.email}
                </p>
                <p>
                  <strong>Phone:</strong> {order.shippingInfo?.phone || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {order.shippingInfo?.address || "N/A"}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {order.products.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 border-b pb-2"
                  >
                    <span className="text-sm">
                      {item.product.name} × {item.quantity} (${item.price})
                    </span>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          item.product._id,
                          e.target.value
                        )
                      }
                      className="select select-sm select-bordered"
                    >
                      <option value="paid" disabled>
                        paid
                      </option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </div>
                ))}
              </div>

              <p className="mt-3 font-semibold text-base-content">
                Total: ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          ))}

          {/* 📄 Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className="btn btn-sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-sm font-semibold text-base-content">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
