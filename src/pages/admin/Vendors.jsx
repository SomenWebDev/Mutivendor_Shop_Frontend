import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/vendors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVendors(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/vendors/approve/${vendorId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Vendor approved");
      fetchVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  const handleDelete = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/vendors/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Vendor deleted");
      fetchVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Deletion failed");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-base-100 text-base-content rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Manage Vendors</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : vendors.length === 0 ? (
        <p className="text-center">No vendors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra border border-base-300">
            <thead className="bg-base-200">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>{vendor.name}</td>
                  <td>{vendor.email}</td>
                  <td>
                    <span
                      className={`badge ${
                        vendor.isVendorApproved
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {vendor.isVendorApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="flex flex-wrap gap-2">
                    {!vendor.isVendorApproved && (
                      <button
                        onClick={() => handleApprove(vendor._id)}
                        className="btn btn-sm btn-success"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(vendor._id)}
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
      )}
    </div>
  );
};

export default Vendors;
