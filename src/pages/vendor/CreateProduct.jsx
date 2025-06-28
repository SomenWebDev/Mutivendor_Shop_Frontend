import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateProduct() {
  const fileInputRef = useRef(null);
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
    categoryName: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        setCategories(res.data);
      } catch (error) {
        toast.error("Failed to load categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, stock, image, categoryName } = formData;

    if (!name || !price || !stock || !image || !categoryName) {
      toast.error("All required fields must be filled.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("image", formData.image);
      data.append("categoryName", formData.categoryName);

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/vendor/products`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: null,
        categoryName: "",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-base-100 dark:bg-base-200 p-6 sm:p-8 rounded-lg shadow-md text-base-content transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea textarea-bordered w-full"
            rows={3}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">
            Price ($)<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input input-bordered w-full"
            step="0.01"
            min="0"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block mb-1 font-medium">
            Stock Quantity<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="input input-bordered w-full"
            min="0"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">
            Category<span className="text-red-500">*</span>
          </label>
          {!useNewCategory ? (
            <select
              name="categoryName"
              value={formData.categoryName}
              onChange={(e) => {
                if (e.target.value === "_new") {
                  setUseNewCategory(true);
                  setFormData((prev) => ({ ...prev, categoryName: "" }));
                } else {
                  setFormData((prev) => ({
                    ...prev,
                    categoryName: e.target.value,
                  }));
                }
              }}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="_new">Enter new category</option>
            </select>
          ) : (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="categoryName"
                placeholder="Enter new category"
                value={formData.categoryName}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
              <button
                type="button"
                onClick={() => setUseNewCategory(false)}
                className="btn btn-sm btn-outline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">
            Product Image<span className="text-red-500">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
