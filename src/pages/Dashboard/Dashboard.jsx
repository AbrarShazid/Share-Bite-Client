import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole";
import { FaUsers, FaUserShield, FaUtensils, FaClipboardList, FaSync, FaChartLine, FaCrown } from "react-icons/fa";

const PRIMARY = "#ff6a00";
const SECONDARY = "#ff8c00";

// Modern stat card component with better design
const StatCard = ({ title, value, Icon, gradient, delay }) => (
  <div
    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    style={{
      animationDelay: `${delay}ms`,
      animation: 'fadeInUp 0.6s ease-out forwards'
    }}
  >
    {/* Background gradient effect */}
    <div
      className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${gradient}`}
    />

    {/* Icon with modern design */}
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
        <Icon className="text-xl" style={{ color: PRIMARY }} />
      </div>
      <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-green-400 transition-colors duration-300"></div>
    </div>

    {/* Content */}
    <div>
      <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
        {title}
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-1">
        {value ?? 0}
      </div>
      <div className="w-12 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
    </div>
  </div>
);



const Dashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { role, isLoading: roleLoading } = useUserRole();

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard-data");
      return res.data;
    },
    enabled: !!role,
  });

  // Enhanced loading state
  if (roleLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">

      </div>
    );
  }


  // Enhanced error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-lg bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <FaSync className="text-3xl text-orange-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Connection Issue</h3>
          <p className="text-gray-600 mb-2">{error?.message || "Unable to load dashboard data"}</p>
          <p className="text-sm text-gray-500 mb-6">Please check your connection and try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <FaSync className="animate-spin" />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }
  const { total_User = 0, total_Admin = 0, total_Food = 0, total_Req = 0 } = stats || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                  <FaChartLine className="text-xl" style={{ color: PRIMARY }} />
                </div>
                <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
              </div>
              <p className="text-gray-600 text-lg">
                Welcome to your administration dashboard
                {role === "super-admin" && (
                  <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    <FaCrown className="text-xs" />
                    Super Admin
                  </span>
                )}
                {role === "admin" && (
                  <span className="inline-flex items-center gap-1 ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    <FaUserShield className="text-xs" />
                    Admin
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-500">Last updated</div>
                <div className="text-sm font-medium text-gray-700">{new Date().toLocaleTimeString()}</div>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={total_User}
            Icon={FaUsers}
            gradient="bg-gradient-to-r from-blue-400 to-blue-600"
            delay={0}
          />
          <StatCard
            title="Total Admins"
            value={total_Admin}
            Icon={FaUserShield}
            gradient="bg-gradient-to-r from-purple-400 to-purple-600"
            delay={100}
          />
          <StatCard
            title="Total Foods"
            value={total_Food}
            Icon={FaUtensils}
            gradient="bg-gradient-to-r from-green-400 to-green-600"
            delay={200}
          />
          <StatCard
            title="Total Requests"
            value={total_Req}
            Icon={FaClipboardList}
            gradient="bg-gradient-to-r from-red-400 to-red-600"
            delay={300}
          />
        </div>


      </div>
    </div>
  );
};

export default Dashboard;