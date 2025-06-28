import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem("verifyToken");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-email`,
        { email, code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      localStorage.removeItem("verifyToken");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  if (!email)
    return (
      <div className="text-center mt-10 text-error">
        Email not provided. Please register again.
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 dark:bg-base-300 px-4">
      <div className="card w-full max-w-md p-6 bg-base-100 dark:bg-base-100 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-base-content dark:text-base-content">
          Verify Email
        </h2>

        {message && (
          <div className="text-green-600 dark:text-green-400 text-sm mb-2 text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="text-error text-sm mb-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="code"
            placeholder="Verification code"
            className="input input-bordered w-full dark:bg-base-200 dark:text-base-content"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
