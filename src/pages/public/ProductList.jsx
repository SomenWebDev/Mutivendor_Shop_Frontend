import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/useCart";
import toast from "react-hot-toast";

const ProductList = () => {
  const { cartItems, addItem, updateItemQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchPublicProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/public?limit=10`
        );
        setProducts(res.data.products || []);
      } catch (error) {
        toast.error("Failed to fetch products");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProducts();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      toast.error("Please login to add products to cart");
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      toast.error("Sorry, this product is out of stock");
      return;
    }

    const existingItem = cartItems.find(
      (item) => item.productId === product._id
    );

    if (existingItem) {
      updateItemQuantity(product._id, existingItem.quantity + 1);
      toast.success(`Increased quantity of "${product.name}" in cart`);
    } else {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images?.[0]?.url || product.imageUrl || "",
        vendorId: product.vendorId || product.vendor?._id,
      });
      toast.success(`Added "${product.name}" to cart`);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-base-200 dark:bg-base-300 transition-colors duration-300 relative">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-base-content">
        Featured Products
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Scroll Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-[50%] transform -translate-y-1/2 z-10 bg-base-100 dark:bg-base-200 p-2 rounded-full shadow hover:scale-110 transition"
          >
            <FaChevronLeft className="text-base-content" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-2 top-[50%] transform -translate-y-1/2 z-10 bg-base-100 dark:bg-base-200 p-2 rounded-full shadow hover:scale-110 transition"
          >
            <FaChevronRight className="text-base-content" />
          </button>

          {/* Product Cards */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pb-4 scroll-smooth no-scrollbar"
          >
            {products.map((product) => (
              <div
                key={product._id}
                className="min-w-[220px] max-w-[220px] bg-base-100 dark:bg-base-200 border border-base-300 dark:border-base-100 shadow rounded-lg p-4 flex flex-col justify-between hover:shadow-xl transition text-base-content"
              >
                <img
                  src={
                    product.images?.[0]?.url ||
                    product.imageUrl ||
                    "/placeholder.jpg"
                  }
                  alt={product.name}
                  className="w-full h-40 object-cover rounded"
                />

                <div className="mt-2 flex-grow">
                  <h3 className="text-md font-semibold truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1 text-sm">
                    <span className="text-base-content/60 capitalize">
                      {product.category?.name || "Uncategorized"}
                    </span>
                    <span
                      className={`font-semibold ${
                        product.stock > 0
                          ? "text-green-600"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <p className="text-blue-600 dark:text-blue-400 font-bold mt-2">
                  ${product.price}
                </p>

                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className={`mt-2 px-3 py-2 flex items-center justify-center gap-2 rounded text-sm font-medium transition
                    ${
                      product.stock > 0
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-base-300 text-base-content/50 cursor-not-allowed"
                    }`}
                >
                  <FaShoppingCart />
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="btn btn-primary px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Browse All Products
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
