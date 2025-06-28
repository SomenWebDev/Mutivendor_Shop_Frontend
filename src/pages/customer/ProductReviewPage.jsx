import React from "react";
import { useParams } from "react-router-dom";
import ProductReviewForm from "./ProductReviewForm";

const ProductReviewPage = () => {
  const { productId } = useParams();

  return (
    <div className="min-h-screen bg-base-200 dark:bg-base-300 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-base-100 dark:bg-base-100 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-base-content dark:text-base-content">
          Product Review
        </h2>
        <ProductReviewForm productId={productId} />
      </div>
    </div>
  );
};

export default ProductReviewPage;
