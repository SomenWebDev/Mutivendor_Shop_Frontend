import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPublicReviews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/reviews/public?limit=4`
        );
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicReviews();
  }, []);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-base-200 dark:bg-base-300 transition-colors duration-300">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-base-content">
        What Our Customers Say
      </h2>

      {loading ? (
        <p className="text-center py-10 text-base-content">
          Loading reviews...
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-base-100 dark:bg-base-200 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700 text-base-content"
              >
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < review.rating
                          ? "text-yellow-400"
                          : "text-gray-400 dark:text-gray-600"
                      }
                      size={16}
                    />
                  ))}
                </div>
                <p className="text-sm text-base-content mb-2">
                  {review.comment}
                </p>
                <p className="text-xs italic font-medium text-base-content">
                  — {review.user?.name || "Anonymous"}
                </p>
                <p className="text-xs mt-2 font-bold text-blue-700 dark:text-blue-400">
                  Product: {review.product?.name}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/reviews"
              className="inline-block px-8 py-3 border border-blue-700 text-blue-700 rounded-lg font-semibold
                hover:bg-blue-700 hover:text-white transition-colors duration-300
                dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-500 dark:hover:text-white"
            >
              See All Reviews
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Reviews;
