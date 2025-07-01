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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

      {/* Mobile Menu Button */}
      <div className="flex-none lg:hidden">
        <button
          className="btn btn-ghost"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
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
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-4 mt-2 z-50 bg-base-100 shadow rounded-box w-60 p-3 max-h-[75vh] overflow-y-auto">
          <ul className="menu space-y-1">
            {!isAuthPage && (
              <>
                <li>
                  <HashLink
                    to="/#products"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Products
                  </HashLink>
                </li>
                <li>
                  <HashLink
                    to="/#reviews"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Reviews
                  </HashLink>
                </li>
                <li>
                  <HashLink
                    to="/#contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </HashLink>
                </li>
              </>
            )}

            {(!user || user.role === "customer") && !isAuthPage && (
              <>
                <li>
                  <button
                    onClick={() => {
                      navigate("/cart");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <FaShoppingCart /> Cart ({cartItems.length})
                  </button>
                </li>
                {user && (
                  <li>
                    <button
                      onClick={() => {
                        navigate("/customer/orders");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Order History
                    </button>
                  </li>
                )}
              </>
            )}

            {!token ? (
              !isAuthPage && (
                <>
                  <li>
                    <HashLink
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </HashLink>
                  </li>
                  <li>
                    <HashLink
                      to="/register/customer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Customer Signup
                    </HashLink>
                  </li>
                  <li>
                    <HashLink
                      to="/register/vendor"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Vendor Signup
                    </HashLink>
                  </li>
                </>
              )
            ) : (
              <>
                {user?.role === "vendor" && (
                  <li>
                    <HashLink
                      to="/vendor/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Vendor Dashboard
                    </HashLink>
                  </li>
                )}
                {user?.role === "admin" && (
                  <li>
                    <HashLink
                      to="/admin/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </HashLink>
                  </li>
                )}
                <li className="text-sm font-medium px-4 py-2">
                  <FaUserCircle className="inline-block mr-2" />
                  {user?.name}
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-red-600 flex gap-2 items-center"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            )}

            <li>
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2"
              >
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
        </div>
      )}

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

        <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
          {isDark ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
