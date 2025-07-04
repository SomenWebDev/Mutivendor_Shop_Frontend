import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { motion as Motion } from "framer-motion";
import { useCart } from "../../context/useCart";
import toast from "react-hot-toast";

const AllProducts = () => {
  const { cartItems, addItem, updateItemQuantity } = useCart();
  const [groupedProducts, setGroupedProducts] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const cat = queryParams.get("category") || "";
    setSelectedCategory(cat);
  }, [location.search]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => {
        setCategories(res.data || []);
      });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams({
          ...(selectedCategory && { category: selectedCategory }),
          search,
          page,
          limit: 8,
          sort,
        }).toString();

        const res = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/products/public/grouped?${query}`
        );

        setGroupedProducts(res.data.groupedProducts || {});
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        toast.error("Error fetching products");
        console.error("Error fetching grouped products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory, search, sort, page]);

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
      if (existingItem.quantity >= product.stock) {
        toast.error(`Only ${product.stock} item(s) available in stock`);
        return;
      }

      updateItemQuantity(product._id, existingItem.quantity + 1);
      toast.success(`Increased quantity of "${product.name}" in cart`);
    } else {
      addItem({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock, // ✅ crucial for reducer
        image: product.images?.[0]?.url || product.imageUrl || "",
        vendorId: product.vendorId || product.vendor?._id,
      });
      toast.success(`Added "${product.name}" to cart`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-base-200 dark:bg-base-300 rounded-lg shadow-md min-h-screen">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded w-full sm:max-w-xs bg-base-100 dark:bg-base-200 text-base-content dark:text-base-content focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => {
            const newCat = e.target.value;
            setSelectedCategory(newCat);
            setPage(1);
            navigate(newCat ? `?category=${newCat}` : "");
          }}
          className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-base-100 dark:bg-base-200 text-base-content dark:text-base-content"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded bg-base-100 dark:bg-base-200 text-base-content dark:text-base-content"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Products */}
      {Object.keys(groupedProducts).length === 0 ? (
        <p className="text-center text-base-content dark:text-base-content">
          No products found.
        </p>
      ) : (
        Object.entries(groupedProducts).map(([category, products]) => (
          <div key={category} className="mb-10">
            <Motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold mb-6 text-center text-base-content dark:text-base-content"
            >
              {category.toUpperCase()}
            </Motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const cartItem = cartItems.find(
                  (item) => item.productId === product._id
                );
                const atMaxQty = cartItem?.quantity >= product.stock;

                return (
                  <div
                    key={product._id}
                    className="bg-base-100 dark:bg-base-200 shadow rounded-lg p-4 flex flex-col justify-between hover:shadow-xl transition"
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
                    <div className="mt-3 flex-grow">
                      <h3 className="text-md font-semibold truncate text-base-content dark:text-base-content">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1 text-sm">
                        <span className="text-gray-500 dark:text-gray-400 capitalize">
                          {product.category?.name || "Uncategorized"}
                        </span>
                        <span
                          className={`font-semibold ${
                            product.stock > 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
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
                      disabled={product.stock === 0 || atMaxQty}
                      className={`mt-2 px-3 py-1 flex items-center justify-center gap-2 rounded text-sm font-medium transition ${
                        product.stock === 0 || atMaxQty
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <FaShoppingCart />
                      {product.stock === 0
                        ? "Out of Stock"
                        : atMaxQty
                        ? "Max Reached"
                        : "Add to Cart"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 text-base-content dark:text-base-content"
          >
            Prev
          </button>
          <span className="px-4 py-2 font-semibold text-base-content dark:text-base-content">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 text-base-content dark:text-base-content"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
