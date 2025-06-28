import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
} from "react-icons/fi";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login/admin");
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDark(!isDark);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    setIsDark(saved === "dark");
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiHome /> },
    { label: "Vendors", path: "/admin/vendors", icon: <FiUsers /> },
    {
      label: "Products",
      path: "/admin/manage-products",
      icon: <FiClipboard />,
    },
    { label: "Users", path: "/admin/users", icon: <FiUsers /> },
    { label: "Orders", path: "/admin/orders", icon: <FiClipboard /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Static sidebar for md+ */}
      <aside className="hidden md:flex md:w-64 bg-base-100 shadow-lg p-4 flex-col justify-between sticky top-0 h-screen">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-base-content">
            Admin Panel
          </h2>
          <nav className="space-y-1">
            {navItems.map(({ label, path, icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-all font-medium ${
                    isActive
                      ? "bg-primary text-primary-content"
                      : "text-base-content hover:bg-base-200"
                  }`
                }
              >
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t mt-6 space-y-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-error hover:text-error-content hover:bg-error w-full px-4 py-2 rounded-md transition-all"
          >
            <FiLogOut className="text-lg" />
            <span>Logout</span>
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-md bg-base-200 hover:bg-base-300 transition text-base-content"
          >
            {isDark ? <FiSun /> : <FiMoon />}
            <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 md:hidden">
          <div className="w-64 bg-base-100 h-full p-4 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <FiX className="text-xl" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map(({ label, path, icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-md transition-all font-medium ${
                        isActive
                          ? "bg-primary text-primary-content"
                          : "text-base-content hover:bg-base-200"
                      }`
                    }
                  >
                    <span className="text-lg">{icon}</span>
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="pt-6 border-t mt-6 space-y-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-error hover:text-error-content hover:bg-error w-full px-4 py-2 rounded-md transition-all"
              >
                <FiLogOut className="text-lg" />
                <span>Logout</span>
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-md bg-base-200 hover:bg-base-300 transition text-base-content"
              >
                {isDark ? <FiSun /> : <FiMoon />}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-base-200 min-h-screen">
        {/* Mobile top nav */}
        <div className="md:hidden p-4 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="btn">
            <FiMenu />
          </button>
          <h2 className="text-xl font-semibold">Admin</h2>
        </div>

        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
