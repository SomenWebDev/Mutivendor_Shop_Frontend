import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { getUserFromToken, getToken } from "../../utils/auth";
import { useCart } from "../../context/useCart";
import {
  FaShoppingCart,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();
  const user = getUserFromToken();
  const { cartItems } = useCart();
  const [isDark, setIsDark] = useState(false);

  const isAuthPage = [
    "/login",
    "/register/customer",
    "/register/vendor",
    "/verify/customer",
    "/verify/vendor",
    "/login/vendor",
    "/login/admin",
    "/forgot-password",
  ].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setIsDark(savedTheme === "dark");
  }, []);

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4">
      {/* Left: Brand */}
      <div className="flex-1">
        <HashLink
          smooth
          to="/"
          className="text-2xl font-bold text-primary hover:text-secondary"
        >
          MultiVendorShop
        </HashLink>
      </div>

      {/* Mobile Menu */}
      <div className="flex-none lg:hidden">
        <details className="dropdown dropdown-end">
          <summary className="btn btn-ghost">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </summary>
          <ul className="menu dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-60 max-h-[75vh] overflow-y-auto">
            {!isAuthPage && (
              <>
                <li>
                  <HashLink to="/#products">Products</HashLink>
                </li>
                <li>
                  <HashLink to="/#reviews">Reviews</HashLink>
                </li>
                <li>
                  <HashLink to="/#contact">Contact</HashLink>
                </li>
              </>
            )}

            {/* Customer-specific mobile items */}
            {(!user || user.role === "customer") && !isAuthPage && (
              <>
                <li>
                  <button onClick={() => navigate("/cart")}>
                    <FaShoppingCart /> Cart ({cartItems.length})
                  </button>
                </li>
                {user && (
                  <li>
                    <button onClick={() => navigate("/customer/orders")}>
                      Order History
                    </button>
                  </li>
                )}
              </>
            )}

            {/* Not Logged In */}
            {!token ? (
              !isAuthPage && (
                <>
                  <li>
                    <HashLink to="/login">Login</HashLink>
                  </li>
                  <li>
                    <HashLink to="/register/customer">Customer Signup</HashLink>
                  </li>
                  <li>
                    <HashLink to="/register/vendor">Vendor Signup</HashLink>
                  </li>
                </>
              )
            ) : (
              <>
                {user?.role === "vendor" && (
                  <li>
                    <HashLink to="/vendor/dashboard">Vendor Dashboard</HashLink>
                  </li>
                )}
                {user?.role === "admin" && (
                  <li>
                    <HashLink to="/admin/dashboard">Admin Panel</HashLink>
                  </li>
                )}
                <li className="text-sm font-medium px-4 py-2">
                  <FaUserCircle className="inline-block mr-2" />
                  {user?.name}
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 flex gap-2 items-center"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            )}

            {/* Theme Toggle */}
            <li>
              <button onClick={toggleTheme} className="flex items-center gap-2">
                {isDark ? (
                  <>
                    <FaSun /> Light Mode
                  </>
                ) : (
                  <>
                    <FaMoon /> Dark Mode
                  </>
                )}
              </button>
            </li>
          </ul>
        </details>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center space-x-4">
        {!isAuthPage && (
          <>
            <HashLink to="/#products" className="btn btn-ghost btn-sm">
              Products
            </HashLink>
            <HashLink to="/#reviews" className="btn btn-ghost btn-sm">
              Reviews
            </HashLink>
            <HashLink to="/#contact" className="btn btn-ghost btn-sm">
              Contact
            </HashLink>
          </>
        )}

        {/* Cart & Order (Customer only) */}
        {(!user || user.role === "customer") && !isAuthPage && (
          <>
            <button
              onClick={() => navigate("/cart")}
              className="btn btn-ghost relative"
            >
              <FaShoppingCart />
              {cartItems.length > 0 && (
                <span className="badge badge-sm badge-primary absolute -top-1 -right-2">
                  {cartItems.length}
                </span>
              )}
            </button>
            {user && (
              <button
                className="btn btn-ghost"
                onClick={() => navigate("/customer/orders")}
              >
                Order History
              </button>
            )}
          </>
        )}

        {/* Auth Buttons / Dashboard */}
        {!token ? (
          !isAuthPage && (
            <>
              <HashLink to="/login" className="btn btn-ghost btn-sm">
                Login
              </HashLink>
              <HashLink
                to="/register/customer"
                className="btn btn-outline btn-sm"
              >
                Customer Signup
              </HashLink>
              <HashLink
                to="/register/vendor"
                className="btn btn-outline btn-primary btn-sm"
              >
                Vendor Signup
              </HashLink>
            </>
          )
        ) : (
          <>
            {user?.role === "vendor" && (
              <HashLink to="/vendor/dashboard" className="btn btn-ghost btn-sm">
                <FaTachometerAlt />
              </HashLink>
            )}
            {user?.role === "admin" && (
              <HashLink to="/admin/dashboard" className="btn btn-ghost btn-sm">
                <FaTachometerAlt />
              </HashLink>
            )}
            <div className="flex items-center gap-2">
              <FaUserCircle />
              <span className="text-sm">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="btn btn-error btn-sm text-white"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </>
        )}

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {isDark ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
