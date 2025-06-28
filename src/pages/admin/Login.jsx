/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../utils/auth";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        ...formData,
        expectedRole: "admin",
      });

      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="card w-full max-w-sm p-6 bg-base-100 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-base-content">
          Admin Login
        </h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-base-content">
          <a href="/forgot-password" className="text-primary hover:underline">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
