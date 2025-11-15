import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaBan, FaSpinner, FaUsers, FaEnvelope, FaCalendar, FaUserShield, FaCrown } from "react-icons/fa";
import dayjs from "dayjs";
import useUserRole from "../../hooks/useUserRole";

const PRIMARY_COLOR = "#ff6a00";
const HOVER_COLOR = "#e55a00";

const AllUser = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [banningUserId, setBanningUserId] = useState(null);
  const [promotingUserId, setPromotingUserId] = useState(null);
  const { role: currentUserRole, isLoading: roleLoading } = useUserRole();

  // Fetch all users
  const { data: users, isLoading, isError } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/all-users");
      return res.data;
    },
  });

  
  // Handler for banning/deleting a user
  const handleBanUser = async (userId, userName) => {
    const result = await Swal.fire({
      title: `Ban ${userName}?`,
      text: "This action is permanent and will delete the user from the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: PRIMARY_COLOR,
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete user!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setBanningUserId(userId);
        const res = await axiosSecure.delete(`/admin/delete-user/${userId}`);

        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", `${userName} has been removed.`, "success");
          queryClient.invalidateQueries(["all-users"]);
        } else {
          Swal.fire("Failed!", "Failed to delete user. User may not exist.", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "An error occurred while deleting the user. Check server logs.", "error");
      } finally {
        setBanningUserId(null);
      }
    }
  };

  // Handler for promoting a user to admin
  const handlePromoteToAdmin = async (userId, userName) => {
    const result = await Swal.fire({
      title: `Make ${userName} an Admin?`,
      text: "This user will gain administrative privileges and access to admin features.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: PRIMARY_COLOR,
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, promote to admin!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setPromotingUserId(userId);
        const res = await axiosSecure.patch(`/admin/make-admin/${userId}`);

        if (res.data?.success) {
          Swal.fire("Promoted!", `${userName} is now an administrator.`, "success");
          queryClient.invalidateQueries(["all-users"]);
        } else {
          Swal.fire("Failed!", "Failed to promote user. User may not exist.", "error");
        }
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "An error occurred while promoting the user. Check server logs.", "error");
      } finally {
        setPromotingUserId(null);
      }
    }
  };



  if (isLoading || roleLoading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl" style={{ color: PRIMARY_COLOR }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-xl text-red-600">
        ❌ Failed to load users. Please check your network or server connection.
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border-l-4" style={{ borderColor: PRIMARY_COLOR }}>
        <div className="flex items-center gap-4">
          <FaUsers className="text-4xl" style={{ color: PRIMARY_COLOR }} />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Manage All Users</h2>
            <p className="text-gray-500">Total Registered Users: <span className="font-semibold text-lg" style={{ color: PRIMARY_COLOR }}>{users?.length || 0}</span></p>
            {currentUserRole === 'super-admin' && (
              <p className="text-sm text-gray-600 mt-1">
                You can promote users to admin, also can ban them.
              </p>
            )}
            {currentUserRole === 'admin' && (
              <p className="text-sm text-gray-600 mt-1">
                You can ban users.
              </p>
            )}
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow">
          <p className="text-xl text-gray-600">No users found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider rounded-tl-xl">#</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Role</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold uppercase tracking-wider">Joined</th>
                    <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider rounded-tr-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-600">{index + 1}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 break-all max-w-[200px]">{user.email}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm capitalize font-medium">
                        <div className="flex items-center gap-2">
                          
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border bg-green-100 text-green-800 border-green-200`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-500">
                        {dayjs(user.createdAt).format("DD MMM, YYYY")}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex flex-col gap-2">
                          {/* Promote to Admin Button - Only show for super-admin and for regular users */}
                          {currentUserRole === 'super-admin' && user.role === 'user' && (
                            <button
                              onClick={() => handlePromoteToAdmin(user._id, user.name)}
                              disabled={promotingUserId === user._id}
                              className={`flex items-center justify-center w-full text-white px-3 py-2 rounded-lg transition duration-150 ease-in-out 
                                ${promotingUserId === user._id 
                                  ? 'bg-[#ff7f23]' 
                                  : 'bg-[#ff7f23] hover:bg-[#ff6c03]'}
                              `}
                            >
                              {promotingUserId === user._id ? (
                                <>
                                  <FaSpinner className="animate-spin mr-1" /> Promoting...
                                </>
                              ) : (
                                <>
                                  <FaUserShield className="mr-1 " /> Make Admin
                                </>
                              )}
                            </button>
                          )}
                          
                          {/* Ban Button - Don't show for super-admin and current user */}
                          {user.role !== 'super-admin' && (
                            <button
                              onClick={() => handleBanUser(user._id, user.name)}
                              disabled={banningUserId === user._id}
                              className={`flex items-center justify-center w-full text-white px-3 py-2 rounded-lg transition duration-150 ease-in-out 
                                ${banningUserId === user._id 
                                  ? 'bg-red-400' 
                                  : 'bg-red-600 hover:bg-red-700'}
                              `}
                            >
                              {banningUserId === user._id ? (
                                <>
                                  <FaSpinner className="animate-spin mr-1" /> Banning...
                                </>
                              ) : (
                                <>
                                  <FaBan className="mr-1" /> Ban User
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {users.map((user) => (
              <div key={user._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Card Header */}
                <div className="p-4 border-b border-gray-200" style={{ backgroundColor: PRIMARY_COLOR }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-lg" style={{ color: PRIMARY_COLOR }}>
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{user.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                   
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border bg-green-100 text-green-800 border-green-200`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-600 break-all">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FaCalendar className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Joined {dayjs(user.createdAt).format("DD MMM, YYYY")}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
                  {/* Promote to Admin Button - Only show for super-admin and for regular users */}
                  {currentUserRole === 'super-admin' && user.role === 'user' && (
                    <button
                      onClick={() => handlePromoteToAdmin(user._id, user.name)}
                      disabled={promotingUserId === user._id}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                        promotingUserId === user._id 
                          ? 'bg-[#ff7f23] text-white' 
                          : 'bg-[#ff7f23] hover:bg-[#ff6c03] text-white'
                      }`}
                    >
                      {promotingUserId === user._id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Promoting...
                        </>
                      ) : (
                        <>
                          <FaUserShield />
                          Make Admin
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Ban Button - Don't show for super-admin */}
                  {user.role !== 'super-admin' && (
                    <button
                      onClick={() => handleBanUser(user._id, user.name)}
                      disabled={banningUserId === user._id}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                        banningUserId === user._id 
                          ? 'bg-red-400 text-white' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {banningUserId === user._id ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Banning...
                        </>
                      ) : (
                        <>
                          <FaBan />
                          Ban User
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllUser;