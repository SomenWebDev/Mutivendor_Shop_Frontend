import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { search, page },
      });

      const { products, totalPages } = res.data;
      setProducts(products);
      setTotalPages(totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const handleApprove = async (id) => {
    try {
      await axios.put(
       `${import.meta.env.VITE_API_BASE_URL}/api/admin/products/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product approved");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to approve product", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
       `${import.meta.env.VITE_API_BASE_URL}/api/admin/products/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product rejected");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to reject product", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-base-100 text-base-content rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Product Moderation</h2>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra border border-base-300">
              <thead>
                <tr className="bg-base-200">
                  <th>Name</th>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Approved</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.vendor?.name || "N/A"}</td>
                    <td>{p.category?.name || "N/A"}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>{p.isApproved ? "Yes" : "No"}</td>
                    <td className="flex flex-wrap gap-2">
                      {!p.isApproved ? (
                        <button
                          onClick={() => handleApprove(p._id)}
                          className="btn btn-sm btn-success"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReject(p._id)}
                          className="btn btn-sm btn-warning"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="btn btn-sm btn-error text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              className="btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span className="font-semibold text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminManageProducts;
