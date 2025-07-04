import React, { useEffect, useState } from "react";
import { useCart } from "../../context/useCart";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [items, setItems] = useState(cartItems);

  useEffect(() => {
    setItems(cartItems); // Sync cart when it updates
  }, [cartItems]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/customer/checkout");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen bg-base-200 dark:bg-base-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-base-content dark:text-base-content">
        Your Cart
      </h2>

      {items.length === 0 ? (
        <p className="text-base-content dark:text-base-content">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item) => {
              const atMax = item.quantity >= item.stock;

              return (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row gap-4 items-center border-b border-base-300 pb-4"
                >
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                            item.image
                          }`
                    }
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded border"
                  />

                  <div className="flex-1 w-full">
                    <h3 className="font-semibold text-base-content dark:text-base-content">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${item.price} × {item.quantity}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Stock: {item.stock}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span className="text-base-content dark:text-base-content">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        !atMax &&
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={atMax}
                    >
                      +
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-right mt-6 text-lg font-bold text-base-content dark:text-base-content">
            Total: ${total.toFixed(2)}
          </div>

          <button
            onClick={handleCheckout}
            className="btn btn-primary w-full mt-4"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
