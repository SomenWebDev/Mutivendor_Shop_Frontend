import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserFromToken } from "../../utils/auth";
import { Link } from "react-router-dom";

const IMAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const statusColors = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  delivered:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [reviewedProducts, setReviewedProducts] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const user = getUserFromToken();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${IMAGE_BASE_URL}/api/customer/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit: 5 },
        });
        setOrders(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, [page]);

  useEffect(() => {
    const fetchReviews = async () => {
      const products = new Set();
      orders.forEach((order) =>
        order.products.forEach((p) => products.add(p.product._id))
      );

      const reviewsStatus = {};
      await Promise.all(
        [...products].map(async (productId) => {
          try {
            const res = await axios.get(
              `${IMAGE_BASE_URL}/api/customer/reviews/${productId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            reviewsStatus[productId] = res.data || null;
          } catch {
            reviewsStatus[productId] = null;
          }
        })
      );
      setReviewedProducts(reviewsStatus);
    };

    if (orders.length > 0) fetchReviews();
  }, [orders]);

  const formatOrderNumber = (id) => `#${id.slice(-6).toUpperCase()}`;

  const renderStars = (rating) => (
    <div className="text-yellow-500 mt-1 flex items-center gap-0.5 text-sm">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-base-200 dark:bg-base-300 min-h-screen">
      {orders.length === 0 ? (
        <p className="text-base-content dark:text-base-content">
          No orders found.
        </p>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4 text-base-content dark:text-base-content">
            {user?.name}'s Orders
          </h2>

          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 bg-base-100 dark:bg-base-200 shadow"
            >
              <div className="mb-2">
                <h3 className="font-semibold text-lg text-base-content dark:text-base-content">
                  Order {formatOrderNumber(order._id)}
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="space-y-4">
                {order.products.map((p, idx) => {
                  const product = p.product;
                  const review = reviewedProducts[product._id];
                  const imageUrl = product?.imageUrl;
                  const image =
                    imageUrl && typeof imageUrl === "string"
                      ? imageUrl.startsWith("http")
                        ? imageUrl
                        : `${IMAGE_BASE_URL}/uploads/${imageUrl}`
                      : null;

                  return (
                    <div key={idx} className="flex items-center gap-4 sm:gap-6">
                      <img
                        src={
                          image ||
                          "https://via.placeholder.com/50?text=No+Image"
                        }
                        alt={product?.name || "Product"}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full text-sm">
                        <div className="flex-1">
                          <div className="font-medium text-base-content dark:text-base-content">
                            {product?.name || "Product deleted"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <span>
                              {p.quantity} × ${p.price.toFixed(2)}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                statusColors[p.status] ||
                                "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>
                          {review && renderStars(review.rating)}
                        </div>
                        <div className="mt-2 sm:mt-0">
                          {product && (
                            <Link
                              to={`/customer/review/${product._id}`}
                              className="btn btn-outline btn-sm"
                            >
                              {review ? "Edit Review" : "Write Review"}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-right mt-4 font-bold text-base-content dark:text-base-content">
                Total: ${order.totalAmount.toFixed(2)}
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              className="btn btn-sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="px-2 text-sm font-semibold text-base-content dark:text-base-content">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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

export default CustomerOrders;
