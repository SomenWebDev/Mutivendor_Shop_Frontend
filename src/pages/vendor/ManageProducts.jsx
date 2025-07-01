/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/categories`
        );
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/vendor/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { search, page },
        }
      );

      const { products = [], totalPages = 1 } = res.data;
      setProducts(products);
      setTotalPages(totalPages);
    } catch (err) {
      toast.error("Failed to fetch products.", err);
      setProducts([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const handleEdit = (product) => {
    setEditProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      stock: product.stock || 0,
      categoryId: product.category?._id || "",
      newCategoryName: "",
    });
  };

  const handleCancel = () => {
    setEditProductId(null);
    setFormData({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (productId) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      if (formData.image) data.append("image", formData.image);

      const categoryNameToSend =
        formData.newCategoryName ||
        categories.find((c) => c._id === formData.categoryId)?.name;

      if (categoryNameToSend) {
        data.append("categoryName", categoryNameToSend);
      }

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/vendor/products/${productId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Product updated!");
      await fetchProducts();
      handleCancel();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/vendor/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product deleted.");
      await fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product.", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-base-content">
        Manage Products
      </h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
          className="input input-bordered w-full sm:max-w-md"
        />
      </div>

      {products.length === 0 ? (
        <p className="text-base-content">No products found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="table table-zebra w-full text-sm">
              <thead className="bg-base-200 text-base-content">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price ($)</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) =>
                  editProductId === product._id ? (
                    <tr key={product._id}>
                      <td>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleChange}
                          ref={fileInputRef}
                          className="file-input file-input-sm file-input-bordered"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input input-sm input-bordered"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="input input-sm input-bordered"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          className="input input-sm input-bordered"
                        />
                      </td>
                      <td>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                          className="select select-sm select-bordered w-full mb-1"
                        >
                          <option value="">Select category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          name="newCategoryName"
                          value={formData.newCategoryName}
                          onChange={handleChange}
                          placeholder="Or enter new category"
                          className="input input-sm input-bordered w-full"
                        />
                      </td>
                      <td>
                        <span className="badge badge-info">Editing</span>
                      </td>
                      <td className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleSave(product._id)}
                          disabled={loading}
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.stock ?? 0}</td>
                      <td>{product.category?.name || "N/A"}</td>
                      <td>
                        {product.isApproved ? (
                          <span className="badge badge-success">Approved</span>
                        ) : (
                          <span className="badge badge-warning">Pending</span>
                        )}
                      </td>
                      <td>
                        <div className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleDelete(product._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
            <button
              className="btn btn-sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProducts;
