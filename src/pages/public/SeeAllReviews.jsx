import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

const SeeAllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/public`,
        {
          params: { page, limit: 12 },
        }
      );
      setReviews(res.data.reviews || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  return (
    <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto bg-base-200 dark:bg-base-300 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-center mb-8 text-base-content dark:text-white">
        All Customer Reviews
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No reviews yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-base-100 dark:bg-base-200 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < review.rating
                          ? "text-yellow-500"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm text-base-content mb-2">
                  {review.comment}
                </p>
                <p className="text-xs italic font-medium text-base-content dark:text-white">
                  — {review.user?.name || "Anonymous"}
                </p>
                <p className="text-xs mt-2 font-bold text-blue-600 dark:text-blue-400">
                  Product: {review.product?.name}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              className="btn btn-sm bg-base-100 dark:bg-base-200 text-base-content"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="px-2 py-1 rounded text-sm font-semibold text-base-content dark:text-base-content">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-sm bg-base-100 dark:bg-base-200 text-base-content"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SeeAllReviews;
