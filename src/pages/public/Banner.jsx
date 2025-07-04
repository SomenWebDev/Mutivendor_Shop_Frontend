import React, { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { HashLink } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const tileVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -15, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      delay: i * 0.15 + 0.5,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
  hover: {
    rotateX: 10,
    scale: 1.07,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.1,
    },
  },
  float: {
    y: [0, -4, 0],
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 4,
      ease: "easeInOut",
      delay: 1,
    },
  },
};

const leftTextVariants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Utility function to assign nice gradient backgrounds dynamically
const gradients = [
  "bg-gradient-to-tr from-blue-500 to-indigo-600",
  "bg-gradient-to-tr from-pink-500 to-rose-600",
  "bg-gradient-to-tr from-emerald-500 to-green-600",
  "bg-gradient-to-tr from-yellow-400 to-amber-500",
  "bg-gradient-to-tr from-purple-500 to-violet-600",
  "bg-gradient-to-tr from-red-400 to-red-600",
];

const Banner = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/categories`
        );
        // Take first 4 categories
        setCategories(res.data.slice(0, 4));
      } catch (error) {
        toast.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleTileClick = (categoryName) => {
    const UpperCaseCategory = categoryName.toUpperCase();
    navigate(`/products?category=${encodeURIComponent(UpperCaseCategory)}`);
  };

  if (loading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-center
      bg-base-100 dark:bg-base-300 text-base-content transition-colors duration-500 p-6 sm:p-10 lg:p-16 overflow-hidden"
    >
      {/* Left: Animated Text */}
      <Motion.div
        className="w-full lg:w-1/2 space-y-6 text-center lg:text-left mb-10 lg:mb-0"
        initial="hidden"
        animate="visible"
        variants={leftTextVariants}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
          <span>Your One-Stop </span>
          <span className="text-blue-600 dark:text-blue-400">Marketplace</span>
        </h1>

        <p className="text-base sm:text-lg">
          Discover, shop, and support amazing vendors in one place. Quality
          products, direct from trusted sellers.
        </p>

        <HashLink
          smooth
          to="#products"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md shadow-lg font-semibold inline-block transition"
        >
          Browse Products
        </HashLink>
      </Motion.div>

      {/* Right: Dynamic Category Tiles */}
      <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 z-10 max-w-md sm:max-w-lg lg:max-w-full">
        {categories.map((cat, i) => (
          <Motion.div
            key={cat._id}
            className={`rounded-xl h-28 sm:h-36 flex items-center justify-center text-white font-semibold text-sm sm:text-lg shadow-xl cursor-pointer transition-transform hover:shadow-2xl ${
              gradients[i % gradients.length]
            }`}
            custom={i}
            variants={tileVariants}
            initial="hidden"
            animate={["visible", "float"]}
            whileHover="hover"
            onClick={() => handleTileClick(cat.name)}
          >
            {cat.name.toUpperCase()}
          </Motion.div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
