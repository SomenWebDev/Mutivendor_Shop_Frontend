/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../utils/auth";
import { jwtDecode } from "jwt-decode";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import toast from "react-hot-toast";

const VendorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      navigate(`/${user.role}/dashboard`);
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
        expectedRole: "vendor",
      });

      localStorage.setItem("token", res.data.token);
      navigate(`/${res.data.user.role}/dashboard`);
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
        role: "vendor",
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      const user = jwtDecode(token);
      navigate(`/${user.role}/dashboard`);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setError("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 transition-colors duration-300 px-4">
      <div className="card w-full max-w-md bg-base-100 text-base-content shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
          Vendor Login
        </h2>

        {error && (
          <p className="text-error text-sm text-center mb-2">{error}</p>
        )}

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

        <p className="text-sm text-center mt-2">
          <a href="/forgot-password" className="text-primary hover:underline">
            Forgot Password?
          </a>
        </p>

        <div className="divider text-base-content">OR</div>

        <button
          onClick={handleGoogleSignIn}
          className="btn btn-outline w-full flex items-center justify-center gap-2"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <a href="/register/vendor" className="text-primary hover:underline">
            Register as Vendor
          </a>{" "}
          /{" "}
          <a href="/register/customer" className="text-primary hover:underline">
            Register as Customer
          </a>
        </p>
      </div>
    </div>
  );
};

export default VendorLogin;
