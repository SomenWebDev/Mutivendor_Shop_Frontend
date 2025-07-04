import React, { useState, useEffect } from "react";
import { useCart } from "../../context/useCart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromToken } from "../../utils/auth";
import axios from "axios";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const user = getUserFromToken();

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Auto-fill user's name on mount
    setShippingInfo((prev) => ({
      ...prev,
      name: user.name || "",
    }));
  }, [user, navigate]);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleProceed = async () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast.error("Please fill in all shipping fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/payment/create-checkout-session`,
        {
          customerId: user.id,
          cartItems,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Something went wrong with Stripe");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment session failed");
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared!");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-base-200 dark:bg-base-300 min-h-screen rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-base-content dark:text-base-content">
        Checkout
      </h2>

      {/* Shipping Info */}
      <div className="mb-6 bg-base-100 dark:bg-base-200 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-base-content dark:text-base-content">
          Shipping Details
        </h3>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-base-content">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="input input-bordered w-full dark:bg-base-100 dark:text-base-content"
              value={shippingInfo.name}
              onChange={handleChange}
              readOnly // optional
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-base-content">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+880 1XXXXXXXXX"
              className="input input-bordered w-full dark:bg-base-100 dark:text-base-content"
              value={shippingInfo.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-base-content">
              Full Address
            </label>
            <textarea
              name="address"
              placeholder="123 Main St, City, ZIP"
              className="textarea textarea-bordered w-full min-h-[100px] dark:bg-base-100 dark:text-base-content"
              value={shippingInfo.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      <div className="mb-6 bg-base-100 dark:bg-base-200 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-base-content dark:text-base-content">
          Order Summary
        </h3>
        {cartItems.length === 0 ? (
          <p className="text-base-content">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between border-b pb-2 text-base-content"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.quantity} × ${item.price}
                  </p>
                </div>
                <p>${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            ))}
            <div className="text-right font-bold text-lg text-base-content">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleProceed}
          disabled={cartItems.length === 0}
          className="btn btn-primary flex-1"
        >
          Proceed to Payment
        </button>
        <button
          onClick={handleClearCart}
          disabled={cartItems.length === 0}
          className="btn btn-outline btn-error flex-1"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Checkout;
