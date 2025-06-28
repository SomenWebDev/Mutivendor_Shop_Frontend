import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const ProductReviewForm = ({ productId }) => {
  const token = getToken();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchReview = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/customer/reviews/${productId}`,
        { headers }
      );
      if (data && data._id) {
        setReview(data);
        setRating(data.rating);
        setComment(data.comment);
      } else {
        setReview(null);
        setRating(0);
        setComment("");
      }
    } catch (err) {
      setReview(null);
      setRating(0);
      setComment("");
      console.log("No review found", err.response?.data?.message);
    }
  };

  useEffect(() => {
    if (productId && token) {
      fetchReview();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { rating, comment };

    try {
      if (review?._id) {
        await axios.put(
          `${API_BASE_URL}/api/customer/reviews/${review._id}`,
          payload,
          { headers }
        );
        toast.success("Review updated");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/customer/reviews/${productId}`,
          payload,
          { headers }
        );
        toast.success("Review added");
      }

      navigate("/customer/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Review submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!review?._id) return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/api/customer/reviews/${review._id}`, {
        headers,
      });
      toast.success("Review deleted");
      navigate("/customer/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 dark:bg-base-200 p-4 sm:p-6 rounded-lg shadow w-full"
    >
      <h3 className="text-lg font-bold mb-3 text-base-content dark:text-base-content">
        {review ? "Edit your review" : "Leave a review"}
      </h3>

      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer text-2xl transition ${
              star <= rating
                ? "text-yellow-500"
                : "text-gray-400 dark:text-gray-600"
            }`}
          />
        ))}
      </div>

      <textarea
        className="textarea textarea-bordered w-full mb-4 dark:bg-base-100 dark:text-base-content"
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="submit"
          className="btn btn-primary w-full sm:w-auto"
          disabled={loading || rating === 0}
        >
          {loading ? "Saving..." : review ? "Update" : "Submit"}
        </button>
        {review && review._id && (
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-error w-full sm:w-auto"
            disabled={loading}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductReviewForm;
