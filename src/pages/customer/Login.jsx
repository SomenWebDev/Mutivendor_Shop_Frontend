/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { jwtDecode } from "jwt-decode";
import { getUserFromToken } from "../../utils/auth";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      navigate(`/${user.role}/home`);
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
        expectedRole: "customer",
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: decoded.id || decoded.userId,
          name: decoded.name,
          role: decoded.role,
        })
      );

      navigate(`/${decoded.role}/home`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, {
        id_token: idToken,
        role: "customer",
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const user = jwtDecode(token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id || user.userId,
          name: user.name,
          role: user.role,
        })
      );

      navigate(`/${user.role}/home`);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setError("Google login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-base-200 dark:bg-base-200">
      <div className="card w-full max-w-md p-6 sm:p-8 bg-base-100 shadow-lg dark:bg-base-100">
        <h2 className="text-2xl font-bold mb-4 text-center text-base-content dark:text-base-content">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="input input-bordered w-full dark:bg-base-200 dark:text-base-content"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input input-bordered w-full dark:bg-base-200 dark:text-base-content"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-2 text-base-content dark:text-base-content">
          <a href="/forgot-password" className="text-primary">
            Forgot Password?
          </a>
        </p>

        <div className="divider text-base-content dark:text-base-content">
          OR
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="btn btn-outline w-full flex items-center justify-center gap-2 dark:border-base-content dark:text-base-content"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <p className="text-sm text-center mt-4 text-base-content dark:text-base-content">
          Don't have an account?{" "}
          <a href="/register/customer" className="text-primary">
            Register as Customer
          </a>{" "}
          /{" "}
          <a href="/register/vendor" className="text-primary">
            Register as Vendor
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
