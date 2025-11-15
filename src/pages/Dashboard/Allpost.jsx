import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaTrash, FaSpinner, FaUtensils, FaClock } from "react-icons/fa";
import dayjs from "dayjs";
import useUserRole from "../../hooks/useUserRole";


const PRIMARY = "#ff6a00";

const Allpost = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { role: currentUserRole, isLoading: roleLoading } = useUserRole();
  const [deletingId, setDeletingId] = useState(null);

  // fetch available posts (uses your existing backend endpoint)
  const {
    data: posts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["available-food"],
    queryFn: async () => {
      const res = await axiosSecure.get("/available-food");
      return res.data;
    },

  });

  const handleDelete = async (post) => {
    const result = await Swal.fire({
      title: `Delete "${post.name}"?`,
      text: "This will permanently remove the post. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: PRIMARY,
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(post._id);
      // call secure delete endpoint
      const res = await axiosSecure.delete(`/foods/${post._id}`);

      if (res.data?.deletedCount > 0) {
        Swal.fire("Deleted", `"${post.name}" has been deleted.`, "success");
        queryClient.invalidateQueries(["available-food"]);
        // if you also show dashboard counts etc:
        queryClient.invalidateQueries(["dashboard-data"]);
      } else {
        Swal.fire("Failed", "Could not delete the post.", "error");
      }
    } catch (err) {
      console.error("Delete post error:", err);
      Swal.fire("Error", "An error occurred while deleting. Check server logs.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || roleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FaSpinner className="text-4xl animate-spin" style={{ color: PRIMARY }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600">
        Failed to load posts.
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">All Posts</h2>

        </div>

        {posts.length === 0 ? (
          <div className="p-8 bg-white rounded-lg shadow text-center">No posts found.</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Post</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Posted By</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Expire</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {posts.map((p, idx) => {
                    const ownerEmail = p.userEmail;

                    const canDelete = ["admin", "super-admin"].includes(currentUserRole);

                    return (
                      <tr key={p._id}>
                        <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <img src={p.img || "/placeholder.png"} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{p.name}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{p.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 break-words">{ownerEmail || "Unknown"}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {p.expire ? dayjs(p.expire).format("DD MMM, YYYY") : <span className="text-gray-400">N/A</span>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {canDelete ? (
                            <button
                              onClick={() => handleDelete(p)}
                              disabled={deletingId === p._id}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
                            >
                              {deletingId === p._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                              Delete
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-4">
              {posts.map((p) => {
                const ownerEmail = p.userEmail;
                const canDelete = ["admin", "super-admin"].includes(currentUserRole);

                return (
                  <div key={p._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                        <img src={p.img || "/placeholder.png"} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{p.name}</div>
                        <div className="text-sm text-gray-500 break-words">{p.description}</div>
                        <div className="text-sm text-gray-500 mt-2">By: {ownerEmail || "Unknown"}</div>
                        <div className="text-sm text-gray-500 mt-1">Expire: {p.expire ? dayjs(p.expire).format("DD MMM, YYYY") : "N/A"}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      {canDelete ? (
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={deletingId === p._id}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                        >
                          {deletingId === p._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                          Delete
                        </button>
                      ) : (
                        <div className="flex-1 text-center text-sm text-gray-400 py-2 rounded-md border">No action</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Allpost;
