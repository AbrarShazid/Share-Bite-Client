import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import useUserRole from "../../../hooks/useUserRole";
import { FaUserShield, FaCrown, FaUserSlash, FaSpinner } from "react-icons/fa";

const PRIMARY = "#ff6a00";

const ManageAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { role: currentUserRole, isLoading: roleLoading } = useUserRole();

  const {
    data: admins = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-list"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/all-admins");
      return res.data;
    },
    enabled: !!currentUserRole, // wait until role resolved
    staleTime: 1000 * 60 * 2,
  });

  const handleDemote = async (adminUser) => {
    const confirmed = await Swal.fire({
      title: `Demote ${adminUser.name || adminUser.email}?`,
      text: "This will change their role from admin → user. This action can be reversed by promoting again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, demote",
      cancelButtonText: "Cancel",
      confirmButtonColor: PRIMARY,
    });

    if (!confirmed.isConfirmed) return;

    try {
      Swal.showLoading();
      const res = await axiosSecure.patch(`/admin/demote/${adminUser._id}`);
      if (res.data?.success || res.data?.modifiedCount > 0) {
        Swal.fire("Demoted", `${adminUser.name || adminUser.email} is now a user.`, "success");
        queryClient.invalidateQueries(["admin-list"]);
        queryClient.invalidateQueries(["dashboard-data"]);
      } else {
        Swal.fire("No change", res.data?.message || "Could not demote the user.", "info");
      }
    } catch (err) {
      console.error("Demote error:", err);
      Swal.fire("Error", "Failed to demote user. Check server logs.", "error");
    }
  };

  if (isLoading || roleLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl" style={{ color: PRIMARY }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-red-600">Failed to load admins.</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Manage Admins</h2>
         
        </div>

        {admins.length === 0 ? (
          <div className="p-8 bg-white rounded-lg shadow text-center">No admins found.</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Joined</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {admins.map((a, idx) => (
                  <tr key={a._id}>
                    <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{a.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 break-words">{a.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
                        <FaUserShield />
                        <span className="text-sm">{a.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {a.createdAt ? dayjs(a.createdAt).format("DD MMM, YYYY") : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {/* only allow demote for role === 'admin' (not super-admin) */}
                      {a.role === "admin" ? (
                        <button
                          onClick={() => handleDemote(a)}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
                        >
                          <FaUserSlash /> Demote
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAdmin;
