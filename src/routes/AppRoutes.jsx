import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/protected/ProtectedRoute";

// Layouts
import CustomerLayout from "../layouts/CustomerLayout";
import VendorLayout from "../layouts/VendorLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/customer/Login";
import CustomerRegister from "../pages/customer/Register";
import VendorRegister from "../pages/vendor/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VendorLogin from "../pages/vendor/Login";
import AdminLogin from "../pages/admin/Login";
import CustomerVerify from "../pages/customer/Verify";
import VendorVerify from "../pages/vendor/Verify";
import SocialSuccess from "../pages/customer/SocialSuccess";
import AllProducts from "../pages/public/AllProducts";
import CartPage from "../pages/customer/CartPage";
import SeeAllReviews from "../pages/public/SeeAllReviews";

// Customer Pages
import Checkout from "../pages/customer/Checkout";
import CustomerOrders from "../pages/customer/CustomerOrders";
import ProductReviewPage from "../pages/customer/ProductReviewPage";
import PaymentSuccess from "../pages/customer/PaymentSuccess";
import PaymentCancel from "../pages/customer/PaymentCancel";

// Vendor Pages
import CreateProduct from "../pages/vendor/CreateProduct";
import ManageProducts from "../pages/vendor/ManageProducts";
import VendorOrders from "../pages/vendor/Orders";
import Earnings from "../pages/vendor/Earnings";
import VendorDashboard from "../pages/vendor/Dashboard";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import Vendors from "../pages/admin/Vendors";
import AdminManageProducts from "../pages/admin/ManageProducts";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminOrders from "../pages/admin/AdminOrders";

// NotFound Page
import NotFound from "../pages/NotFound"; // 👈 Add this import

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes under Customer Layout */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/customer/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/customer" element={<CustomerRegister />} />
        <Route path="/register/vendor" element={<VendorRegister />} />
        <Route path="/verify/customer" element={<CustomerVerify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/social-success" element={<SocialSuccess />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/reviews" element={<SeeAllReviews />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login/vendor" element={<VendorLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/verify/vendor" element={<VendorVerify />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
          <Route path="/customer/checkout" element={<Checkout />} />
          <Route path="/customer/orders" element={<CustomerOrders />} />
          <Route
            path="/customer/review/:productId"
            element={<ProductReviewPage />}
          />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
        </Route>
      </Route>

      {/* Vendor Routes */}
      <Route element={<VendorLayout />}>
        <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/create-product" element={<CreateProduct />} />
          <Route path="/vendor/manage-products" element={<ManageProducts />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
          <Route path="/vendor/earnings" element={<Earnings />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/vendors" element={<Vendors />} />
          <Route
            path="/admin/manage-products"
            element={<AdminManageProducts />}
          />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
      </Route>

      {/* Catch-all 404 Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
