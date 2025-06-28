//component//pages//home.jsx
import React from "react";

import Banner from "./public/Banner";
import ProductList from "./public/ProductList";
import Reviews from "./public/Reviews";
import Contact from "./public/Contact";
import Footer from "../components/shared/Footer";

const Home = () => {
  return (
    <div>
      <Banner />

      {/* Add IDs for HashLink navigation */}
      <div id="products">
        <ProductList />
      </div>

      <div id="reviews">
        <Reviews />
      </div>

      <div id="contact">
        <Contact />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
