import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/useCart";

const PaymentSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 bg-green-50 dark:bg-base-200 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
        Payment Successful 🎉
      </h1>
      <p className="text-base sm:text-lg mb-6 text-gray-700 dark:text-base-content">
        Thank you for your order! Your payment was successful and we’re
        processing your order.
      </p>
      <Link
        to="/customer/orders"
        className="btn bg-green-600 text-white hover:bg-green-700 border-none px-6 py-3"
      >
        View My Orders
      </Link>
    </div>
  );
};

export default PaymentSuccess;
