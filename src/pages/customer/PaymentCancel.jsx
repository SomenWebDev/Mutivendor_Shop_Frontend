import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 bg-red-50 dark:bg-base-200 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
        Payment Cancelled ❌
      </h1>
      <p className="text-base sm:text-lg mb-6 text-gray-700 dark:text-base-content">
        It looks like your payment was cancelled. You can try again or update
        your order.
      </p>
      <Link
        to="/customer/checkout"
        className="btn bg-red-600 text-white hover:bg-red-700 border-none px-6 py-3"
      >
        Back to Checkout
      </Link>
    </div>
  );
};

export default PaymentCancel;
