import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        ...formData,
        role: "customer",
      });
      const token = res.data.token;
      localStorage.setItem("verifyToken", token);
      navigate("/verify/customer", { state: { email: formData.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 dark:bg-base-300 px-4">
      <div className="card w-full max-w-md bg-base-100 dark:bg-base-100 shadow-xl p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4 text-base-content dark:text-base-content">
          Customer Register
        </h2>

        {error && (
          <div className="text-error text-sm mb-2 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="input input-bordered w-full dark:bg-base-200 dark:text-base-content"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full dark:bg-base-200 dark:text-base-content"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input input-bordered w-full dark:bg-base-200 dark:text-base-content"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-base-content dark:text-base-content">
          Want to register as a vendor?{" "}
          <a href="/register/vendor" className="text-primary">
            Register here
          </a>
        </p>
        <p className="text-sm text-center mt-2 text-base-content dark:text-base-content">
          Already have an account?{" "}
          <a href="/login" className="text-primary">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
