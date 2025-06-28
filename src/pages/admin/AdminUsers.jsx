import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { search, page },
        }
      );

      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-base-200 dark:bg-base-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-base-content dark:text-base-content">
        User Management
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input input-bordered w-full max-w-md dark:bg-base-100 dark:text-base-content"
        />
      </div>

      {loading ? (
        <p className="text-base-content dark:text-base-content">Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-base-content dark:text-base-content">
          No users found.
        </p>
      ) : (
        <>
          <div className="w-full overflow-x-auto rounded-md shadow-md">
            <table className="table w-full min-w-[600px] table-zebra">
              <thead>
                <tr>
                  <th className="text-base-content dark:text-base-content">
                    Name
                  </th>
                  <th className="text-base-content dark:text-base-content">
                    Email
                  </th>
                  <th className="text-base-content dark:text-base-content">
                    Role
                  </th>
                  <th className="text-base-content dark:text-base-content">
                    Registered
                  </th>
                  <th className="text-base-content dark:text-base-content">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="text-base-content dark:text-base-content">
                      {u.name}
                    </td>
                    <td className="text-base-content dark:text-base-content">
                      {u.email}
                    </td>
                    <td className="capitalize text-base-content dark:text-base-content">
                      {u.role}
                    </td>
                    <td className="text-base-content dark:text-base-content">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(u._id)}
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
          <div className="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="btn btn-sm w-full sm:w-auto"
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="font-semibold text-sm text-base-content dark:text-base-content">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="btn btn-sm w-full sm:w-auto"
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

export default AdminUsers;
