import React from "react";
import { motion as Motion } from "framer-motion";
import { HashLink } from "react-router-hash-link";
import { useNavigate } from "react-router-dom";

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

const mockCards = [
  {
    title: "Gadget Deals",
    bg: "bg-gradient-to-tr from-blue-500 to-indigo-600",
  },
  {
    title: "Fashion Finds",
    bg: "bg-gradient-to-tr from-pink-500 to-rose-600",
  },
  {
    title: "Home Essential",
    bg: "bg-gradient-to-tr from-emerald-500 to-green-600",
  },
  {
    title: "Beauty Picks",
    bg: "bg-gradient-to-tr from-yellow-400 to-amber-500",
  },
];

const Banner = () => {
  const navigate = useNavigate();

  const handleTileClick = (category) => {
    const lowerCaseCategory = category.toLowerCase();
    navigate(`/products?category=${encodeURIComponent(lowerCaseCategory)}`);
  };

  return (
    <div
      className="min-h-[90vh] flex flex-col lg:flex-row items-center justify-center
      bg-base-100 dark:bg-black text-base-content dark:text-white p-6 sm:p-10 lg:p-16 overflow-hidden transition-colors duration-500"
    >
      {/* Left: Animated Text (always on top for small/medium) */}
      <Motion.div
        className="w-full lg:w-1/2 space-y-6 text-center lg:text-left mb-10 lg:mb-0"
        initial="hidden"
        animate="visible"
        variants={leftTextVariants}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-base-content dark:text-white">
          <span>Your One-Stop </span>
          <span className="text-blue-600 dark:text-blue-400">Marketplace</span>
        </h1>
        <p className="text-base sm:text-lg text-base-content dark:text-white">
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

      {/* Right: Category Tiles */}
      <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 z-10 max-w-md sm:max-w-lg lg:max-w-full">
        {mockCards.map((card, i) => (
          <Motion.div
            key={i}
            className={`rounded-xl h-28 sm:h-36 flex items-center justify-center text-white font-semibold text-sm sm:text-lg shadow-xl cursor-pointer transition-transform hover:shadow-2xl ${card.bg}`}
            custom={i}
            variants={tileVariants}
            initial="hidden"
            animate={["visible", "float"]}
            whileHover="hover"
            onClick={() => handleTileClick(card.title)}
          >
            {card.title}
          </Motion.div>
        ))}
      </div>
    </div>
  );
};

export default Banner;
